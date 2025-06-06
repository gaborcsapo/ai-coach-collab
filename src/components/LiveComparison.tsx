
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

interface ApiConfig {
  provider: 'gemini' | 'claude';
  apiKey: string;
}

interface LiveComparisonProps {
  personas: Persona[];
  apiConfig: ApiConfig;
  onNext: () => void;
}

interface Response {
  personaId: string;
  content: string;
  loading: boolean;
  error?: string;
}

const LiveComparison: React.FC<LiveComparisonProps> = ({ personas, apiConfig, onNext }) => {
  const [scenario, setScenario] = useState('');
  const [responses, setResponses] = useState<Response[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const callGeminiAPI = async (systemPrompt: string, userMessage: string): Promise<string> => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiConfig.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: ${userMessage}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
  };

  const callClaudeAPI = async (systemPrompt: string, userMessage: string): Promise<string> => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiConfig.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: userMessage
        }]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Claude API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || 'No response generated';
  };

  const generateResponse = async (persona: Persona, userMessage: string): Promise<string> => {
    if (apiConfig.provider === 'gemini') {
      return await callGeminiAPI(persona.systemPrompt, userMessage);
    } else {
      return await callClaudeAPI(persona.systemPrompt, userMessage);
    }
  };

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

    try {
      // Run all persona responses in parallel
      const responsePromises = personas.map(async (persona) => {
        try {
          const content = await generateResponse(persona, scenario);
          return { personaId: persona.id, content, loading: false };
        } catch (error) {
          console.error(`Error generating response for ${persona.name}:`, error);
          return { 
            personaId: persona.id, 
            content: '', 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to generate response' 
          };
        }
      });

      const results = await Promise.all(responsePromises);
      setResponses(results);
      
    } catch (error) {
      console.error('Error in runComparison:', error);
      toast({
        title: "Error",
        description: "Failed to generate responses. Please check your API key and try again."
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
            Watch your AI coaches respond to the same scenario simultaneously using {apiConfig.provider === 'gemini' ? 'Google Gemini' : 'Anthropic Claude'}
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
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
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
