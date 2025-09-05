export type ChatOption = {
  id: string;
  text: string;
  value: string;
};

interface InitialMessage {
  id: string;
  role: "assistant" | "data" | "system" | "user";
  content: string;
  options?: ChatOption[];
}

const INITIAL_OPTIONS: ChatOption[] = [
  {
    id: "1",
    text: "I'm launching a new product, app, or service",
    value: "launching",
  },
  {
    id: "2",
    text: "I want to protect a new invention or idea",
    value: "invention",
  },
  { id: "3", text: "I'm creating or using creative content", value: "content" },
  {
    id: "4",
    text: "I want to protect my brand, name, or logo",
    value: "brand",
  },
  {
    id: "5",
    text: "I'm working with federal funding, tech transfer, or regulated R&D",
    value: "federal",
  },
  {
    id: "6",
    text: "I'm not sure — I need general guidance or a consultation",
    value: "guidance",
  },
  {
    id: "7",
    text: "I'm not sure — I need documentation for the list of services you provide",
    value: "pdf",
  },
];

const dedent = (strings: TemplateStringsArray, ...values: string[]) => {
  const fullString = strings.reduce((acc, str, i) => acc + values[i - 1] + str);
  const lines = fullString.split("\n");
  const minIndent = lines
    .filter((line) => line.trim())
    .reduce(
      (min, line) => Math.min(min, line.match(/^ */)?.[0].length ?? 0),
      Infinity
    );
  return lines.map((line) => line.slice(minIndent)).join("\n");
};

export const INITIAL_MESSAGE: InitialMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: dedent`Welcome to The SciTech & IP Law Firm — Where Strategy Meets Science.

I'm your virtual assistant, here to help you navigate the intersection of innovation, law, and business. Whether you're developing new technologies, managing federal research funding, protecting your intellectual property, or launching a startup—we're here to support your mission.

How can I assist you today?
(Choose an option to get started or ask a question below.)`,
    options: INITIAL_OPTIONS,
  },
];

export const ESTIMATE_MESSAGE: InitialMessage[] = [
  {
    id: Date.now().toString(),
    role: "assistant",
    content: `Perfect! I'll redirect you to our secure intake form where you can provide a few additional details about your needs. Based on your responses, you'll receive a personalized estimate within 24 hours.

Our estimates include:
• Transparent flat fees or milestone-based pricing
• Clear timelines and deliverables
• Recommended legal actions aligned with your goals

Would you like me to open the estimate form for you?`,
  },
];

export const CONSULTATION_MESSAGE: InitialMessage[] = [
  {
    id: Date.now().toString(),
    role: "assistant",
    content: `Excellent choice! I'll connect you with our scheduling system where you can book a free 15-30 minute consultation with one of our legal strategists.

During your consultation, we'll discuss:
• Your current innovation or business goals
• Legal priorities and potential challenges
• Recommended next steps and timeline
• How our services can support your mission

Would you like me to open the scheduling system for you?`,
  },
];
