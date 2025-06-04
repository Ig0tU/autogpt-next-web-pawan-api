import { HuggingFaceLLM } from '../src/llms/huggingface';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HuggingFaceLLM', () => {
  const defaultOptions = {
    apiKey: 'test-api-key',
    modelName: 'bigscience/bloom',
    temperature: 0.7,
    maxTokens: 100
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance with valid options', () => {
    const llm = new HuggingFaceLLM(defaultOptions);
    expect(llm).toBeInstanceOf(HuggingFaceLLM);
  });

  it('should throw error if API key is missing', () => {
    expect(() => {
      new HuggingFaceLLM({
        ...defaultOptions,
        apiKey: ''
      });
    }).toThrow('HuggingFace API key is required');
  });

  it('should throw error if model name is missing', () => {
    expect(() => {
      new HuggingFaceLLM({
        ...defaultOptions,
        modelName: ''
      });
    }).toThrow('Model name is required');
  });

  it('should throw error if temperature is invalid', () => {
    expect(() => {
      new HuggingFaceLLM({
        ...defaultOptions,
        temperature: -1
      });
    }).toThrow('Temperature must be a number between 0 and 2');
  });

  it('should throw error if maxTokens is invalid', () => {
    expect(() => {
      new HuggingFaceLLM({
        ...defaultOptions,
        maxTokens: 0
      });
    }).toThrow('Max tokens must be a positive number');
  });

  describe('call method', () => {
    const llm = new HuggingFaceLLM(defaultOptions);

    it('should handle successful API call with array response', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: [{ generated_text: 'Test response' }]
      });

      const result = await llm.call('Test prompt');
      expect(result).toEqual({ text: 'Test response' });
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `https://api-inference.huggingface.co/models/${defaultOptions.modelName}`,
        {
          inputs: 'Test prompt',
          parameters: {
            temperature: defaultOptions.temperature,
            max_new_tokens: defaultOptions.maxTokens,
            return_full_text: false,
          }
        },
        {
          headers: {
            "Authorization": `Bearer ${defaultOptions.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );
    });

    it('should handle successful API call with object response', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { generated_text: 'Test response' }
      });

      const result = await llm.call('Test prompt');
      expect(result).toEqual({ text: 'Test response' });
    });

    it('should throw error for empty prompt', async () => {
      await expect(llm.call('')).rejects.toThrow('Prompt cannot be empty');
    });

    it('should handle API error with status code', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { error: 'Unauthorized' }
        }
      });

      await expect(llm.call('Test prompt')).rejects.toThrow('Invalid API key or unauthorized access');
    });

    it('should handle rate limit error', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 429,
          data: { error: 'Too many requests' }
        }
      });

      await expect(llm.call('Test prompt')).rejects.toThrow('Rate limit exceeded. Please try again later');
    });

    it('should handle model loading error', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 503,
          data: { error: 'Model is loading' }
        }
      });

      await expect(llm.call('Test prompt')).rejects.toThrow('Model is currently loading or service is unavailable');
    });

    it('should handle network error', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

      await expect(llm.call('Test prompt')).rejects.toThrow('HuggingFace API call failed: Network error');
    });
  });
});
