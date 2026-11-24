import { getDemoDates } from './prompt-context';

// Fictional public reference; no property lookup, lead or calendar writes.
export const SCENARIO_KNOWLEDGE = {
  "source": {
    "kind": "Fictional rental listings and viewing reference",
    "revision": "2026-11-18",
    "scope": "Configured examples only; no live availability, customer inquiry or saved booking."
  },
  "timeZone": "America/Chicago",
  "agency": "Agora Rental Studio (fictional)",
  "properties": [
    {
      "id": "riverside-one",
      "name": "Riverside One-Bedroom",
      "area": "Riverside, Austin",
      "address": "100 Example Riverside Lane, Austin, TX 78741 (fictional; not for navigation)",
      "bedrooms": 1,
      "monthlyRentUsd": 1600,
      "features": [
        "In-unit laundry",
        "One assigned parking space"
      ]
    },
    {
      "id": "north-loop-two",
      "name": "North Loop Two-Bedroom",
      "area": "North Loop, Austin",
      "address": "200 Example Loop Avenue, Austin, TX 78751 (fictional; not for navigation)",
      "bedrooms": 2,
      "monthlyRentUsd": 2200,
      "features": [
        "In-unit laundry",
        "Private balcony"
      ]
    },
    {
      "id": "riverside-two",
      "name": "Riverside Two-Bedroom",
      "area": "Riverside, Austin",
      "address": "300 Example River Court, Austin, TX 78741 (fictional; not for navigation)",
      "bedrooms": 2,
      "monthlyRentUsd": 1950,
      "features": [
        "Shared laundry",
        "One assigned parking space"
      ]
    }
  ],
  "unconfirmed": [
    "Real availability and move-in dates",
    "Deposits, fees, utilities and lease terms",
    "Accessibility features and individual accommodations"
  ],
  "viewingSchedule": {
    "weekdays": [
      2,
      4,
      6
    ],
    "startHour": 14,
    "durationMinutes": 30,
    "daysAhead": 14
  },
  "simulation": "A viewing is only an unsaved verbal agreement in this conversation, never a real reservation or calendar entry."
} as const;

export function getScenarioKnowledge(now = new Date()) {
  const { timeZone, viewingSchedule, properties } = SCENARIO_KNOWLEDGE;
  const viewingSlots = getDemoDates(timeZone, now).slice(1, viewingSchedule.daysAhead + 1).flatMap(date => {
    const weekday = new Date(date + 'T12:00:00Z').getUTCDay();
    if (!(viewingSchedule.weekdays as readonly number[]).includes(weekday)) return [];
    const offset = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
      .formatToParts(new Date(date + 'T18:00:00Z')).find(part => part.type === 'timeZoneName')!.value.replace('GMT', '');
    const startsAt = `${date}T${viewingSchedule.startHour}:00:00${offset}`;
    const endsAt = new Date(Date.parse(startsAt) + viewingSchedule.durationMinutes * 60_000).toISOString();
    return properties.map(property => ({ propertyId: property.id, date, startsAt, endsAt, timeZone, offset: 'UTC' + offset }));
  });
  return { ...SCENARIO_KNOWLEDGE, viewingSlots };
}
