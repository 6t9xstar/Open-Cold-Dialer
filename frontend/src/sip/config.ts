export interface SipConfig {
  uri: string;
  password: string;
  wsUrl: string;
  callerId: string;
  provider: "signalwire" | "telnyx" | "twilio" | "custom";
}

export interface SipPreset {
  wsPort: number;
  registrationInterval: number;
  stunServer: string;
}

export const SIP_PRESETS: Record<string, SipPreset> = {
  signalwire: {
    wsPort: 5066,
    registrationInterval: 600,
    stunServer: "stun:signalwire.com",
  },
  telnyx: {
    wsPort: 443,
    registrationInterval: 3600,
    stunServer: "stun:telnyx.com",
  },
  twilio: {
    wsPort: 443,
    registrationInterval: 3600,
    stunServer: "stun:twilio.com",
  },
  custom: {
    wsPort: 5066,
    registrationInterval: 3600,
    stunServer: "",
  },
};

export function getSipConfig(): SipConfig {
  return {
    uri: import.meta.env.VITE_SIP_URI || "",
    password: import.meta.env.VITE_SIP_PASSWORD || "",
    wsUrl: import.meta.env.VITE_SIP_WS_URL || "",
    callerId: import.meta.env.VITE_SIP_CALLER_ID || "",
    provider: (import.meta.env.VITE_SIP_PROVIDER as SipConfig["provider"]) || "custom",
  };
}

export function isSipConfigured(): boolean {
  const config = getSipConfig();
  return Boolean(config.uri && config.password);
}

export function getSipDomain(): string {
  const config = getSipConfig();
  return config.uri.split("@")[1] || "";
}

export function getSipExtension(): string {
  const config = getSipConfig();
  return config.uri.split("@")[0].replace("sip:", "") || "";
}
