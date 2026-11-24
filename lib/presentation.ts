import type { ScenarioPresentation } from '@/types/presentation';
export type { ScenarioPresentation } from '@/types/presentation';

export const presentation: ScenarioPresentation = {
  "id": "04-basketball-trial-sales",
  "name": "Real Estate Follow-Up Assistant",
  "purpose": "Rental inquiry and simulated viewing",
  "summary": "Explore fictional Austin rentals, compare housing preferences and walk through a simulated viewing.",
  "featuresHeading": "In this conversation",
  "features": [
    {
      "emoji": "💬",
      "title": "Rental needs & listing comparisons"
    },
    {
      "emoji": "🎙️",
      "title": "Future demo viewing times"
    },
    {
      "emoji": "📝",
      "title": "Simulated viewing recap"
    }
  ],
  "builtWith": [
    "Agora Conversational AI",
    "Agents SDK",
    "Next.js"
  ],
  "startLabel": "Start rental inquiry",
  "boundaryShort": "Simulation only. No real viewing, lead or calendar entry is saved.",
  "outcomes": [
    {
      "id": "helpful",
      "label": "The conversation helped"
    },
    {
      "id": "needs-guidance",
      "label": "I need more guidance"
    }
  ],
  "developer": {
    "sourceUrl": "https://github.com/AgoraIO-Community/agora-rental-follow-up-demo",
    "runCommand": "pnpm install --frozen-lockfile\npnpm run doctor\npnpm run dev",
    "assistantPrompt": "Help me create and run the Real Estate Follow-Up Assistant using Agora CLI.\n\nCheck that Agora CLI is installed and ready. If installation or an upgrade is needed, ask before proceeding. Guide me through browser login when required.\n\nGet the recipe details:\nagora recipes show agora-rental-follow-up-demo --json\n\nRead its implementation guide:\nhttps://raw.githubusercontent.com/AgoraIO-Community/agora-rental-follow-up-demo/main/RECIPE.md\n\nReference source:\nhttps://github.com/AgoraIO-Community/agora-rental-follow-up-demo\n\nBefore initialization, confirm which Agora project to use. Ask before creating a new Agora project.\n\nInitialize the app in a new or empty directory. Replace <confirmed-project-id> with the actual ID of the project confirmed above before running:\nagora init my-course-app --recipe agora-rental-follow-up-demo --project <confirmed-project-id> --json\n\nLet the CLI configure the credentials. Never print the App Certificate in chat or expose it in browser code.\n\nFollow the returned nextSteps to install dependencies and start the app. Help diagnose and resolve any errors.\n\nProvide the local URL and guide me through microphone access. Help me test this request:\n\"I am looking for a two-bedroom rental in Austin under USD 2,000 per month. Can we discuss a viewing?\"\n\nReport what was verified and what still needs testing. Follow the capabilities and limits in the implementation guide; do not claim external actions were completed without verification.",
    "docsUrl": "https://docs.agora.io/en/ai/build/build-server-client",
    "sdkUrl": "https://github.com/AgoraIO/agora-agents-ts",
    "consoleUrl": "https://console.agora.io/",
    "cliUrl": "https://github.com/AgoraIO/cli",
    "extensionPoints": [
      {
        "title": "Change the conversation",
        "path": "lib/agent-config.ts"
      },
      {
        "title": "Choose models and voice",
        "path": "lib/runtime-profile.ts"
      },
      {
        "title": "Adapt scenario UI copy",
        "path": "lib/presentation.ts"
      }
    ],
    "createCommand": "npx agora-rental-follow-up-demo@latest my-course-app\ncd my-course-app",
    "testRequest": "I am looking for a two-bedroom rental in Austin under USD 2,000 per month. Can we discuss a viewing?"
  }
};

export function getScenarioPresentation(): ScenarioPresentation { return presentation; }
