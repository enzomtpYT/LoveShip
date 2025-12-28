import { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "How do you typically recharge after a stressful week?",
    options: [
      { value: "social", label: "Going out with friends", emoji: "🎉" },
      { value: "solitude", label: "Quiet time alone at home", emoji: "🏡" },
      { value: "active", label: "Physical activity or sports", emoji: "🏃" },
      { value: "creative", label: "Working on a hobby or project", emoji: "🎨" },
    ]
  },
  {
    id: 2,
    text: "When facing a disagreement, what is your instinct?",
    options: [
      { value: "direct", label: "Address it immediately and directly", emoji: "⚡" },
      { value: "space", label: "Take time to cool off first", emoji: "🧊" },
      { value: "harmony", label: "Compromise to keep the peace", emoji: "🤝" },
      { value: "analyze", label: "Logically analyze the root cause", emoji: "🧠" },
    ]
  },
  {
    id: 3,
    text: "What is your primary love language?",
    options: [
      { value: "words", label: "Words of Affirmation", emoji: "💌" },
      { value: "acts", label: "Acts of Service", emoji: "🛠️" },
      { value: "gifts", label: "Receiving Gifts", emoji: "🎁" },
      { value: "time", label: "Quality Time", emoji: "🕰️" },
      { value: "touch", label: "Physical Touch", emoji: "🤗" },
    ]
  },
  {
    id: 4,
    text: "How do you view long-term planning?",
    options: [
      { value: "detailed", label: "I have a 5-year plan for everything", emoji: "📅" },
      { value: "flexible", label: "I have goals but keep it flexible", emoji: "🌊" },
      { value: "spontaneous", label: "I prefer to live in the moment", emoji: "🎲" },
      { value: "collaborative", label: "I wait to plan with my partner", emoji: "👥" },
    ]
  },
  {
    id: 5,
    text: "What represents your ideal weekend?",
    options: [
      { value: "adventure", label: "Exploring a new city or hiking", emoji: "🗺️" },
      { value: "relax", label: "Binge-watching shows and ordering in", emoji: "🍿" },
      { value: "social", label: "Hosting a dinner party", emoji: "🍷" },
      { value: "productive", label: "Getting chores and errands done", emoji: "✅" },
    ]
  }
];

export const DEMO_DELAY_MS = 1500;