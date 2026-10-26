# Security and privacy

FirstHour is a guide for people responding to a suspected scam. It does not contact banks, submit reports, or promise that money can be recovered. Use fictional evidence in demonstrations.

## Evidence and data flow

- The app keeps answers, extracted facts, and uploaded screenshots in browser memory while the page is open. It does not write evidence to local storage, cookies, a database, or disk.
- In live mode, text evidence and an optional resized screenshot are sent to this app's `/api/extract` endpoint, then to the configured AI provider for fact extraction. Fixture mode uses a saved fictional sample and makes no network request.
- The model sees the supplied evidence and is asked to extract facts only. The server validates its response against exact evidence quotes and a fixed output schema. Live extraction leaves the payee blank because a scam message could misclassify an instruction as a name; enter and check the payee yourself before it appears in the call script. The model cannot add recovery steps or contact numbers to the plan.
- Evidence, screenshots, API keys, and provider error details are not written to application logs. The endpoint applies input limits, a per-process rate limit, and provider timeouts.
- Evidence is limited to 8,000 JavaScript UTF-16 code units. Clock times may use 12-hour or 24-hour notation and Bangla digits, but must be supported by the evidence quote. The API checks prepared JPEG marker structure, dimensions, scan data and the end marker before forwarding; this structural check is not a full image decoder.
- Closing or reloading the page clears in-memory evidence. The browser, hosting provider, and selected AI provider may still process ordinary network and operational metadata under their own policies.

## Provider-specific warning

When Gemini API is used on its unpaid tier, Google may use submitted content and generated responses to improve its products and machine-learning technologies. Human reviewers may also process that content. Do not submit sensitive, confidential, or personal information to that tier. Use only fictional evidence with Gemini's free tier. See [Google's Gemini API Additional Terms](https://ai.google.dev/gemini-api/terms?hl=en) and [Gemini API billing documentation](https://ai.google.dev/gemini-api/docs/billing). Paid tier terms differ; review the provider's current terms before use.

## Risks and safeguards

- AI may misread text or images. Extracted facts are editable and are not treated as advice; next steps and contact details come from the app's sourced JSON data.
- Evidence can contain hostile instructions. It is treated as data, constrained to a fixed output shape, and checked before it is shown.
- Screenshots can include private information. Image processing re-encodes accepted PNG/JPEG files in memory to remove metadata and reduce dimensions; avoid uploading real victim evidence.
- A compromised or malicious browser, server, provider account, or dependency could expose evidence or keys. Keep keys in server-side environment variables, update dependencies, and do not publish real victim data.
- The production Content Security Policy restricts scripts, fonts, and connections to the same origin. It allows inline styles because Vite injects styles during development. Vite also adds a local React refresh bootstrap before the CSP meta tag in development; the production build does not include that bootstrap, and its application scripts are same-origin.

## Reporting

Do not include personal or victim evidence in a report. Report security issues privately to the repository maintainers before public disclosure.
