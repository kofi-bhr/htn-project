"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import FacialRecognition from './FacialRecognition';

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
      subtitle: "secure biometric verification"
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
              <span className="text-primary-foreground text-3xl font-bold font-mono">U</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2 font-mono">ready to forge your identity?</h2>
              <p className="text-muted-foreground">
                we'll ask you a few questions and then create your unique nft identity on the solana blockchain
              </p>
            </div>
            <Button onClick={handleNext} size="lg" className="font-mono">
              let's get started
            </Button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2 font-mono">age range</label>
                <Select
                  value={formData.age}
                  onValueChange={(value) => setFormData({...formData, age: value})}
                >
                  <SelectTrigger className="w-full font-mono">
                    <SelectValue placeholder="select your age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24" className="font-mono">18-24</SelectItem>
                    <SelectItem value="25-34" className="font-mono">25-34</SelectItem>
                    <SelectItem value="35-44" className="font-mono">35-44</SelectItem>
                    <SelectItem value="45-54" className="font-mono">45-54</SelectItem>
                    <SelectItem value="55-64" className="font-mono">55-64</SelectItem>
                    <SelectItem value="65+" className="font-mono">65+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2 font-mono">what are you using this for?</label>
                <Select
                  value={formData.purpose}
                  onValueChange={(value) => setFormData({...formData, purpose: value})}
                >
                  <SelectTrigger className="w-full font-mono">
                    <SelectValue placeholder="select your purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal" className="font-mono">personal identity</SelectItem>
                    <SelectItem value="professional" className="font-mono">professional networking</SelectItem>
                    <SelectItem value="creative" className="font-mono">creative projects</SelectItem>
                    <SelectItem value="community" className="font-mono">community building</SelectItem>
                    <SelectItem value="other" className="font-mono">other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2 font-mono">where are you from?</label>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="city, country"
                  className="font-mono"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button onClick={handlePrevious} variant="outline" className="font-mono">
                back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!formData.age || !formData.purpose || !formData.location}
                className="font-mono"
              >
                next
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <FacialRecognition 
            onComplete={() => {
              setFormData({...formData, facialRecognitionComplete: true});
              handleNext();
            }}
            onPrevious={handlePrevious}
          />
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-mono">review your identity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">age range:</span>
                  <span className="text-foreground font-mono">{formData.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">purpose:</span>
                  <span className="text-foreground font-mono">{formData.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">location:</span>
                  <span className="text-foreground font-mono">{formData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">facial recognition:</span>
                  <span className="text-foreground font-mono">{formData.facialRecognitionComplete ? 'completed' : 'skipped'}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button onClick={handlePrevious} variant="outline" className="font-mono">
                back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="font-mono"
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
      <Card className="max-w-2xl w-full p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span className="font-mono">step {currentStep + 1} of {steps.length}</span>
            <span className="font-mono">{Math.round(((currentStep + 1) / steps.length) * 100)}% complete</span>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2 font-mono">
            {steps[currentStep].title}
          </h1>
          <p className="text-muted-foreground font-mono">
            {steps[currentStep].subtitle}
          </p>
        </div>

        {renderStepContent()}
      </Card>
    </div>
  );
}