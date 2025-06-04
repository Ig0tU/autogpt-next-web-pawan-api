// OpenAI Models
export const GPT_35_TURBO = "gpt-3.5-turbo";
export const GPT_4 = "gpt-4";

// Hugging Face Models
export const DEFAULT_HF_MODEL = "bigscience/bloom";
export const HF_MODEL_LIST = [
  "bigscience/bloom",
  "google/flan-t5-xxl",
  "facebook/opt-350m",
  "EleutherAI/gpt-neo-2.7B",
  "microsoft/DialoGPT-large"
] as const;

// Model Providers
export const MODEL_PROVIDERS = {
  OPENAI: "openai",
  HUGGINGFACE: "huggingface"
} as const;

export type ModelProvider = typeof MODEL_PROVIDERS[keyof typeof MODEL_PROVIDERS];
export type HuggingFaceModel = typeof HF_MODEL_LIST[number];
