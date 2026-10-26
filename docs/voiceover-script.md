# Voice-over (generated locally)

The demo video's voice-over is generated on this machine with Kokoro (an open text-to-speech model, run offline through `kokoro-onnx`, voice `af_heart`, speed 0.95), then levelled to about -16 LUFS. It is timed to the picture: each sentence starts when its shot starts.

Lines, in order (the bold ones are the connecting lines added so the narration is nearly continuous):

1. "A fake police inspector just took RM twelve hundred ringgit from a student. That was four minutes ago."
2. **"So the student copies the chat."**
3. "Most scam tools try to stop a scam before the money moves. FirstHour starts after the loss."
4. **"And here's the plan."**
5. "It reads the messages, and pins every fact to the exact line it came from. The amount. Who was paid. The account number."
6. **"Each fact has its source. You can check it."**
7. "Then it writes the script for the bank call, ready to copy. In English, on purpose, so the bank can follow it."
8. **"Now, what should you do first?"**
9. "Next, what to do first, with tap to call. Every number comes from an official page, with the date we checked it. Tick a step, and it goes on your timeline."
10. **"Your timeline keeps the record."** **"And nine nine seven is one tap away."**
11. "Later, someone offers to get the money back, for a fee. FirstHour tells you why that's a second scam, and who to call instead."
12. **"Each warning comes with its reason, and the police source."**
13. "English, or Bangla. Nothing you typed is lost." **"Same facts. Same steps."**
14. "And a summary to print, for the police and the bank. FirstHour never contacts your bank, files a report, or promises to get your money back."
15. **"At the bottom, every source, with the date we checked it."**
16. "FirstHour Malaysia. The first safe hour after a scam."

If you would rather use your own voice, read these lines over `demo-video/firsthour-demo-silent.mp4` and mix with:

```bash
ffmpeg -i demo-video/firsthour-demo-silent.mp4 -i voice.m4a -map 0:v -map 1:a -c:v copy -c:a aac -shortest demo-video/firsthour-demo-voice.mp4
```
