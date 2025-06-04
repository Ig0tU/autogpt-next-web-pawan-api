import axios from "axios";

export interface HuggingFaceLLMOptions {
  apiKey: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
}

export class HuggingFaceLLM {
  private apiKey: string;
  private modelName: string;
  private temperature: number;
  private maxTokens: number;

  constructor(options: HuggingFaceLLMOptions) {
    // Input validation
    if (!options.apiKey) {
      throw new Error("HuggingFace API key is required");
    }
    if (!options.modelName) {
      throw new Error("Model name is required");
    }
    if (typeof options.temperature !== 'number' || options.temperature < 0 || options.temperature > 2) {
      throw new Error("Temperature must be a number between 0 and 2");
    }
    if (typeof options.maxTokens !== 'number' || options.maxTokens < 1) {
      throw new Error("Max tokens must be a positive number");
    }

    this.apiKey = options.apiKey;
    this.modelName = options.modelName;
    this.temperature = options.temperature;
    this.maxTokens = options.maxTokens;
  }

  async call(prompt: string): Promise<{ text: string }> {
    if (!prompt?.trim()) {
      throw new Error("Prompt cannot be empty");
    }

    try {
      const url = `https://api-inference.huggingface.co/models/${this.modelName}`;
      const response = await axios.post(
        url,
        {
          inputs: prompt,
          parameters: {
            temperature: this.temperature,
            max_new_tokens: this.maxTokens,
            return_full_text: false,
          },
        },
        {
          headers: {
            "Authorization": `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 second timeout
        }
      );

      // Handle different response formats from HF models
      if (Array.isArray(response.data)) {
        const generatedText = response.data[0]?.generated_text;
        if (!generatedText) {
          throw new Error("No generated text in response");
        }
        return { text: generatedText };
      }

      const generatedText = response.data?.generated_text;
      if (!generatedText) {
        throw new Error("No generated text in response");
      }
      return { text: generatedText };

    } catch (error: any) {
      // Enhanced error handling with specific error messages
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMessage = error.response?.data?.error || error.message;

        if (status === 401) {
          throw new Error("Invalid API key or unauthorized access");
        }
        if (status === 404) {
          throw new Error(`Model '${this.modelName}' not found`);
        }
        if (status === 429) {
          throw new Error("Rate limit exceeded. Please try again later");
        }
        if (status === 503) {
          throw new Error("Model is currently loading or service is unavailable");
        }

        throw new Error(`HuggingFace API error (${status}): ${errorMessage}`);
      }

      // For non-Axios errors (e.g., network issues)
      throw new Error(`HuggingFace API call failed: ${error.message}`);
    }
  }
}
