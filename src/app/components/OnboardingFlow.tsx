"use client";

import { useState } from 'react';

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  isProcessing: boolean;
}

export interface OnboardingData {
  age: string;
  purpose: string;
  location: string;
  facialRecognitionComplete: boolean;
}

export default function OnboardingFlow({ onComplete, isProcessing }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    age: '',
    purpose: '',
    location: '',
    facialRecognitionComplete: false
  });

  const steps = [
    {
      title: "welcome to project umoja",
      subtitle: "let's create your digital identity together"
    },
    {
      title: "tell us about yourself",
      subtitle: "help us understand who you are"
    },
    {
      title: "facial recognition",
      subtitle: "sarthak will handle this part"
    },
    {
      title: "review your identity",
      subtitle: "everything looks good?"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white text-3xl font-bold">U</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">ready to forge your identity?</h2>
              <p className="text-gray-300">
                we'll ask you a few questions and then create your unique nft identity on the solana blockchain
              </p>
            </div>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
            >
              let's get started
            </button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">age range</label>
                <select
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">select your age range</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55-64">55-64</option>
                  <option value="65+">65+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">what are you using this for?</label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">select your purpose</option>
                  <option value="personal">personal identity</option>
                  <option value="professional">professional networking</option>
                  <option value="creative">creative projects</option>
                  <option value="community">community building</option>
                  <option value="other">other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">where are you from?</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="city, country"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-white/20"
              >
                back
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.age || !formData.purpose || !formData.location}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
              >
                next
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">facial recognition</h2>
              <p className="text-gray-300 mb-4">
                this step will be handled by sarthak - placeholder for now
              </p>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-200 text-sm">
                  🚧 facial recognition module coming soon - sarthak is working on it
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-white/20"
              >
                back
              </button>
              <button
                onClick={() => {
                  setFormData({...formData, facialRecognitionComplete: true});
                  handleNext();
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
              >
                skip for now
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white/10 rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">review your identity</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">age range:</span>
                  <span className="text-white">{formData.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">purpose:</span>
                  <span className="text-white">{formData.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">location:</span>
                  <span className="text-white">{formData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">facial recognition:</span>
                  <span className="text-white">{formData.facialRecognitionComplete ? 'completed' : 'skipped'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-white/20"
              >
                back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>forging identity...</span>
                  </div>
                ) : (
                  'forge my identity'
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-300">
              {steps[currentStep].subtitle}
            </p>
          </div>

          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}
