"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

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
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto">
              <span className="text-primary-foreground text-2xl font-bold">
                U
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">ready to forge your identity?</h2>
              <p className="text-muted-foreground">
                we'll ask you a few questions and then create your unique nft identity on the solana blockchain
              </p>
            </div>
            <Button
              onClick={handleNext}
              className="w-full"
              size="lg"
            >
              let's get started
            </Button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">age range</label>
                <Select
                  value={formData.age}
                  onValueChange={(value) => setFormData({...formData, age: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="select your age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55-64">55-64</SelectItem>
                    <SelectItem value="65+">65+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">what are you using this for?</label>
                <Select
                  value={formData.purpose}
                  onValueChange={(value) => setFormData({...formData, purpose: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="select your purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">personal identity</SelectItem>
                    <SelectItem value="professional">professional networking</SelectItem>
                    <SelectItem value="creative">creative projects</SelectItem>
                    <SelectItem value="community">community building</SelectItem>
                    <SelectItem value="other">other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">where are you from?</label>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="city, country"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={handlePrevious}
                variant="outline"
              >
                back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!formData.age || !formData.purpose || !formData.location}
              >
                next
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto">
              <svg className="w-16 h-16 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">facial recognition</h2>
              <p className="text-muted-foreground mb-4">
                this step will be handled by sarthak - placeholder for now
              </p>
              <Badge variant="secondary">
                🚧 facial recognition module coming soon - sarthak is working on it
              </Badge>
            </div>
            <div className="flex justify-between">
              <Button
                onClick={handlePrevious}
                variant="outline"
              >
                back
              </Button>
              <Button
                onClick={() => {
                  setFormData({...formData, facialRecognitionComplete: true});
                  handleNext();
                }}
              >
                skip for now
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>review your identity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">age range:</span>
                  <span className="text-foreground">{formData.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">purpose:</span>
                  <span className="text-foreground">{formData.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">location:</span>
                  <span className="text-foreground">{formData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">facial recognition:</span>
                  <span className="text-foreground">{formData.facialRecognitionComplete ? 'completed' : 'skipped'}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                onClick={handlePrevious}
                variant="outline"
              >
                back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-48"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    <span>forging identity...</span>
                  </div>
                ) : (
                  'forge my identity'
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription className="text-lg">
              {steps[currentStep].subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}