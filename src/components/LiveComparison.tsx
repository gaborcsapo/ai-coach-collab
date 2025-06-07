
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
  provider: 'gemini';
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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiConfig.apiKey}`, {
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
          topK: 40,
          topP: 0.95,
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

  const generateResponse = async (persona: Persona, userMessage: string): Promise<string> => {
    return await callGeminiAPI(persona.systemPrompt, userMessage);
  };

  const runComparison = async () => {
    if (!scenario.trim()) {
      toast({
        title: "Need a dating scenario! 💕",
        description: "Give your AI coaches something to respond to."
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
        title: "Technical difficulties! 😅",
        description: "Check your API key and try again."
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
      <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <CardTitle className="text-3xl text-center flex items-center justify-center gap-2 text-white font-black">
            <Zap className="w-8 h-8 text-yellow-400" />
            The Live Experiment 🔬
          </CardTitle>
          <p className="text-white/80 text-center font-medium text-lg">
            Watch how different system prompts shape AI behavior and advice
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scenario Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-6 h-6 text-pink-400" />
              <label className="font-bold text-white text-lg">
                Dating Scenario or Question 💭
              </label>
            </div>
            <Textarea
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="Try: 'I've been dating someone for 3 months but they haven't introduced me to their friends. Should I be worried?' or 'Write a dating profile bio for someone who loves hiking and works as a teacher.'"
              className="min-h-24 bg-white border-gray-300 text-black placeholder:text-gray-500 font-medium"
              disabled={isRunning}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={runComparison}
              disabled={isRunning || !scenario.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/30"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Coaches Responding...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Get AI Advice! 🎯
                </>
              )}
            </Button>
            
            {responses.length > 0 && (
              <Button
                onClick={resetComparison}
                variant="outline"
                disabled={isRunning}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-bold"
              >
                Try New Scenario
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personas Display */}
      <div className="grid gap-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge variant="outline" className="text-sm bg-purple-500/20 border-purple-300/50 text-purple-200 font-bold">
            {personas.length} AI Dating Coaches Ready 🤖
          </Badge>
        </div>
        
        <div className="grid gap-4">
          {personas.map((persona) => {
            const response = responses.find(r => r.personaId === persona.id);
            
            return (
              <Card key={persona.id} className="border-2 border-white/30 bg-white/5 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full ${persona.color} shadow-lg`}></div>
                    <CardTitle className="text-xl text-white font-bold">{persona.name}</CardTitle>
                    {response?.loading && (
                      <RefreshCw className="w-5 h-5 animate-spin text-pink-400" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!response && (
                    <div className="text-white/60 italic p-4 text-center font-medium">
                      Waiting for your question... 🤔
                    </div>
                  )}
                  
                  {response?.loading && (
                    <div className="flex items-center justify-center p-8">
                      <div className="text-pink-400 font-bold">Crafting response based on values... 💭</div>
                    </div>
                  )}
                  
                  {response?.error && (
                    <div className="flex items-center gap-2 text-red-400 p-4 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      {response.error}
                    </div>
                  )}
                  
                  {response?.content && !response.loading && (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-black leading-relaxed whitespace-pre-wrap font-medium bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
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
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/30"
          >
            Analyze Results! 📊
          </Button>
        </div>
      )}
    </div>
  );
};

export default LiveComparison;
