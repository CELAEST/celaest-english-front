# Edge Neural TTS Protocol & Production Stream Architecture

## Root Cause Diagnosed (September 2026 Incident)
1. **Third-party fallback certificate expiration**: The secondary TikTok TTS gateway (`ottsy.weilbyte.dev`) SSL certificate expired on 2026-09-21T21:40:19Z, causing cascading connection failures.
2. **Microsoft Edge TTS protocol update**: Microsoft Bing Speech Platform began rejecting legacy WebSocket handshakes without Chrome 143 headers, returning `403 Forbidden` (`bad handshake`).
3. **Google TTS length limitation**: Fallback requests over 150 characters without chunking failed with HTTP 400.

## Architectural Standard Applied
1. **Native Go WebSocket with Chrome 143 Protocol**:
   - `User-Agent`: Chrome 143 (`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0`)
   - `Sec-MS-GEC-Version`: `1-143.0.3650.75`
   - `Cookie`: `muid=<random 16 bytes hex>`
   - Automated clock-skew compensation: on HTTP 403, parses the server `Date` header, recalculates `Sec-MS-GEC` with skew delta, and retries synchronously.
2. **Dual-Redundant Alpine Container**:
   - Dockerfile provisions `python3`, `py3-pip`, and `edge-tts` inside the runtime container, with `scripts/edge_synth.py` available as secondary neural fallback.
3. **Chunked Sentence Google TTS Fallback**:
   - Sentence chunking for texts > 150 characters ensures HTTP 400 is never returned.
4. **Sub-Millisecond Word Boundaries**:
   - Both Aria (`en-US-AriaNeural`) and Christopher (`en-US-ChristopherNeural`) return sub-millisecond word boundaries via `x-word-boundaries` header for 100% exact reading karaoke.
