import React, { useState, useEffect } from 'react';
import { ModelSettings } from '../utils/types';
import { HF_MODEL_LIST, HuggingFaceModel } from '../utils/constants';

interface Props {
  settings: ModelSettings;
  updateSettings: (newSettings: Partial<ModelSettings>) => void;
}

const HuggingFaceSettings: React.FC<Props> = ({ settings, updateSettings }) => {
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  // Validate API key when it changes
  useEffect(() => {
    if (!settings.huggingFaceApiKey) {
      setApiKeyError('API key is required');
    } else if (settings.huggingFaceApiKey.length < 8) {
      setApiKeyError('API key seems too short');
    } else {
      setApiKeyError(null);
    }
  }, [settings.huggingFaceApiKey]);

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Hugging Face Configuration
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure your Hugging Face API settings for text generation
        </p>
      </div>

      {/* API Key Section */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between">
            <label 
              htmlFor="hfApiKey" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              API Key
            </label>
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showApiKey ? "text" : "password"}
              id="hfApiKey"
              className={`
                block w-full rounded-md 
                ${apiKeyError 
                  ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }
                dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200
                pr-10 transition-all duration-200
              `}
              value={settings.huggingFaceApiKey || ''}
              onChange={(e) => updateSettings({ huggingFaceApiKey: e.target.value })}
              placeholder="Enter your Hugging Face API key"
              aria-invalid={apiKeyError ? "true" : "false"}
              aria-describedby={apiKeyError ? "hf-api-key-error" : undefined}
            />
            {apiKeyError && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg 
                  className="h-5 w-5 text-red-500" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            )}
          </div>
          {apiKeyError ? (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="hf-api-key-error">
              {apiKeyError}
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Get your API key from{' '}
              <a
                href="https://huggingface.co/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                Hugging Face Settings
              </a>
            </p>
          )}
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <label 
            htmlFor="hfModel" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Model
          </label>
          <select
            id="hfModel"
            className="
              mt-1 block w-full rounded-md border-gray-300 
              shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
              dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200
              transition-colors duration-200
            "
            value={settings.huggingFaceModelName || HF_MODEL_LIST[0]}
            onChange={(e) => updateSettings({ 
              huggingFaceModelName: e.target.value as HuggingFaceModel
            })}
          >
            {HF_MODEL_LIST.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select the model to use for text generation
          </p>
        </div>
      </div>

      {/* Advanced Settings Section */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
          Advanced Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="temperature" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Temperature
            </label>
            <input
              type="number"
              id="temperature"
              className="
                mt-1 block w-full rounded-md border-gray-300 
                shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200
              "
              value={settings.customTemperature || 0.7}
              onChange={(e) => updateSettings({ 
                customTemperature: Math.max(0, Math.min(2, parseFloat(e.target.value))) 
              })}
              min="0"
              max="2"
              step="0.1"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Controls randomness (0-2)
            </p>
          </div>
          <div>
            <label 
              htmlFor="maxTokens" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Max Tokens
            </label>
            <input
              type="number"
              id="maxTokens"
              className="
                mt-1 block w-full rounded-md border-gray-300 
                shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200
              "
              value={settings.customMaxTokens || 100}
              onChange={(e) => updateSettings({ 
                customMaxTokens: Math.max(1, parseInt(e.target.value)) 
              })}
              min="1"
              max="2048"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Maximum length of generated text
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HuggingFaceSettings;
