
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Persona {
  id: string;
  name: string;
  systemPrompt: string;
  color: string;
}

interface PersonaCreationProps {
  onPersonasUpdate: (personas: Persona[]) => void;
  onNext: () => void;
}

const PersonaCreation: React.FC<PersonaCreationProps> = ({ onPersonasUpdate, onNext }) => {
  const [personas, setPersonas] = useState<Persona[]>([
    {
      id: '1',
      name: 'The Pragmatist',
      systemPrompt: '',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      name: 'The Romantic',
      systemPrompt: '',
      color: 'bg-pink-500'
    }
  ]);

  const colors = [
    'bg-blue-500', 'bg-pink-500', 'bg-green-500', 'bg-purple-500', 
    'bg-orange-500', 'bg-red-500', 'bg-teal-500', 'bg-indigo-500'
  ];

  const examplePersonas = [
    'The Cynic', 'The Therapist', 'The Comedian', 'The Optimist', 
    'The Realist', 'The Dreamer', 'The Mentor', 'The Rebel'
  ];

  const addPersona = () => {
    if (personas.length >= 6) {
      toast({
        title: "Maximum reached",
        description: "You can create up to 6 personas for optimal comparison."
      });
      return;
    }

    const newPersona: Persona = {
      id: Date.now().toString(),
      name: `Persona ${personas.length + 1}`,
      systemPrompt: '',
      color: colors[personas.length % colors.length]
    };

    setPersonas([...personas, newPersona]);
  };

  const removePersona = (id: string) => {
    if (personas.length <= 2) {
      toast({
        title: "Minimum required",
        description: "You need at least 2 personas for comparison."
      });
      return;
    }
    setPersonas(personas.filter(p => p.id !== id));
  };

  const updatePersona = (id: string, field: 'name' | 'systemPrompt', value: string) => {
    setPersonas(personas.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleNext = () => {
    const incompletePersonas = personas.filter(p => !p.name.trim() || !p.systemPrompt.trim());
    
    if (incompletePersonas.length > 0) {
      toast({
        title: "Incomplete personas",
        description: "Please fill in names and system prompts for all personas."
      });
      return;
    }

    onPersonasUpdate(personas);
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Users className="w-6 h-6" />
            Create Your AI Coaches
          </CardTitle>
          <p className="text-gray-600 text-center">
            Define the personalities that will compete in the live prompt-off
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {personas.length} Persona{personas.length !== 1 ? 's' : ''}
              </Badge>
              <span className="text-sm text-gray-500">
                (2-6 recommended)
              </span>
            </div>
            <Button 
              onClick={addPersona}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Persona
            </Button>
          </div>

          <div className="grid gap-6">
            {personas.map((persona, index) => (
              <Card key={persona.id} className="border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${persona.color}`}></div>
                      <Input
                        value={persona.name}
                        onChange={(e) => updatePersona(persona.id, 'name', e.target.value)}
                        className="text-lg font-semibold border-0 p-0 h-auto bg-transparent"
                        placeholder="Persona Name"
                      />
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
                <CardContent>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      System Prompt Canvas
                    </label>
                    <Textarea
                      value={persona.systemPrompt}
                      onChange={(e) => updatePersona(persona.id, 'systemPrompt', e.target.value)}
                      placeholder="Create the 'soul' of your AI. Write a backstory, list core beliefs, describe communication style, mention heroes and villains, define goals. Be detailed and specific - there are no rules!"
                      className="min-h-32 resize-none"
                      rows={4}
                    />
                    <p className="text-xs text-gray-500">
                      Tip: The more detailed and specific you are, the stronger the persona will be.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">Need inspiration? Try these persona types:</h3>
            <div className="flex flex-wrap gap-2">
              {examplePersonas.map((example) => (
                <Badge 
                  key={example} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-gray-300 transition-colors"
                  onClick={() => {
                    const emptyPersona = personas.find(p => !p.name.trim() || p.name.startsWith('Persona '));
                    if (emptyPersona) {
                      updatePersona(emptyPersona.id, 'name', example);
                    }
                  }}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              Ready for Live Testing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonaCreation;
