
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export interface SystemPrompt {
  id: string;
  name: string;
  prompt: string;
}

const DEFAULT_PROMPTS: SystemPrompt[] = [
  {
    id: 'react',
    name: 'React',
    prompt: 'You are a React expert. Help improve and optimize React code with best practices, performance considerations, and modern patterns.'
  },
  {
    id: 'python',
    name: 'Python',
    prompt: 'You are a Python expert. Help write clean, efficient, and Pythonic code following PEP 8 standards and best practices.'
  },
  {
    id: 'sql',
    name: 'SQL',
    prompt: 'You are a SQL expert. Help optimize queries, design efficient database schemas, and follow database best practices.'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    prompt: 'You are a TypeScript expert. Help write type-safe code with proper interfaces, generics, and advanced TypeScript features.'
  },
  {
    id: 'general',
    name: 'General',
    prompt: 'You are a helpful assistant. Provide clear, concise, and accurate responses to improve the given content.'
  }
];

interface SystemPromptDropdownProps {
  selectedPrompt: SystemPrompt;
  customPrompts: SystemPrompt[];
  onPromptChange: (prompt: SystemPrompt) => void;
}

export const SystemPromptDropdown = ({ 
  selectedPrompt, 
  customPrompts, 
  onPromptChange 
}: SystemPromptDropdownProps) => {
  const allPrompts = [...DEFAULT_PROMPTS, ...customPrompts];

  return (
    <div className="px-6 pb-4">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-muted/50 border-blue-500/30 hover:bg-blue-600/10 hover:border-blue-400"
            >
              SYSTEM PROMPT: {selectedPrompt.name}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {allPrompts.map((prompt) => (
              <DropdownMenuItem
                key={prompt.id}
                onClick={() => onPromptChange(prompt)}
                className="cursor-pointer"
              >
                {prompt.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export { DEFAULT_PROMPTS };
