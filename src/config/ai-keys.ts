export const AI_CONFIG = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "",
  GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY || "",
  MODELS: {
    GEMINI: "gemini-2.5-flash",
    GROQ: "llama-3.3-70b-versatile"
  }
};
