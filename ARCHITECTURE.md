# Course Consultation Assistant Architecture

## Components

The browser uses Agora RTC for audio and RTM for transcript and Agent events. Next.js only signs credentials and starts/stops the managed Agent. No business session, data API, local file store or persistent application database is required. Native Node.js, Docker and a Next.js-compatible serverless deployment use the same conversation flow. Actual hosted voice acceptance remains a separate check.

## Session time limit

LandingPage enforces a ten-minute browser session deadline from successful startup. It reuses the manual stop flow, checks wall time every second and on focus/visibility changes, and retries failed stops every five seconds. Successful stop retains the transcript and shows a timeout notice; starting again resets the deadline. Effect cleanup removes the timer/listeners. This is not a server-side usage cap: closed pages, suspended devices and network failures can delay Agent shutdown.

The conversation header shows a small, muted countdown (10:00 left) immediately before the connection status. The last minute is highlighted, with an automatic-stop notice for screen readers. At the deadline the timer stays at 00:00 until stopping succeeds. Screen readers do not announce every tick.

## Start and stop

The page requests an RTC/RTM token and starts the managed Agent using requester_id and channel_name. RTM is ready before the RTC conversation component mounts. End conversation stops the Agent, logs out RTM and unmounts hook-owned media. No customer, shopping, follow-up or event session participates in startup.

## State

Scenario instructions and static public reference material are bundled with the app. Current-call transcript, activity and Inspector state live in browser memory. There is no business Map, writable result file, business API or application database.

## Ownership and invariants

LandingPage owns bootstrap and RTM. ConversationComponent owns RTC/toolkit subscriptions and uses the StrictMode guard. Preserve local-user UID normalization and interrupted turns. Token, invite and stop routes own privileged operations. lib/agent-tools.ts always returns an empty list.

## Deployment

The browser uses Agora RTC for audio and RTM for transcript and Agent events. Next.js only signs credentials and starts/stops the managed Agent. No business session, data API, local file store or persistent application database is required. Native Node.js, Docker and a Next.js-compatible serverless deployment use the same conversation flow. Actual hosted voice acceptance remains a separate check.

Supply NEXT_PUBLIC_AGORA_APP_ID at build and runtime and keep NEXT_AGORA_APP_CERTIFICATE server-only. No persistent volume is required. Synthetic verification does not prove real speech or hosted reachability.

## Usage FAQ ownership

`components/ScenarioFaq.tsx` owns static usage answers; `styles/faq.css` owns disclosure styling, scrolling and transitions. Its header trigger and content share a Radix Dialog root in `LandingPage`. Dialog handles focus trapping, Escape/backdrop dismissal and returning focus to the trigger. FAQ has no session or business API calls.


<a id="conversation-behavior"></a>

## Scenario behavior — 2026-11-18

Explore fictional Austin rentals, compare housing preferences and walk through a simulated viewing.

### Conversation flow

Role-play following up on a rental inquiry. The browser user starts this demonstration; no outbound phone call has been placed and no prior inquiry record is available. Say once that properties, prices and viewing slots are fictional and no real appointment or lead will be saved. Ask permission for a short discussion; answer a property question first if the caller already asks one. Respect refusal and stop requests without pressure.

Ask one question at a time about the preferred area, maximum monthly rent in USD, bedrooms and move-in timing, reusing details already provided. Ask about a listed feature only when useful. Do not ask about protected characteristics, family composition, nationality, disability, credit, income or immigration status. Do not infer these from accent or language. Compare only configured properties using the caller's stated budget and housing needs; never recommend neighborhoods based on who lives there, make safety or school-quality claims, or decide eligibility. Offer at most two matching examples. Treat monthly rent separately from deposits, utilities, fees and lease terms that are unconfigured. If none fits, explain the mismatch and ask whether one housing preference can change; do not silently raise the budget or invent a listing. Move-in timing is a preference, not proof of availability.

For a simulated viewing, use only generated future viewingSlots for the selected property. Give the exact date, start/end time and America/Chicago time zone with the supplied date-correct UTC offset. Do not offer today, past times or unlisted slots. These slots are demonstration configuration, not live availability. Ask the caller to clarify an ambiguous relative date once. If a slot does not fit, offer up to two configured alternatives. Do not promise accommodation or accessibility features absent from the reference.

Before simulated confirmation, recap the property, fictional address, monthly rent, chosen exact viewing date/time/time zone and the fact that no real viewing is booked. Ask one explicit confirmation question. Only after agreement say: Your simulated viewing is confirmed for this demo conversation. Repeat the selection without inventing a booking number, saved lead, notification or agent callback. Repeated yes refers to the same simulation. Corrections replace the draft; changes or cancellation after confirmation require a revised recap and explicit agreement and affect only the current conversation. If the user wants real contact, explain that they must use a real agency and provide a concise request recap. Never request legal names, real phone numbers, email addresses, deposits or documents. If context is missing, ask the caller to restate it rather than pretending to retrieve a booking.

### Capability boundary

All listings, addresses, rents and viewing slots are fictional public demonstration material. No live property search, CRM, calendar, outbound dialer, saved lead, screening decision, payment or actual viewing is connected. Do not claim a real booking, submitted request or promised callback. Match only stated housing preferences; do not discriminate, steer by protected characteristics, or infer eligibility. Unconfigured charges, lease terms and availability remain unknown. Keep corrections and confirmations only within this conversation.

### Source ownership

`lib/agent-config.ts` owns the workflow and greeting. `lib/presentation.ts` and `components/ScenarioFaq.tsx` own matching public copy. `lib/scenario-knowledge.ts` supplies fictional reference and business-local future dates without business lookups.

## Token lifetime compatibility

Browser RTC/RTM tokens and server-side Agent/REST tokens use the shared ten-minute `TOKEN_LIFETIME_SECONDS` duration. Token builders take durations, not Unix expiry timestamps. Keep the App Certificate and ConvoAI-capable REST tokens on the server.

The Agent start/stop routes explicitly mint tokens with `ConvoAITokenBuilder.buildToken` and pass the supported SDK `authToken` / session `token` options. This avoids the `agora-agents` 2.14.0 / `agora-token` 2.0.7 positional-argument mismatch: the SDK helper otherwise treats publisher role `1` as a one-second token lifetime. Do not patch installed dependencies or add blanket overrides. `verify:api` exercises the real SDK serialization with intercepted network transport, decodes and verifies actual signed tokens, and checks a 600-second lifetime for browser, REST start, Agent RTC/RTM and REST stop tokens. Revisit the explicit-token compatibility path only after an upstream SDK correction passes this regression and live acceptance.

## Lint dependency security compatibility

The registry audit reports GHSA-g3hv-75wg-m249 in minimatch 10.2.6, including the latest typescript-estree 8.72.2 dependency range. A parent-scoped pnpm override selects minimatch 11.0.1 only for `@typescript-eslint/typescript-estree>minimatch`; it does not replace unrelated consumers. Node.js 24 satisfies its runtime requirement, and the caller uses the retained CommonJS `minimatch` function with `dot: true`. Recheck and remove this compatibility override when the upstream dependency range includes a patched version. Run the complete verification suite and an official-registry audit after lockfile updates.
