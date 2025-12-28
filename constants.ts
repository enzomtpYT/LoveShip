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
  },
  {
    id: 6,
    text: "How do you approach managing finances?",
    options: [
      { value: "save", label: "Saving for the future is priority #1", emoji: "💰" },
      { value: "balance", label: "Balance enjoyment now with saving", emoji: "⚖️" },
      { value: "experience", label: "Money is for experiences, spend it!", emoji: "💸" },
      { value: "invest", label: "Aggressive investing for growth", emoji: "📈" },
    ]
  },
  {
    id: 7,
    text: "In a large social gathering, you usually...",
    options: [
      { value: "center", label: "Am the life of the party", emoji: "🌟" },
      { value: "observer", label: "Prefer people-watching", emoji: "🔭" },
      { value: "connector", label: "Stick with my close group", emoji: "🔗" },
      { value: "mingler", label: "Float around meeting everyone", emoji: "🦋" },
    ]
  },
  {
    id: 8,
    text: "When making a big decision, you rely mostly on...",
    options: [
      { value: "gut", label: "My gut feeling / intuition", emoji: "🔮" },
      { value: "logic", label: "Pros and cons list / data", emoji: "📊" },
      { value: "advice", label: "Asking friends and family", emoji: "🗣️" },
      { value: "prayer", label: "Meditation or spiritual guidance", emoji: "🧘" },
    ]
  },
  {
    id: 9,
    text: "What is your preferred vacation style?",
    options: [
      { value: "relax", label: "All-inclusive resort & beach", emoji: "🏖️" },
      { value: "explore", label: "Cultural deep-dive & museums", emoji: "🏛️" },
      { value: "adventure", label: "Adrenaline & nature", emoji: "🏔️" },
      { value: "foodie", label: "It's all about the local cuisine", emoji: "🍜" },
    ]
  },
  {
    id: 10,
    text: "When you're upset, what do you need most?",
    options: [
      { value: "listen", label: "Just someone to listen, no fixing", emoji: "👂" },
      { value: "advice", label: "Practical solutions to the problem", emoji: "💡" },
      { value: "distract", label: "Distraction and fun activity", emoji: "🎮" },
      { value: "hugs", label: "Physical comfort and holding", emoji: "🫂" },
    ]
  }
];

export const DEMO_DELAY_MS = 1500;