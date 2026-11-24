import { getScenarioKnowledge } from '../lib/scenario-knowledge';
import { getConversationContext, getDemoDates } from '../lib/prompt-context';
import assert from 'node:assert/strict';
import { getScenarioConfig, getScenarioPrompt } from '../lib/agent-config';
import { getScenarioPresentation } from '../lib/presentation';
const config = getScenarioConfig();
assert.equal(config.id, "04-basketball-trial-sales");
assert.equal(getScenarioPresentation().id, config.id);
for (const key of ['role', 'workflow', 'guardrails', 'greeting'] as const) assert.ok(config[key]);
assert.match(getScenarioPrompt(), /# Goal and conversation flow/);
assert.match(getScenarioPrompt(), /# First-version boundary/);
assert.match(getScenarioPrompt(), /No business data lookup/);
assert.doesNotMatch(getScenarioPrompt(), /AG-100[123]|patient-alex|AST-R3001|travelerKey|participantId/);
console.log('Scenario conversation contract passed: ' + config.id);

// Calendar regressions: U.S. dates can differ from UTC and offsets change with DST.
const localNight = getConversationContext('America/New_York', new Date('2026-11-05T02:30:00Z'));
assert.match(localNight, /Current local date: 2026-11-04/);
assert.match(localNight, /UTC-05:00/);
assert.match(getConversationContext('America/New_York', new Date('2026-03-08T06:30:00Z')), /UTC-05:00/);
assert.match(getConversationContext('America/New_York', new Date('2026-03-08T07:30:00Z')), /UTC-04:00/);
assert.match(getConversationContext('America/Chicago', new Date('2026-07-01T03:30:00Z')), /Current local date: 2026-06-30/);
assert.match(getConversationContext('America/New_York', new Date('2026-12-31T17:00:00Z')), /2027-01-01 Friday/);
assert.match(getConversationContext('America/New_York', new Date('2028-02-28T17:00:00Z')), /2028-02-29 Tuesday; 2028-03-01 Wednesday/);
console.log('Prompt local-date, DST and calendar regressions passed.');

// Public demo windows must follow business-local dates through leap days and year boundaries.
assert.equal(getDemoDates('America/New_York', new Date('2026-11-05T02:30:00Z'))[0], '2026-11-04');
const leapDemoDates = getDemoDates('America/New_York', new Date('2028-02-28T17:00:00Z'));
assert.equal(leapDemoDates[1], '2028-02-29');
assert.equal(leapDemoDates[2], '2028-03-01');
assert.equal(new Set(leapDemoDates).size, 29);
assert.equal(getDemoDates('America/Chicago', new Date('2026-12-31T18:00:00Z'))[28], '2027-01-28');

// Viewing slots must stay future, bounded, tied to a configured property and date-correct across DST.
for (const instant of ['2027-03-12T18:00:00Z', '2027-11-05T18:00:00Z', '2026-12-31T18:00:00Z', '2028-02-28T18:00:00Z']) {
  const now = new Date(instant);
  const reference = getScenarioKnowledge(now);
  const dates = getDemoDates(reference.timeZone, now).slice(1, 15);
  assert.equal(reference.properties.length, 3);
  assert.ok(reference.viewingSlots.length > 0);
  assert.equal(new Set(reference.viewingSlots.map(slot => slot.propertyId + ':' + slot.startsAt)).size, reference.viewingSlots.length);
  for (const slot of reference.viewingSlots) {
    assert.ok(reference.properties.some(property => property.id === slot.propertyId));
    assert.ok(dates.includes(slot.date));
    assert.ok([2, 4, 6].includes(new Date(slot.date + 'T12:00:00Z').getUTCDay()));
    assert.ok(Date.parse(slot.startsAt) > now.getTime());
    assert.equal(Date.parse(slot.endsAt) - Date.parse(slot.startsAt), 30 * 60_000);
    assert.equal(slot.timeZone, 'America/Chicago');
  }
  const prompt = getScenarioPrompt(config.id, now);
  assert.ok(prompt.includes(JSON.stringify(reference)), 'The actual startup prompt must receive the same date reference.');
}
const spring = getScenarioKnowledge(new Date('2027-03-12T18:00:00Z')).viewingSlots;
assert.equal(spring.find(slot => slot.date === '2027-03-13')?.offset, 'UTC-06:00');
assert.equal(spring.find(slot => slot.date === '2027-03-16')?.offset, 'UTC-05:00');
const fall = getScenarioKnowledge(new Date('2027-11-05T18:00:00Z')).viewingSlots;
assert.equal(fall.find(slot => slot.date === '2027-11-06')?.offset, 'UTC-05:00');
assert.equal(fall.find(slot => slot.date === '2027-11-09')?.offset, 'UTC-06:00');
assert.equal(getScenarioPresentation().name, 'Real Estate Follow-Up Assistant');
console.log('Future viewing slots, property references and DST regressions passed.');
