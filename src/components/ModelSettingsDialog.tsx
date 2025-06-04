import React, { useState } from 'react';
import { ModelSettings } from '../utils/types';
import { MODEL_PROVIDERS, ModelProvider } from '../utils/constants';
import HuggingFaceSettings from './HuggingFaceSettings';

interface Props {
  settings: ModelSettings;
  updateSettings: (newSettings: Partial<ModelSettings>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ModelSettingsDialog: React.FC<Props> = ({
  settings,
  updateSettings,
  isOpen,
  onClose,
}) => {
  const [hasChanges, setHasChanges] = useState(false);

  if (!isOpen) return null;

  const handleSettingsUpdate = (newSettings: Partial<ModelSettings>) => {
    updateSettings(newSettings);
    setHasChanges(true);
  };

  const handleClose = () => {
    setHasChanges(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" aria-hidden="true" />

      {/* Dialog positioning */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform rounded-xl bg-white shadow-2xl transition-all dark:bg-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Model Settings
            </h2>
            <button
              onClick={handleClose}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="space-y-6">
              {/* Provider Selection */}
              <div>
                <label 
                  htmlFor="provider" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Model Provider
                </label>
                <select
                  id="provider"
                  className="
                    mt-1 block w-full rounded-md border-gray-300 
                    shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                    dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200
                    transition-colors duration-200
                  "
                  value={settings.customProvider || "openai"}
                  onChange={(e) => handleSettingsUpdate({ 
                    customProvider: e.target.value as ModelProvider
                  })}
                >
                  <option value="openai">OpenAI</option>
                  <option value="huggingface">Hugging Face</option>
                </select>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Choose your preferred AI model provider
                </p>
              </div>

              {/* Provider-specific settings */}
              <div className="transition-all duration-300">
                {settings.customProvider === MODEL_PROVIDERS.HUGGINGFACE ? (
                  <HuggingFaceSettings 
                    settings={settings} 
                    updateSettings={handleSettingsUpdate} 
                  />
                ) : (
                  <div className="space-y-6">
                    {/* OpenAI Settings */}
                    <div>
                      <label 
                        htmlFor="apiKey" 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        OpenAI API Key
                      </label>
                      <input
                        type="password"
                        id="apiKey"
                        className="
                          mt-1 block w-full rounded-md border-gray-300 
                          shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                          dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200
                        "
                        value={settings.customApiKey || ''}
                        onChange={(e) => handleSettingsUpdate({ customApiKey: e.target.value })}
                        placeholder="Enter your OpenAI API key"
                      />
                    </div>

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
                          value={settings.customTemperature || 0.9}
                          onChange={(e) => handleSettingsUpdate({ 
                            customTemperature: parseFloat(e.target.value) 
                          })}
                          min="0"
                          max="2"
                          step="0.1"
                        />
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
                          value={settings.customMaxTokens || 400}
                          onChange={(e) => handleSettingsUpdate({ 
                            customMaxTokens: parseInt(e.target.value) 
                          })}
                          min="1"
                          max="4000"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
            <button
              onClick={handleClose}
              className="
                rounded-md border border-gray-300 bg-white px-4 py-2 
                text-sm font-medium text-gray-700 
                hover:bg-gray-50 
                dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 
                dark:hover:bg-gray-600
                transition-colors duration-200
              "
            >
              Cancel
            </button>
            <button
              onClick={handleClose}
              className={`
                rounded-md px-4 py-2 text-sm font-medium text-white 
                transition-colors duration-200
                ${hasChanges 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-gray-400 cursor-not-allowed'
                }
              `}
              disabled={!hasChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelSettingsDialog;
