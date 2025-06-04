import { ModelProvider, HuggingFaceModel } from './constants';

export interface ModelSettings {
  customApiKey?: string;
  customTemperature?: number;
  customModelName?: string;
  customMaxTokens?: number;
  customEndPoint?: string;
  // Provider selection
  customProvider?: ModelProvider;
  // Hugging Face specific settings
  huggingFaceApiKey?: string;
  huggingFaceModelName?: HuggingFaceModel;
}

export interface HuggingFaceSettings {
  apiKey: string;
  modelName: HuggingFaceModel;
  temperature: number;
  maxTokens: number;
}
