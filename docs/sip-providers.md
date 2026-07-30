# SIP Provider Setup

Cold Dialer works with any SIP provider. Here's how to configure popular providers.

## SignalWire

1. Create account at [signalwire.com](https://signalwire.com)
2. Create a SIP endpoint in your project
3. Note your SIP credentials

```env
VITE_SIP_URI=sip:your-extension@your-project.sip.signalwire.com
VITE_SIP_PASSWORD=your-password
VITE_SIP_WS_URL=wss://your-project.sip.signalwire.com
VITE_SIP_CALLER_ID=+1XXXXXXXXXX
```

**Notes:**
- Free tier includes $4 credit
- Toll-free numbers require verification
- Local numbers work immediately

## Telnyx

1. Create account at [telnyx.com](https://telnyx.com)
2. Create a SIP connection in Mission Control
3. Buy a phone number

```env
VITE_SIP_URI=sip:username@sip.telnyx.com
VITE_SIP_PASSWORD=your-password
VITE_SIP_WS_URL=wss://sip.telnyx.com:8443
VITE_SIP_CALLER_ID=+1XXXXXXXXXX
```

**Notes:**
- Free trial includes $10 credit
- Requires paid plan to buy numbers
- Excellent call quality

## Twilio

1. Create account at [twilio.com](https://twilio.com)
2. Create a SIP domain in Console
3. Buy a phone number

```env
VITE_SIP_URI=sip:your-sip-domain.pstn.twilio.com
VITE_SIP_PASSWORD=your-password
VITE_SIP_WS_URL=wss://your-sip-domain.pstn.twilio.com
VITE_SIP_CALLER_ID=+1XXXXXXXXXX
```

## Custom SIP Server

For Asterisk, FreeSWITCH, or other SIP servers:

```env
VITE_SIP_URI=sip:username@your-server.com
VITE_SIP_PASSWORD=your-password
VITE_SIP_WS_URL=wss://your-server.com:8089
VITE_SIP_CALLER_ID=+1XXXXXXXXXX
```

## Testing Without a Provider

If SIP is not configured, the app uses simulated calls:

1. Leave SIP env vars empty
2. Click "Call" on any lead
3. The app simulates connecting, ringing, and active states

## Audio Requirements

- Microphone access is required for calls
- Use headphones to prevent echo
- Test your audio in browser settings
