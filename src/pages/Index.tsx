
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Lightbulb, Zap, MessageSquare } from 'lucide-react';
import PersonaCreation from '@/components/PersonaCreation';
import LiveComparison from '@/components/LiveComparison';

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [personas, setPersonas] = useState([]);

  const phases = [
    {
      title: "The Arena Setup",
      subtitle: "Define Your AI Coaches",
      icon: Users,
      duration: "15 minutes",
      description: "Decide what kinds of AI personalities to build and divide into teams"
    },
    {
      title: "The Persona Forge",
      subtitle: "Craft System Prompts",
      icon: Lightbulb,
      duration: "20 minutes",
      description: "Create detailed system prompts that define your AI coach's personality"
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

  const handlePersonasUpdate = (newPersonas) => {
    setPersonas(newPersonas);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            The Persona Prompt
          </h1>
          <p className="text-xl text-gray-600 mb-2">A Live AI Experiment</p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Discover how system prompts shape AI behavior through interactive experimentation
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

        {/* Current Phase Display */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                {React.createElement(phases[currentPhase].icon, {
                  className: "w-12 h-12 text-purple-600"
                })}
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                {phases[currentPhase].title}
              </CardTitle>
              <p className="text-xl text-purple-600 font-semibold mb-2">
                {phases[currentPhase].subtitle}
              </p>
              <Badge variant="outline" className="text-sm">
                {phases[currentPhase].duration}
              </Badge>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 text-lg leading-relaxed">
                {phases[currentPhase].description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Phase Content */}
        <div className="max-w-6xl mx-auto">
          {currentPhase === 0 && (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Workshop Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-600">Core Question</h3>
                    <p className="text-gray-700">
                      "Beyond the question we ask it, how does an AI's core identity—its system prompt—radically change the answer?"
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-600">Your Role</h3>
                    <p className="text-gray-700">
                      Today, you're not just users; you are architects of AI personalities.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600">Example Coach Types</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "The Pragmatist", "The Romantic", "The Cynic", 
                      "The Therapist", "The Comedian", "The Optimist"
                    ].map((type) => (
                      <Badge key={type} variant="secondary" className="p-2 text-center">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="text-center pt-4">
                  <Button 
                    onClick={() => setCurrentPhase(1)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
                  >
                    Start Building Personas
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentPhase === 1 && (
            <PersonaCreation 
              onPersonasUpdate={handlePersonasUpdate}
              onNext={() => setCurrentPhase(2)}
            />
          )}

          {currentPhase === 2 && (
            <LiveComparison 
              personas={personas}
              onNext={() => setCurrentPhase(3)}
            />
          )}

          {currentPhase === 3 && (
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
