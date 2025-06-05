
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Zap, Play, RefreshCw, User, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Persona {
  id: string;
  name: string;
  systemPrompt: string;
  color: string;
}

interface LiveComparisonProps {
  personas: Persona[];
  onNext: () => void;
}

interface Response {
  personaId: string;
  content: string;
  loading: boolean;
  error?: string;
}

const LiveComparison: React.FC<LiveComparisonProps> = ({ personas, onNext }) => {
  const [scenario, setScenario] = useState('');
  const [responses, setResponses] = useState<Response[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const exampleScenarios = [
    {
      title: "Dating Bio Writer",
      content: "This is 'Alex.' Facts: a nurse who works night shifts, loves gardening, and is training for a half-marathon. Write a 150-word dating app bio for Alex."
    },
    {
      title: "First Date Ideas",
      content: "I'm finding it hard to plan interesting first dates that aren't just 'grabbing a drink.' Give me three creative and affordable first date ideas."
    },
    {
      title: "Career Advice",
      content: "I'm 25 and feeling stuck in my current job, but I'm afraid to make a change. I have student loans and rent to pay. Should I stay safe or take a risk?"
    },
    {
      title: "Workout Motivation",
      content: "I keep starting workout routines but never stick to them for more than two weeks. How can I finally build a consistent exercise habit?"
    }
  ];

  const runComparison = async () => {
    if (!scenario.trim()) {
      toast({
        title: "No scenario provided",
        description: "Please enter a scenario or question to test."
      });
      return;
    }

    setIsRunning(true);
    const initialResponses = personas.map(persona => ({
      personaId: persona.id,
      content: '',
      loading: true
    }));
    setResponses(initialResponses);

    // Since we can't use real Claude API without proper setup,
    // we'll simulate responses for demo purposes
    const simulateResponse = async (persona: Persona): Promise<string> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      
      // Generate a simulated response based on persona name
      const responses = {
        'The Pragmatist': "Here's a data-driven approach based on efficiency and measurable outcomes...",
        'The Romantic': "Let me share something from the heart that speaks to the beauty of this situation...",
        'The Cynic': "Let's be realistic here - most people won't tell you the harsh truth, but I will...",
        'The Therapist': "I hear what you're asking, and I want to explore the deeper feelings behind this...",
        'The Comedian': "Okay, but first - can we talk about how this is basically every person ever? *laughs*...",
        'The Optimist': "This is actually such an exciting opportunity! Here's why this could be amazing..."
      };
      
      return responses[persona.name as keyof typeof responses] || 
        `As ${persona.name}, I approach this thoughtfully and offer my unique perspective...`;
    };

    try {
      // Run all persona responses in parallel
      const responsePromises = personas.map(async (persona) => {
        try {
          const content = await simulateResponse(persona);
          return { personaId: persona.id, content, loading: false };
        } catch (error) {
          return { 
            personaId: persona.id, 
            content: '', 
            loading: false, 
            error: 'Failed to generate response' 
          };
        }
      });

      const results = await Promise.all(responsePromises);
      setResponses(results);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate responses. Please try again."
      });
    } finally {
      setIsRunning(false);
    }
  };

  const resetComparison = () => {
    setResponses([]);
    setScenario('');
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Zap className="w-6 h-6" />
            Live Prompt-Off Arena
          </CardTitle>
          <p className="text-gray-600 text-center">
            Watch your AI coaches respond to the same scenario simultaneously
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scenario Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-purple-600" />
              <label className="font-semibold text-gray-700">
                The "Guinea Pig" Scenario
              </label>
            </div>
            <Textarea
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="Enter a scenario or question that all personas will respond to..."
              className="min-h-24"
              disabled={isRunning}
            />
          </div>

          {/* Example Scenarios */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Quick Start Examples:</h3>
            <div className="grid gap-2">
              {exampleScenarios.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left h-auto p-3 justify-start"
                  onClick={() => setScenario(example.content)}
                  disabled={isRunning}
                >
                  <div>
                    <div className="font-medium text-purple-600">{example.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{example.content}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={runComparison}
              disabled={isRunning || !scenario.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running Comparison...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Live Comparison
                </>
              )}
            </Button>
            
            {responses.length > 0 && (
              <Button
                onClick={resetComparison}
                variant="outline"
                disabled={isRunning}
              >
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personas Display */}
      <div className="grid gap-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge variant="outline" className="text-sm">
            {personas.length} AI Coaches Ready
          </Badge>
        </div>
        
        <div className="grid gap-4">
          {personas.map((persona) => {
            const response = responses.find(r => r.personaId === persona.id);
            
            return (
              <Card key={persona.id} className="border-2 border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${persona.color}`}></div>
                    <CardTitle className="text-lg">{persona.name}</CardTitle>
                    {response?.loading && (
                      <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!response && (
                    <div className="text-gray-400 italic p-4 text-center">
                      Waiting for scenario...
                    </div>
                  )}
                  
                  {response?.loading && (
                    <div className="flex items-center justify-center p-8">
                      <div className="text-purple-600">Generating response...</div>
                    </div>
                  )}
                  
                  {response?.error && (
                    <div className="flex items-center gap-2 text-red-600 p-4">
                      <AlertCircle className="w-4 h-4" />
                      {response.error}
                    </div>
                  )}
                  
                  {response?.content && !response.loading && (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {response.content}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Next Phase Button */}
      {responses.length > 0 && responses.every(r => !r.loading) && (
        <div className="text-center pt-6">
          <Button 
            onClick={onNext}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
          >
            Proceed to Debrief
          </Button>
        </div>
      )}
    </div>
  );
};

export default LiveComparison;
