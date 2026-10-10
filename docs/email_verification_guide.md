# Pilot Email Verification Architecture & Implementation Guide
**Comparative Analysis: `lucid-davinci` (Vanguard) vs. Tachyon Studios Ecosystem**

---

## 1. Executive Summary

In `lucid-davinci`, email verification was engineered with a mission-critical military aesthetic and a **Dual-Mode Verification Architecture** designed to accommodate both web players and in-cockpit pilots:

1. **Mode 1 (Web / Mobile Browser): One-Click Cryptographic URL Link (`GET /api/auth/verify?token=...`)**  
   Stateless HMAC-SHA256 signed URL token (24-hour validity). When clicked in an email client, the Edge Worker cryptographically validates the signature, marks the pilot verified in SQLite/D1, issues an authenticated JWT session token, and logs the pilot in immediately.
2. **Mode 2 (In-Game / Headless / HOTAS): 6-Digit Tactical Clearance Code (`POST /api/auth/verify`)**  
   Random 6-digit numerical code (e.g. `749281`, 30-minute validity) stored in the database. Allows pilots running inside Godot 4, Three.js, or companion PWAs to confirm clearance without leaving their game window.

This guide details how that system works, how it maps into Tachyon Studios, and how to operate both **Supabase Native OTP** and **Custom Cloudflare Edge / Brevo Dispatchers**.

---

## 2. Forensic Analysis of `lucid-davinci`

The verification pipeline in `lucid-davinci` is located in `website/functions/api/`:
- `_email.js`: Brevo transactional REST API client (`https://api.brevo.com/v3/smtp/email`) and HMAC token signing.
- `auth/register.js`: Generates the 6-digit code and HMAC token, inserts into DB, and triggers email dispatch.
- `auth/verify.js`: Dual-endpoint handling both GET (link token) and POST (6-digit code).
- `auth/resend-verification.js`: Rate-limited endpoint allowing pilots to request a fresh code.
- `verify.html`: Frontend interface with stateful switching between link confirmation and code entry.

### 2.1 The Cryptographic HMAC-SHA256 Token (Mode 1)
Instead of storing stateful link tokens in the database, `lucid-davinci` generated a stateless URL-safe token:

```javascript
// From lucid-davinci/website/functions/api/_email.js
export async function createVerificationToken(pilotId, email, secret) {
    const expiresAt = Math.floor(Date.now() / 1000) + 86400; // 24 hours
    const payload = JSON.stringify({ sub: pilotId, email, exp: expiresAt });
    const encodedPayload = btoa(payload).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    
    const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(encodedPayload));
    const sigStr = btoa(String.fromCharCode(...new Uint8Array(sigBuf)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
        
    return `${encodedPayload}.${sigStr}`;
}
```

### 2.2 The 6-Digit Tactical Code (Mode 2)
For pilots playing inside the Godot client, opening an external web browser is disruptive. A 6-digit numerical pin was generated on registration and stored with an explicit expiration:

```javascript
// 6-digit random code
const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
const verificationExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
```

### 2.3 The Transactional Email Dispatcher (Brevo API)
`lucid-davinci` utilized the **Brevo (Sendinblue) v3 REST API**:
- **Why Brevo?** Free tier provides **300 emails/day (9,000/month)** with zero credit card required and native REST JSON endpoints executable on edge workers (`fetch("https://api.brevo.com/v3/smtp/email")`).
- **Dev-Safe Mock:** If `BREVO_API_KEY` was not configured in environment secrets, the code logged the verification link and 6-digit code cleanly to the terminal/console without throwing an unhandled exception.

---

## 3. Tachyon Studios Implementation Architecture

In Tachyon Studios, we have implemented this exact dual-mode verification model, providing two deployment pathways:

```
                                    +--------------------------------------------------+
                                    |        Pilot Registration (/register)            |
                                    +--------------------------------------------------+
                                                             |
                                                             v
                                            Generates Callsign & Profile
                                                             |
                           +---------------------------------+---------------------------------+
                           |                                                                   |
                           v                                                                   v
            [Pathway A: Supabase Native OTP]                                 [Pathway B: Cloudflare Edge + Brevo]
         - Uses Supabase Auth built-in SMTP                                - Uses Brevo REST API v3
         - Generates 6-digit Email OTP & Magic Link                        - Custom Tachyon Military HTML template
         - Zero external worker code needed                                - Custom sender: command@tachyon.get.be.eu.org
                           |                                                                   |
                           +---------------------------------+---------------------------------+
                                                             |
                                                             v
                                          Dispatches Clearance Email
                                                             |
                           +---------------------------------+---------------------------------+
                           |                                                                   |
                           v                                                                   v
              [Mode 1: One-Click URL]                                             [Mode 2: 6-Digit In-Game Code]
     - User clicks: /verify?token=...                                      - User enters 6 digits in UI or Godot
     - Auto-verifies & issues Auth Token                                   - Validates against 30-min TTL
     - Redirects to /games with session                                    - Immediately unlocks Star-Vault
```

---

## 4. How to Configure the Pathways

### Pathway A: Supabase Native Auth (Default & Zero-Friction)
Supabase provides built-in OTP and Magic Link verification:

1. **Dashboard Configuration:**
   - Go to **Supabase Dashboard** -> **Authentication** -> **Email Templates**.
   - Under **Confirm signup**, customize the subject: `Tachyon Aerospace Command // Tactical Clearance`.
   - Use the 6-digit token code placeholder: `{{ .Token }}` or the link: `{{ .ConfirmationURL }}`.
2. **Frontend Verification (`apps/web-gateway/src/pages/Verify.tsx`):**
   - Validating 6-digit code:
     ```typescript
     const { data, error } = await supabase.auth.verifyOtp({
       email: email.trim(),
       token: code.trim(),
       type: 'signup'
     });
     ```
   - Validating one-click link:
     ```typescript
     const { data, error } = await supabase.auth.verifyOtp({
       token_hash: token,
       type: 'email'
     });
     ```

### Pathway B: Brevo / Edge Worker Custom Dispatcher (Exact Lucid-Davinci Mirror)
If sending emails directly from Cloudflare Edge with custom sender domains:

1. **Environment Variables (`wrangler.toml` or Cloudflare Secrets):**
   ```toml
   [vars]
   BREVO_SENDER_NAME = "Tachyon Fleet Command"
   BREVO_SENDER_EMAIL = "command@tachyon.get.be.eu.org"
   AUTH_SECRET = "tachyon-defense-aerospace-secret-2026"

   # Stored via: npx wrangler secret put BREVO_API_KEY
   ```

2. **Dispatcher Function (`apps/web-gateway/src/lib/emailDispatcher.ts`):**
   ```typescript
   export async function dispatchClearanceEmail({
     email,
     callsign,
     code,
     verifyUrl,
     apiKey
   }: {
     email: string;
     callsign: string;
     code: string;
     verifyUrl: string;
     apiKey?: string;
   }) {
     if (!apiKey) {
       console.log(`[Dev Verification Dispatch] Pilot: ${callsign} | Code: ${code} | URL: ${verifyUrl}`);
       return { success: true, simulated: true };
     }

     const res = await fetch("https://api.brevo.com/v3/smtp/email", {
       method: "POST",
       headers: {
         "api-key": apiKey,
         "Content-Type": "application/json",
         "Accept": "application/json"
       },
       body: JSON.stringify({
         sender: { name: "Tachyon Fleet Command", email: "command@tachyon.get.be.eu.org" },
         to: [{ email, name: callsign }],
         subject: `[CLEARANCE DISPATCH] Verify Pilot Frequency: ${callsign}`,
         htmlContent: `
           <div style="background:#0B0D11; color:#fff; font-family:monospace; padding:32px; border:1px solid #1E293B;">
             <h2 style="color:#00F3FF; margin-top:0;">TACHYON AEROSPACE DEFENSE FLEET</h2>
             <p>COMMISSION DIRECTIVE FOR PILOT: <strong>${callsign}</strong></p>
             <p>Your 6-digit tactical clearance code is:</p>
             <div style="font-size:32px; font-weight:bold; letter-spacing:8px; color:#00F3FF; background:#121212; padding:16px; border:1px solid #00F3FF; text-align:center; margin:24px 0;">
               ${code}
             </div>
             <p style="color:#94a3b8; font-size:12px;">Valid for 30 minutes from transmission.</p>
             <div style="text-align:center; margin:32px 0;">
               <a href="${verifyUrl}" style="background:#00F3FF; color:#000; font-weight:bold; padding:14px 28px; text-decoration:none; border-radius:4px; text-transform:uppercase;">
                 Confirm Pilot Clearance (One-Click)
               </a>
             </div>
           </div>
         `
       })
     });

     return { success: res.ok };
   }
   ```

---

## 5. Godot 4 In-Engine Client Integration (`auth_manager.gd`)

In the upcoming `apps/game-client-01` (Godot 4), pilots verify clearance directly in the cockpit HUD using the 6-digit code:

```gdscript
# auth_manager.gd
extends Node

signal verification_success(pilot_data)
signal verification_failed(error_message)

const VERIFY_API_URL = "https://tachyon.get.be.eu.org/api/auth/verify"

func submit_tactical_code(email: String, code: String) -> void:
    var http = HTTPRequest.new()
    add_child(http)
    http.request_completed.connect(_on_verify_completed.bind(http))
    
    var payload = JSON.stringify({
        "email": email.strip_edges(),
        "code": code.strip_edges()
    })
    
    var headers = ["Content-Type: application/json"]
    http.request(VERIFY_API_URL, headers, HTTPClient.METHOD_POST, payload)

func _on_verify_completed(result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray, http_node: HTTPRequest) -> void:
    http_node.queue_free()
    
    if response_code == 200:
        var json = JSON.parse_string(body.get_string_from_utf8())
        emit_signal("verification_success", json)
    else:
        var err_json = JSON.parse_string(body.get_string_from_utf8())
        var msg = err_json.get("error", "Clearance authentication failed.")
        emit_signal("verification_failed", msg)
```

---

## 6. Live Status & Verification Page

The live Tachyon verification page is operational and deployed to Cloudflare Edge:
* **Live URL:** [https://tachyon.get.be.eu.org/verify](https://tachyon.get.be.eu.org/verify)
* **Features:**
  * Auto-reads `?token=...` or `#access_token=...` for instant one-click approval.
  * Interactive 6-digit tactical code input with real-time digit formatting and haptic detent feedback.
  * Resend verification button with countdown rate-limiting.
  * Full audio feedback with synthesized confirmation chimes.
