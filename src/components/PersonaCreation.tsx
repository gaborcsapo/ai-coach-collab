
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Users, Key, Bot } from 'lucide-react';
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

interface PersonaCreationProps {
  onPersonasUpdate: (personas: Persona[], apiConfig: ApiConfig) => void;
  onNext: () => void;
}

const colors = [
  'bg-pink-500',
  'bg-purple-500', 
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-indigo-500'
];

const PersonaCreation: React.FC<PersonaCreationProps> = ({ onPersonasUpdate, onNext }) => {
  const [personas, setPersonas] = useState<Persona[]>([
    { id: '1', name: '', systemPrompt: '', color: colors[0] },
    { id: '2', name: '', systemPrompt: '', color: colors[1] }
  ]);
  
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    provider: 'gemini',
    apiKey: ''
  });

  const addPersona = () => {
    if (personas.length >= 8) {
      toast({
        title: "Maximum coaches reached! 🎯",
        description: "Keep it manageable - max 8 AI coaches for meaningful comparison."
      });
      return;
    }

    const newPersona: Persona = {
      id: Date.now().toString(),
      name: '',
      systemPrompt: '',
      color: colors[personas.length % colors.length]
    };
    setPersonas([...personas, newPersona]);
  };

  const removePersona = (id: string) => {
    if (personas.length <= 2) {
      toast({
        title: "Need at least 2 coaches! 💼",
        description: "Keep the comparison meaningful with minimum 2 personas."
      });
      return;
    }
    setPersonas(personas.filter(p => p.id !== id));
  };

  const updatePersona = (id: string, field: keyof Persona, value: string) => {
    setPersonas(personas.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleNext = () => {
    const incompletePersonas = personas.filter(p => !p.name.trim() || !p.systemPrompt.trim());
    
    if (incompletePersonas.length > 0) {
      toast({
        title: "Incomplete coach profiles! 📝",
        description: "Give each AI coach a name and detailed system prompt."
      });
      return;
    }

    if (!apiConfig.apiKey.trim()) {
      toast({
        title: "Missing API Key! 🔑",
        description: "Need your Gemini API key to power the experiment."
      });
      return;
    }

    onPersonasUpdate(personas, apiConfig);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-white font-bold">
            <Key className="w-6 h-6 text-pink-400" />
            Workshop Setup 🔧
          </CardTitle>
          <p className="text-white/80 font-medium">
            Configure your Google Gemini API to power the AI experiment
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-white font-semibold">Gemini API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Your Google Gemini API key..."
              value={apiConfig.apiKey}
              onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
              className="bg-white border-gray-300 text-black placeholder:text-gray-500"
            />
            <p className="text-white/70 text-sm">
              Get your free API key at <span className="text-pink-300 font-medium">ai.google.dev</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personas Creation */}
      <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-white font-bold">
            <Bot className="w-6 h-6 text-purple-400" />
            Design Your AI Dating Coaches 🎭
          </CardTitle>
          <p className="text-white/80 font-medium">
            Create AI personalities with different values and worldviews about dating and relationships
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-sm bg-pink-500/20 border-pink-300/50 text-pink-200 font-semibold">
              {personas.length} AI Coaches Ready 🤖
            </Badge>
            <Button 
              onClick={addPersona}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold"
            >
              <Plus className="w-4 h-4" />
              Add Coach
            </Button>
          </div>

          <div className="grid gap-6">
            {personas.map((persona, index) => (
              <Card key={persona.id} className="border-2 border-white/30 bg-white/5 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full ${persona.color} shadow-lg`}></div>
                      <h3 className="font-bold text-white text-lg">
                        Coach {index + 1} 🎯
                      </h3>
                    </div>
                    {personas.length > 2 && (
                      <Button
                        onClick={() => removePersona(persona.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${persona.id}`} className="text-white font-semibold">Coach Name/Type</Label>
                    <Input
                      id={`name-${persona.id}`}
                      placeholder="The Pragmatist, The Romantic, The Therapist, The Realist..."
                      value={persona.name}
                      onChange={(e) => updatePersona(persona.id, 'name', e.target.value)}
                      className="bg-white border-gray-300 text-black placeholder:text-gray-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`prompt-${persona.id}`} className="text-white font-semibold">System Prompt (The Coach's "Soul") 🧠</Label>
                    <Textarea
                      id={`prompt-${persona.id}`}
                      placeholder="Define this AI's core values, worldview, and approach to dating advice. What does it believe about relationships? How does it communicate? What's its backstory? Be detailed and specific - this shapes everything the AI will say..."
                      className="min-h-32 bg-white border-gray-300 text-black placeholder:text-gray-500"
                      value={persona.systemPrompt}
                      onChange={(e) => updatePersona(persona.id, 'systemPrompt', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center pt-4">
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/30"
            >
              <Users className="w-6 h-6 mr-2" />
              Start the Experiment! 🔬
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonaCreation;
