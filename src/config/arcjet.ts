import arcjet, { shield, detectBot } from "@arcjet/node";

// Type assertion to tell TypeScript this will be defined
const ARCJET_KEY = process.env.ARCJET_KEY as string;

if (!ARCJET_KEY && process.env.NODE_ENV !== "test") {
  throw new Error(
    "ARCJET_KEY environment variable is required. Sign up for your Arcjet key at https://app.arcjet.com"
  );
}

const aj = arcjet({
  // Use the asserted variable
  key: ARCJET_KEY,
  
  // Or use non-null assertion operator if you prefer (both work)
  // key: process.env.ARCJET_KEY!,
  
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:PREVIEW",
      ],
    }),
  ],
});

export default aj;