
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Zap, MessageSquare } from 'lucide-react';
import PersonaCreation from '@/components/PersonaCreation';
import LiveComparison from '@/components/LiveComparison';

interface ApiConfig {
  provider: 'gemini' | 'claude';
  apiKey: string;
}

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [personas, setPersonas] = useState([]);
  const [apiConfig, setApiConfig] = useState<ApiConfig>({ provider: 'gemini', apiKey: '' });

  const phases = [
    {
      title: "The Persona Forge",
      subtitle: "Craft System Prompts & Configure AI",
      icon: Users,
      duration: "20 minutes",
      description: "Create detailed system prompts that define your AI coach's personality and configure your AI provider"
    },
    {
      title: "The Live Prompt-Off",
      subtitle: "Test & Compare",
      icon: Zap,
      duration: "20 minutes",
      description: "Watch your AI coaches respond to the same scenario simultaneously"
    },
    {
      title: "The Debrief",
      subtitle: "Analyze & Learn",
      icon: MessageSquare,
      duration: "15 minutes",
      description: "Compare responses and understand the power of system prompts"
    }
  ];

  const handlePersonasUpdate = (newPersonas, newApiConfig) => {
    setPersonas(newPersonas);
    setApiConfig(newApiConfig);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Dynamic Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            {phases[currentPhase].title}
          </h1>
          <p className="text-xl text-gray-600 mb-2">{phases[currentPhase].subtitle}</p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {phases[currentPhase].description}
          </p>
        </div>

        {/* Phase Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white rounded-full p-2 shadow-lg">
            {phases.map((phase, index) => (
              <Button
                key={index}
                variant={currentPhase === index ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPhase(index)}
                className={`rounded-full transition-all duration-300 ${
                  currentPhase === index 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <phase.icon className="w-4 h-4 mr-2" />
                Phase {index + 1}
              </Button>
            ))}
          </div>
        </div>

        {/* Phase Content */}
        <div className="max-w-6xl mx-auto">
          {currentPhase === 0 && (
            <PersonaCreation 
              onPersonasUpdate={handlePersonasUpdate}
              onNext={() => setCurrentPhase(1)}
            />
          )}

          {currentPhase === 1 && (
            <LiveComparison 
              personas={personas}
              apiConfig={apiConfig}
              onNext={() => setCurrentPhase(2)}
            />
          )}

          {currentPhase === 2 && (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Debrief & Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600">Guiding Questions</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      What specific words or phrases in each response can we trace back to the system prompts?
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      How did different personas interpret the same question differently?
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Which responses feel most 'human'? Which feel most 'robotic'? Why?
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Which response would you actually use? What does that say about your values?
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-600 mb-3">Key Takeaway</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    You have the power to be the architect of AI personality. A thoughtful, well-crafted system prompt is the difference between a generic tool and a powerful, specialized collaborator.
                  </p>
                </div>
                
                <div className="text-center pt-4">
                  <Button 
                    onClick={() => setCurrentPhase(0)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
                  >
                    Start New Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
