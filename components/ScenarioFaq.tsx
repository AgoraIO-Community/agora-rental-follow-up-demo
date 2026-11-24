'use client';

import { ChevronDown } from 'lucide-react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const questions = [
  {
    "question": "How long does a session last?",
    "answer": "Each session ends automatically after 10 minutes; choose Start again to continue."
  },
  {
    "question": "How do I start a conversation?",
    "answer": "Choose Start rental inquiry and allow microphone access when asked. Speak in English and describe what you need. You can mute or end the conversation with the voice controls."
  },
  {
    "question": "What should I say?",
    "answer": "I am looking for a two-bedroom rental in Austin under USD 2,000 per month. Can we discuss a viewing?"
  },
  {
    "question": "Which rentals are included?",
    "answer": "Three fictional Austin examples: a Riverside one-bedroom at USD 1,600 per month, a Riverside two-bedroom at USD 1,950, and a North Loop two-bedroom at USD 2,200. Deposits, fees, lease terms and actual move-in availability are unconfigured."
  },
  {
    "question": "Can I schedule a viewing?",
    "answer": "You can confirm a simulated viewing at a generated future slot on Tuesday, Thursday or Saturday at 2 PM Austin time, within the next two weeks. No actual appointment, lead, calendar entry or callback is created."
  },
  {
    "question": "Can it follow up with me later?",
    "answer": "No. This browser role-play starts when you choose Start rental inquiry. It does not dial phone numbers, retrieve a previous inquiry or save contact details. Ask for a verbal recap to use with a real agency."
  },
  {
    "question": "Can I change what I said?",
    "answer": "Yes. Correct a detail, ask for clarification or request a verbal recap. This demo keeps details only within the current conversation."
  },
  {
    "question": "What if my microphone does not work?",
    "answer": "Check microphone permission, your selected input device and mute status, then try Start rental inquiry again."
  }
];

export function ScenarioFaq() {
  return (
    <DialogContent className="demo-inspector demo-faq-drawer">
      <DialogHeader className="demo-faq-heading">
        <DialogTitle>Frequently asked questions</DialogTitle>
        <DialogDescription>How to get started, what to ask, and what to expect.</DialogDescription>
      </DialogHeader>
      <div className="demo-faq-list">
        {questions.map(({ question, answer }) => (
          <details className="demo-faq-item" key={question}>
            <summary>
              <span>{question}</span>
              <ChevronDown className="demo-faq-chevron" size={16} aria-hidden="true" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </DialogContent>
  );
}
