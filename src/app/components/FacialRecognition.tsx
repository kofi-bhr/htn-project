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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Start camera when component mounts
    startCamera();
    
    // Cleanup camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setErrorMessage('Camera access denied. Please allow camera permissions.');
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault();
      if (step === 'instructions') {
        startScanning();
      } else if (step === 'error') {
        retryScanning();
      }
    } else if (event.code === 'KeyB') {
      event.preventDefault();
      if (step === 'instructions') {
        simulateFailure();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [step]);

  const startScanning = () => {
    setStep('scanning');
    setProgress(0);
    
    // Simulate scanning process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep('processing');
          simulateProcessing();
          return 100;
        }
        return prev + 2;
      });
    }, 60);
  };

  const simulateProcessing = () => {
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 1000);
  };

  const simulateFailure = () => {
    setStep('error');
    setErrorMessage('Face not detected properly. Please ensure your face is centered in the circle.');
  };

  const retryScanning = () => {
    setStep('instructions');
    setErrorMessage('');
    setProgress(0);
  };

  const renderStepContent = () => {
    switch (step) {
      case 'instructions':
        return (
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-64 h-64">
              {/* Camera feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-full border-4 border-red-500"
              />
              
              {/* Overlay circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-red-500 rounded-full animate-pulse"></div>
              </div>
              
              {/* Instructions */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Center your face in the red circle
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <Badge variant="outline" className="font-mono">
                    SPACE - Start Scan
                  </Badge>
                  <Badge variant="outline" className="font-mono">
                    B - Test Failure
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
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-full border-4 border-green-500"
              />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-green-500 rounded-full">
                  <div className="w-full h-full border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-sm text-green-600 font-semibold mb-2">
                  Scanning in progress...
                </p>
                <Progress value={progress} className="w-48" />
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

      case 'processing':
        return (
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-64 h-64">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-full border-4 border-blue-500 opacity-50"
              />
              
              {/* Processing overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-blue-500 rounded-full">
                  <div className="w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-sm text-blue-600 font-semibold mb-2">
                  Processing biometric data...
                </p>
                <div className="w-48 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold font-mono text-blue-600">Encrypting Data</h3>
              <p className="text-muted-foreground">
                Creating secure biometric hash and storing on blockchain...
              </p>
              <Badge variant="secondary" className="font-mono">
                🔐 Encrypting • Storing on Solana
              </Badge>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-64 h-64">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-full border-4 border-green-500 opacity-50"
              />
              
              {/* Success overlay */}
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
              <h3 className="text-xl font-semibold font-mono text-green-600">Biometric Signature Created</h3>
              <p className="text-muted-foreground">
                Your facial recognition data has been securely stored on the blockchain.
              </p>
              <Badge variant="secondary" className="font-mono bg-green-100 text-green-800">
                ✓ Blockchain Verified • Ready to Continue
              </Badge>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-64 h-64">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-full border-4 border-red-500"
              />
              
              {/* Error overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-red-500 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-sm text-red-600 font-semibold mb-2">
                  Scan Failed
                </p>
                <Badge variant="outline" className="font-mono">
                  SPACE - Try Again
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold font-mono text-red-600">Face Not Detected</h3>
              <p className="text-muted-foreground">
                {errorMessage}
              </p>
              <Badge variant="destructive" className="font-mono">
                ❌ Retry Required
              </Badge>
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
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button onClick={onPrevious} variant="outline" className="font-mono">
            ← Back
          </Button>
          {step === 'success' && (
            <Button onClick={onComplete} className="font-mono">
              Continue →
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
