import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Headphones,
  Keyboard,
  Clock,
  RotateCcw,
  Inbox,
  X,
  Check,
} from "lucide-react";
import { getSipConfig, isSipConfigured, getSipDomain, getSipExtension } from "@/sip";
import type { Database } from "@/types/database";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

interface SoftphoneProps {
  lead: Lead | null;
  onCallEnd?: (outcome: {
    outcome: string;
    duration: number;
    notes: string;
    direction: "outbound" | "inbound";
  }) => void;
}

type CallState = "idle" | "connecting" | "ringing" | "active" | "on_hold" | "muted" | "ended";

export function Softphone({ lead, onCallEnd }: SoftphoneProps) {
  const [callState, setCallState] = useState<CallState>("idle");
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("no_answer");
  const [direction, setDirection] = useState<"outbound" | "inbound">("outbound");
  const [keypadVisible, setKeypadVisible] = useState(false);
  const [dialNumber, setDialNumber] = useState("");
  const [holdActive, setHoldActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{
    callerNumber: string;
    callerName: string;
    session: any;
  } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRef = useRef<any>(null);
  const inboundSessionRef = useRef<any>(null);
  const wasEstablishedRef = useRef(false);
  const callStateRef = useRef<CallState>("idle");

  const phoneNumber = lead?.phone ?? dialNumber;

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  useEffect(() => {
    if (callState === "active" || callState === "ringing" || callState === "connecting") {
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (inboundSessionRef.current) {
        try { inboundSessionRef.current.terminate(); } catch {}
        inboundSessionRef.current = null;
      }
    };
  }, [callState]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const startSimulatedCall = useCallback(() => {
    setCallState("connecting");
    setTimeout(() => setCallState("ringing"), 1500);
    setTimeout(() => setCallState("active"), 4000);
  }, []);

  const startCall = useCallback(async () => {
    if (!phoneNumber) return;
    setCallState("connecting");
    setDuration(0);
    setNotes("");
    setOutcome("no_answer");
    wasEstablishedRef.current = false;

    const sipConfig = getSipConfig();

    if (!isSipConfigured()) {
      console.warn("SIP not configured, using simulated call");
      startSimulatedCall();
      return;
    }

    try {
      const { UserAgent, Registerer, Inviter, SessionState } = await import("sip.js");

      const domain = getSipDomain();
      const target = UserAgent.makeURI(`sip:${phoneNumber}@${domain}`);
      if (!target) {
        setCallState("ended");
        return;
      }

      const extraHeaders: string[] = [];
      if (sipConfig.callerId) {
        extraHeaders.push(`P-Asserted-Identity: <sip:${sipConfig.callerId}@${domain}>`);
      }

      const userAgent = new UserAgent({
        uri: UserAgent.makeURI(sipConfig.uri),
        displayName: sipConfig.callerId || undefined,
        transportOptions: {
          server: sipConfig.wsUrl || `wss://${domain}:5066`,
        },
        authorizationUsername: getSipExtension(),
        authorizationPassword: sipConfig.password,
      });

      userAgent.delegate = {
        onInvite: async (session: any) => {
          inboundSessionRef.current = session;
          const remoteIdentity = session.remoteIdentity;
          const fromUri = remoteIdentity?.uri?.user ?? remoteIdentity?.user ?? "Unknown";
          const displayName = remoteIdentity?.displayName ?? "";
          setIncomingCall({
            callerNumber: fromUri,
            callerName: displayName || fromUri,
            session,
          });
          setCallState("ringing");
          setDirection("inbound");
        },
      };

      const registerer = new Registerer(userAgent);

      const connectionTimeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("SIP connection timeout")), 8000)
      );

      await Promise.race([userAgent.start(), connectionTimeout]);
      await Promise.race([registerer.register(), connectionTimeout]);

      const inviter = new Inviter(userAgent, target, {
        sessionDescriptionHandlerOptions: {
          constraints: { audio: true, video: false },
        },
        extraHeaders,
      });

      sessionRef.current = inviter;

      inviter.stateChange.addListener((state: string) => {
        if (state === SessionState.Established) {
          wasEstablishedRef.current = true;
          setCallState("active");
          setOutcome("answered");
        } else if (state === SessionState.Terminated) {
          if (!wasEstablishedRef.current && callStateRef.current === "ringing") {
            setOutcome("no_answer");
          }
          setCallState("ended");
        } else if (state === SessionState.Establishing) {
          setCallState("ringing");
        }
      });

      await inviter.invite();
      setCallState("ringing");
    } catch (err) {
      console.warn("SIP.js call failed, using simulated call:", err);
      startSimulatedCall();
    }
  }, [phoneNumber, startSimulatedCall]);

  const endCall = useCallback(() => {
    if (sessionRef.current) {
      try {
        sessionRef.current.bye();
      } catch {
        try { sessionRef.current.terminate(); } catch {}
      }
      sessionRef.current = null;
    }
    if (inboundSessionRef.current) {
      try { inboundSessionRef.current.terminate(); } catch {}
      inboundSessionRef.current = null;
    }
    setIncomingCall(null);
    setCallState("ended");
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const toggleMute = useCallback(() => {
    if (callState === "active") {
      setCallState("muted");
    } else if (callState === "muted") {
      setCallState("active");
    }
  }, [callState]);

  const toggleHold = useCallback(() => {
    if (callState === "active") {
      setHoldActive(true);
      setCallState("on_hold");
    } else if (callState === "on_hold") {
      setHoldActive(false);
      setCallState("active");
    }
  }, [callState]);

  const handleSaveOutcome = useCallback(() => {
    if (onCallEnd) {
      onCallEnd({ outcome, duration, notes, direction });
    }
    setCallState("idle");
    setDuration(0);
    setNotes("");
    setOutcome("no_answer");
    setDirection("outbound");
  }, [onCallEnd, outcome, duration, notes, direction]);

  const handleAcceptIncomingCall = useCallback(async () => {
    const session = inboundSessionRef.current;
    if (!session) return;
    try {
      await session.accept();
      setCallState("active");
      setIncomingCall(null);
    } catch (err) {
      console.warn("Failed to accept incoming call:", err);
    }
  }, []);

  const handleRejectIncomingCall = useCallback(() => {
    const session = inboundSessionRef.current;
    if (!session) return;
    try {
      session.reject(486);
    } catch {}
    inboundSessionRef.current = null;
    setIncomingCall(null);
    setCallState("idle");
  }, []);

  const handleRedial = useCallback(() => {
    setCallState("idle");
    setDuration(0);
    setTimeout(() => startCall(), 300);
  }, [startCall]);

  const keypadKeys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ];

  const stateLabel: Record<CallState, string> = {
    idle: "Ready",
    connecting: "Connecting...",
    ringing: incomingCall ? "Incoming Call..." : "Ringing...",
    active: incomingCall ? "In Call" : "Connected",
    on_hold: "On Hold",
    muted: "Muted",
    ended: "Call Ended",
  };

  if (!lead) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-center h-48 text-gray-400">
          <div className="text-center">
            <Phone className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">Select a lead to start a call</p>
            <p className="text-xs mt-1">Navigate to a lead detail page and use the dialer</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className={`px-5 py-4 ${
        callState === "active"
          ? "bg-gradient-to-r from-green-600 to-green-700"
          : callState === "ended"
          ? "bg-gradient-to-r from-red-600 to-red-700"
          : "bg-gradient-to-r from-brand-600 to-brand-700"
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate">
              {lead.first_name} {lead.last_name}
            </p>
            <p className="text-white/80 text-sm truncate">{lead.company ?? lead.email ?? "No contact info"}</p>
          </div>
          <div className="text-right">
            {callState !== "idle" ? (
              <>
                <div className="flex items-center gap-1 text-white text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-mono">{formatDuration(duration)}</span>
                </div>
                <div className={`w-2 h-2 rounded-full mt-1 ${
                  callState === "active" ? "bg-green-400 animate-pulse" :
                  callState === "on_hold" || callState === "muted" ? "bg-yellow-400" :
                  callState === "ended" ? "bg-red-400" :
                  "bg-white/60 animate-pulse"
                }`} />
              </>
            ) : (
              <span className="text-white/60 text-xs">Ready</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="text-center">
          <p className="text-2xl font-mono font-semibold text-gray-900">{phoneNumber || "—"}</p>
          <p className={`text-xs mt-1 font-medium ${
            callState === "active" ? "text-green-600" :
            callState === "ended" ? "text-red-600" :
            callState === "on_hold" || callState === "muted" ? "text-amber-600" :
            "text-gray-400"
          }`}>{stateLabel[callState]}</p>
        </div>

        <div className="flex items-center justify-center gap-4">
          {callState === "idle" || callState === "ended" ? (
            <>
              <button
                onClick={callState === "ended" ? handleRedial : startCall}
                disabled={!phoneNumber}
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-white shadow-lg shadow-green-500/30 transition hover:scale-105"
              >
                {callState === "ended" ? (
                  <RotateCcw className="w-6 h-6" />
                ) : (
                  <Phone className="w-6 h-6" />
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={endCall}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30 transition hover:scale-105"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
              <button
                onClick={toggleMute}
                disabled={callState === "on_hold"}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-105 ${
                  callState === "muted" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {callState === "muted" ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleHold}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-105 ${
                  callState === "on_hold" ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Headphones className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setKeypadVisible(!keypadVisible)}
            className={`p-2 rounded-lg transition ${keypadVisible ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>

        {keypadVisible && (
          <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
            {keypadKeys.flat().map((key) => (
              <button
                key={key}
                onClick={() => setDialNumber((prev) => prev + key)}
                className="w-full aspect-square flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-lg font-semibold text-gray-800 transition"
              >
                {key}
              </button>
            ))}
          </div>
        )}

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Outcome</label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
            >
              <option value="no_answer">No Answer</option>
              <option value="answered">Answered</option>
              <option value="busy">Busy</option>
              <option value="voicemail">Voicemail</option>
              <option value="dnc">DNC</option>
              <option value="wrong_number">Wrong Number</option>
              <option value="disconnected">Disconnected</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
              placeholder="Add call notes..."
            />
          </div>
          <button
            onClick={handleSaveOutcome}
            disabled={callState !== "ended"}
            className="w-full py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition"
          >
            Save & Next
          </button>
        </div>
      </div>
    </div>
    {incomingCall && (
      <IncomingCallBanner
        callerName={incomingCall.callerName}
        callerNumber={incomingCall.callerNumber}
        onAccept={handleAcceptIncomingCall}
        onReject={handleRejectIncomingCall}
      />
    )}
    </>
  );
}

function IncomingCallBanner({ callerName, callerNumber, onAccept, onReject }: { callerName: string; callerNumber: string; onAccept: () => void; onReject: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto animate-pulse">
          <Phone className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Incoming Call</h3>
          <p className="text-sm text-gray-600">{callerName || "Unknown"}</p>
          <p className="text-sm font-mono text-gray-500">{callerNumber}</p>
        </div>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={onReject}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30 transition"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
          <button
            onClick={onAccept}
            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30 transition"
          >
            <Check className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
