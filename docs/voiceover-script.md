# Voice-over script (timed to demo-video/firsthour-demo.mp4, 76 seconds)

Speak calmly, a little slower than normal. Each line fits its scene; if you run long, cut the last sentence of the line. Do not promise that money comes back.

| Time | On screen | Say |
|---|---|---|
| 0:00 to 0:04 | Title | "FirstHour Malaysia. The first safe hour after a scam." |
| 0:04 to 0:12 | 1. Messages pasted | "A fake police inspector has just taken RM 1,200 from a student. Most scam tools try to stop the scam before the money moves. FirstHour starts after the loss." |
| 0:12 to 0:21 | 2. Facts with quotes | "FirstHour reads the messages and pins every fact to the exact line it came from: the amount, who was paid, the account number. If anything is wrong, you can edit it." |
| 0:21 to 0:29 | 3. Call script | "It fills in a script for the bank call, ready to copy. The script is in English on purpose, so the bank can follow it." |
| 0:29 to 0:38 | 4. Steps and bank | "Then what to do first, with tap-to-call. Every number comes from an official page, with the date we checked it. The AI never writes a phone number." |
| 0:38 to 0:45 | 5. Timeline | "Tick a step, and it goes on your timeline." |
| 0:45 to 0:55 | 6. Warning | "Later, someone offers to recover the money for a fee. FirstHour tells you why that is a second scam, and who to call instead." |
| 0:55 to 1:02 | 7. Bangla | "It works in English and Bangla, and nothing you entered is lost." |
| 1:02 to 1:10 | 8. Summary | "A printable summary to take to the police and the bank. FirstHour never contacts your bank, files reports, or promises to recover money." |
| 1:10 to 1:16 | End card | "FirstHour Malaysia. The first safe hour after a scam." |

## Add it to the video
Record your voice as `voice.m4a` (any phone voice recorder works), put it next to the video, then:

```bash
ffmpeg -i demo-video/firsthour-demo.mp4 -i voice.m4a -map 0:v -map 1:a -c:v copy -c:a aac -shortest demo-video/firsthour-demo-voice.mp4
```

If your recording is longer than 76 seconds, trim it or speed it up slightly before mixing.
