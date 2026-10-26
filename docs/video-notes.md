# How the demo video was made

`demo-video/firsthour-demo.mp4`: 85 seconds, 1920x1080, 30 fps, with a locally generated voice-over. Made with the motionmaxxing skill (HTML film rendered frame by frame in Chrome) plus Kokoro for the voice.

**The idea.** FirstHour's claim is "every fact points back to the line it came from". The film performs it: the scam chat sits on the left, the app on the right, and a thread draws from each fact to the exact words in the chat that it was read from. The one red moment in the film is the recovery-scam warning.

**What is real.** The app screens are captured from the running app at phone size, read live by Gemini on the free tier ("Read by AI from your messages" is visible on screen), with the clock set to 14:37 so the timeline matches the story. The text is the demo scenario in `data/demo-scenario.json`. The bank numbers and sources shown are the app's real, dated sources.

**What is illustrative.** The scam chat and the "Officer Daniel" message are made-up, fictional content drawn in HTML, not a real app or real people. Every name, number and account in the film is fictional.

**Voice.** Kokoro (`af_heart`, speed 0.95) run offline on this machine, one clip per sentence so the cues land on the picture. Not a person's voice. Sound effects (taps, a low hit on the warning) are synthesised with ffmpeg.

**Measured (look.py / lint.mjs on the final file):** duration 85.4 s matches plan, audio present at -16.0 LUFS, true peak -3.8 dBFS (G0 pass); no empty frame (G2 pass); end hold 1.0 s and final shot 21% of the film (G3 pass); no page chrome (G5 pass). G1 and G4 were checked by eye on the contact sheet. The film is calmer than the usual human range (mean frame change 3.2 against a median of 6.8): that is deliberate for this brand, but the longest near-still stretch is 4.0 s (the facts appear and sit before the threads draw).

**Known weak spots.** Only 3 of 13 cuts land within 80 ms of a sound onset. The voice is a text-to-speech voice and will sound like one. The Bangla plate in the film comes from the AI-reviewed text, not yet read by a human Bangla speaker.

**Rebuild.** Source is in `film/` (git-ignored): `index.html` (the film), `plates/` (captured screens), `capture-plates.mjs`. Voice and mix scripts are in the session scratchpad and described in `docs/voiceover-script.md`.
