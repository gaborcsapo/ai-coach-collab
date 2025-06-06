
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  provider: 'gemini' | 'claude';
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
        title: "Too many hotties! 🔥",
        description: "Keep it exclusive - max 8 personas for the ultimate showdown."
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
        title: "Need at least 2 contestants! 💔",
        description: "Keep the drama alive with minimum 2 personas."
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
        title: "Incomplete profiles! 😱",
        description: "Give each persona a name and personality before the show starts."
      });
      return;
    }

    if (!apiConfig.apiKey.trim()) {
      toast({
        title: "Missing API Key! 🔑",
        description: "Need that secret sauce to make the magic happen."
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
            Behind the Scenes Setup 🎬
          </CardTitle>
          <p className="text-white/80 font-medium">
            Configure your AI magic before the contestants enter the villa
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider" className="text-white font-semibold">AI Provider</Label>
              <Select 
                value={apiConfig.provider} 
                onValueChange={(value: 'gemini' | 'claude') => 
                  setApiConfig({...apiConfig, provider: value})
                }
              >
                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">Google Gemini API 🔥</SelectItem>
                  <SelectItem value="claude">Anthropic Claude API ✨</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-white font-semibold">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Your secret key... 🤫"
                value={apiConfig.apiKey}
                onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personas Creation */}
      <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-white font-bold">
            <Bot className="w-6 h-6 text-purple-400" />
            Cast Your AI Contestants 💫
          </CardTitle>
          <p className="text-white/80 font-medium">
            Create irresistible personalities that will steal hearts and break the internet
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-sm bg-pink-500/20 border-pink-300/50 text-pink-200 font-semibold">
              {personas.length} Contestants Ready ✨
            </Badge>
            <Button 
              onClick={addPersona}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold"
            >
              <Plus className="w-4 h-4" />
              Add Contestant
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
                        Contestant {index + 1} 💋
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
                    <Label htmlFor={`name-${persona.id}`} className="text-white font-semibold">Stage Name</Label>
                    <Input
                      id={`name-${persona.id}`}
                      placeholder="The Flirt, The Mysterious One, The Comedian..."
                      value={persona.name}
                      onChange={(e) => updatePersona(persona.id, 'name', e.target.value)}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`prompt-${persona.id}`} className="text-white font-semibold">Personality Profile 🔥</Label>
                    <Textarea
                      id={`prompt-${persona.id}`}
                      placeholder="Craft their vibe... Are they the confident charmer? The witty rebel? The hopeless romantic? Give them a backstory, quirks, and that special something that makes hearts skip beats..."
                      className="min-h-32 bg-white/10 border-white/30 text-white placeholder:text-white/60"
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
              Let the Games Begin! 🎭
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonaCreation;
