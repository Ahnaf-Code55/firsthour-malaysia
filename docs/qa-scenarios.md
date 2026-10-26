# QA scenarios

Five fictional scams. Each is checked by `tests/qa.test.ts` against the real data files:

- Steps come from `data/steps.json` through `buildPlan` (`src/lib/plan.ts`). Steps are listed in priority order.
- Flags come from `data/recovery-rules.json` through `scanMessage` (`src/lib/scan.ts`). They only apply to a follow-up message.

All names, numbers and links are made up.

## 1. Fake police call

- Payment: bank transfer
- Window: less than 1 hour ago
- Evidence:
  > Caller: This is Inspector Tan from the police. Move your savings to a safe account today.
  > Me: I transferred RM800 at 10:05.
- Expected steps: `call-bank`, `call-nsrc`, `police-report`, `semak-mule`, `no-recovery-fee`
- Follow-up message: none, so no flags apply.

## 2. Courier parcel

- Payment: e-wallet
- Window: less than 1 hour ago
- Evidence:
  > SMS: Your parcel is held at customs. Pay a RM5 release fee to receive it.
  > Me: I paid RM5 in my e-wallet at 09:40.
- Expected steps: `report-in-app`, `call-nsrc`, `police-report`, `semak-mule`, `no-recovery-fee`
- Follow-up message: none, so no flags apply.

## 3. Job offer

- Payment: bank transfer
- Window: 1 to 24 hours ago (outside the POC, so the out-of-scope banner shows)
- Evidence:
  > Chat: You are hired as a part-time data clerk. Pay a RM200 registration fee to start.
  > Me: I transferred RM200 yesterday afternoon.
- Expected steps: `call-nsrc`, `police-report`, `semak-mule`, `no-recovery-fee`
- Follow-up message: none, so no flags apply.

## 4. E-wallet link

- Payment: e-wallet
- Window: more than 24 hours ago (outside the POC, so the out-of-scope banner shows)
- Evidence:
  > Message: Verify your account at https://wallet-verify.example/login within 24 hours.
  > Me: I paid RM350 through that link last Tuesday.
- Expected steps: `call-nsrc`, `police-report`, `semak-mule`, `no-recovery-fee`
- Follow-up message: none, so no flags apply.

## 5. Recovery-fee follow-up

- Payment: bank transfer
- Window: less than 1 hour ago
- Evidence:
  > Me: I sent RM1,200 by bank transfer at 14:32 to A. Example, account 1234567890123.
  > Caller: Transfer it now and send me the receipt.
- Expected steps: `call-bank`, `call-nsrc`, `police-report`, `semak-mule`, `no-recovery-fee`
- Follow-up message (pasted into "Check a message"):
  > "Hi, I am Officer Daniel from the NSRC recovery unit. We can recover your RM1,200 but you must first pay a RM300 processing fee. Click https://nsrc-refund.example/claim to open your case."
- Expected flags, in order: `recovery-fee`, `fake-agent`, `refund-link`

## Findings

- **Fixed:** "Pay RM300 processing fee to get your money back." was not flagged. Patterns for "money back" and "return your money" were added to the `recovery-fee` rule, and `tests/qa.test.ts` now asserts the flag.
