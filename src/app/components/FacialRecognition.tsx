"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface FacialRecognitionProps {
  onComplete: () => void;
  onPrevious: () => void;
}

export default function FacialRecognition({ onComplete, onPrevious }: FacialRecognitionProps) {
  const [step, setStep] = useState<'instructions' | 'scanning' | 'processing' | 'success' | 'error'>('instructions');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);


  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault();
      if (step === 'instructions' && !isAnimating) {
        startMockScanning();
      } else if (step === 'success') {
        onComplete();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [step, isAnimating]);

  const startMockScanning = () => {
    setStep('scanning');
    setIsAnimating(true);
    setAnimationProgress(0);
    
    const duration = 3000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      const choppyProgress = Math.round(easedProgress * 20) / 20;
      
      setAnimationProgress(choppyProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setStep('success');
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animate);
  };





  const renderStepContent = () => {
    switch (step) {
      case 'instructions':
        return (
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-64 h-64">
              <div className="w-full h-full bg-gray-200 rounded-full border-4 border-red-500 flex items-center justify-center">
                <div className="text-gray-500 text-sm font-mono">Camera Feed</div>
              </div>
              
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-red-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Center your face in the red circle
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <Badge variant="outline" className="font-mono">
                    SPACE - Start Scan
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold font-mono">Facial Recognition Setup</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                This creates a unique biometric signature stored securely on the blockchain. 
                Your face data is encrypted and cannot be reconstructed.
              </p>
              <Badge variant="secondary" className="font-mono">
                🔒 Blockchain Secured • Demo Mode
              </Badge>
            </div>
          </div>
        );

      case 'scanning':
        return (
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-64 h-64">
              <div className="w-full h-full bg-gray-200 rounded-full border-4 border-green-500 flex items-center justify-center">
                <div className="text-gray-500 text-sm font-mono">Camera Feed</div>
              </div>
              
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-green-500 rounded-full relative overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 192">
                    <defs>
                      <mask id="clockWipe">
                        <rect width="192" height="192" fill="black" />
                        <path
                          d={`M 96 96 L 96 0 A 96 96 0 0 1 ${96 + 96 * Math.cos(animationProgress * 2 * Math.PI - Math.PI/2)} ${96 + 96 * Math.sin(animationProgress * 2 * Math.PI - Math.PI/2)} Z`}
                          fill="white"
                        />
                      </mask>
                    </defs>
                    <circle cx="96" cy="96" r="96" fill="green" mask="url(#clockWipe)" />
                  </svg>
                </div>
              </div>
              
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-sm text-green-600 font-semibold mb-2">
                  Scanning in progress...
                </p>
                <div className="w-48 h-2 bg-green-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-100"
                    style={{ width: `${animationProgress * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold font-mono text-green-600">Face Detected</h3>
              <p className="text-muted-foreground">
                Analyzing facial features and creating biometric signature...
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-64 h-64">
              <div className="w-full h-full bg-gray-200 rounded-full border-4 border-green-500 flex items-center justify-center">
                <div className="text-gray-500 text-sm font-mono">Camera Feed</div>
              </div>
              
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-green-500 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold font-mono text-green-600">Face Token Saved</h3>
              <p className="text-muted-foreground">
                Your facial recognition data has been securely stored on the blockchain.
              </p>
              <Badge variant="secondary" className="font-mono bg-green-100 text-green-800">
                ✓ Blockchain Verified • Ready to Continue
              </Badge>
              <div className="text-sm text-muted-foreground">
                Press SPACE to continue
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-mono">Facial Recognition</CardTitle>
        <CardDescription className="font-mono">
          Secure biometric verification for your digital identity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStepContent()}
        
        <div className="flex justify-between mt-8">
          <Button onClick={onPrevious} variant="outline" className="font-mono">
            ← Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
