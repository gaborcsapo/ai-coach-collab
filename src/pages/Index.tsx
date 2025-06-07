
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Zap, MessageSquare } from 'lucide-react';
import PersonaCreation from '@/components/PersonaCreation';
import LiveComparison from '@/components/LiveComparison';

interface ApiConfig {
  provider: 'gemini';
  apiKey: string;
}

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [personas, setPersonas] = useState([]);
  const [apiConfig, setApiConfig] = useState<ApiConfig>({ provider: 'gemini', apiKey: '' });

  const phases = [
    {
      title: "The Persona Forge 🎯",
      subtitle: "Craft Your AI Dating Coaches",
      icon: Users,
      duration: "20 minutes",
      description: "Design AI personalities that embody different values and worldviews about dating"
    },
    {
      title: "The Live Prompt-Off 💬",
      subtitle: "Compare AI Responses",
      icon: Zap,
      duration: "20 minutes",
      description: "Watch how different system prompts shape AI behavior and advice in real-time"
    },
    {
      title: "The Workshop Debrief ✨",
      subtitle: "Analyze & Reflect",
      icon: MessageSquare,
      duration: "15 minutes",
      description: "Explore how prompts embed values and what this means for AI-human interaction"
    }
  ];

  const handlePersonasUpdate = (newPersonas, newApiConfig) => {
    setPersonas(newPersonas);
    setApiConfig(newApiConfig);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 relative overflow-hidden">
      {/* Dramatic background effects */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with Dynamic Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black bg-gradient-to-r from-pink-300 via-white to-pink-300 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
            {phases[currentPhase].title}
          </h1>
          <p className="text-2xl text-white/90 mb-2 font-bold tracking-wide">
            {phases[currentPhase].subtitle}
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto font-medium">
            {phases[currentPhase].description}
          </p>
        </div>

        {/* Phase Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white/10 backdrop-blur-xl rounded-full p-2 shadow-2xl border border-white/20">
            {phases.map((phase, index) => (
              <Button
                key={index}
                variant={currentPhase === index ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPhase(index)}
                className={`rounded-full transition-all duration-300 font-bold ${
                  currentPhase === index 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl scale-105 border-2 border-white/30' 
                    : 'hover:bg-white/20 text-white/80 hover:text-white hover:scale-105'
                }`}
              >
                <phase.icon className="w-4 h-4 mr-2" />
                Part {index + 1}
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
            <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-3xl text-center text-white font-black">
                  Workshop Debrief & Analysis 🧠
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-pink-200">Discussion Questions 💭</h3>
                  <ul className="space-y-3 text-white/90">
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2 text-xl">🎯</span>
                      Which AI coach gave advice that resonated most with you? What values did you notice?
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2 text-xl">🔍</span>
                      How did different system prompts shape the tone and content of each response?
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2 text-xl">⚖️</span>
                      Which responses felt most authentic vs. scripted? What made the difference?
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2 text-xl">🤖</span>
                      What does this experiment reveal about how we embed our own biases into AI?
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-6 rounded-xl border border-pink-300/30 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-pink-200 mb-3">Key Takeaway 🔑</h3>
                  <p className="text-white/90 text-lg leading-relaxed font-medium">
                    You've just witnessed how the "architect prompt"—the system instructions we give AI—fundamentally shapes its personality, values, and advice. This experiment reveals that AI isn't neutral; it reflects the worldview we embed in it. As AI becomes more prevalent in personal decisions like dating, understanding this power becomes crucial.
                  </p>
                </div>
                
                <div className="text-center pt-4">
                  <Button 
                    onClick={() => setCurrentPhase(0)}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/30"
                  >
                    Run Another Experiment 🔬
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
