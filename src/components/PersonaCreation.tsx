
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
  'bg-purple-500',
  'bg-blue-500', 
  'bg-green-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-orange-500'
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
        title: "Maximum personas reached",
        description: "You can create up to 8 personas for comparison."
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
        title: "Minimum personas required",
        description: "You need at least 2 personas for comparison."
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
        title: "Incomplete personas",
        description: "Please complete all persona names and system prompts before proceeding."
      });
      return;
    }

    if (!apiConfig.apiKey.trim()) {
      toast({
        title: "API Key required",
        description: "Please enter an API key to proceed with the live comparison."
      });
      return;
    }

    onPersonasUpdate(personas, apiConfig);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Configuration
          </CardTitle>
          <p className="text-gray-600">
            Configure your AI provider for the live comparison
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider">AI Provider</Label>
              <Select 
                value={apiConfig.provider} 
                onValueChange={(value: 'gemini' | 'claude') => 
                  setApiConfig({...apiConfig, provider: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">Google Gemini API</SelectItem>
                  <SelectItem value="claude">Anthropic Claude API</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={apiConfig.apiKey}
                onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personas Creation */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Coach Personas
          </CardTitle>
          <p className="text-gray-600">
            Create detailed system prompts that define each AI coach's personality
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-sm">
              {personas.length} Personas Created
            </Badge>
            <Button 
              onClick={addPersona}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Persona
            </Button>
          </div>

          <div className="grid gap-6">
            {personas.map((persona, index) => (
              <Card key={persona.id} className="border-2 border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${persona.color}`}></div>
                      <h3 className="font-semibold text-gray-700">
                        Coach {index + 1}
                      </h3>
                    </div>
                    {personas.length > 2 && (
                      <Button
                        onClick={() => removePersona(persona.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${persona.id}`}>Persona Name</Label>
                    <Input
                      id={`name-${persona.id}`}
                      placeholder="e.g., The Pragmatist, The Romantic, The Cynic..."
                      value={persona.name}
                      onChange={(e) => updatePersona(persona.id, 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`prompt-${persona.id}`}>System Prompt Canvas</Label>
                    <Textarea
                      id={`prompt-${persona.id}`}
                      placeholder="Create the 'soul' of your AI. Write a backstory, list its core beliefs, describe its communication style, mention its heroes and villains, define its goals. The more detailed and specific you are, the stronger the persona will be..."
                      className="min-h-32"
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
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Proceed to Live Prompt-Off
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonaCreation;
