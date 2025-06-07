
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const LANGUAGES = [
  'Python',
  'Node.js',
  'React',
  'Vite.js',
  'Bash',
  'SQL',
  'TypeScript',
  'JavaScript',
  'General'
];

interface AddPromptDialogProps {
  onAddPrompt: (prompt: string, language: string) => void;
  setIsDialogOpen: (open: boolean) => void;
}

export const AddPromptDialog = ({ onAddPrompt, setIsDialogOpen }: AddPromptDialogProps) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('General');

  const handleSavePrompt = () => {
    if (customPrompt.trim()) {
      onAddPrompt(customPrompt, selectedLanguage);
      setCustomPrompt('');
      setSelectedLanguage('General');
      setIsDialogOpen(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add Custom System Prompt</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Language/Context</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedLanguage}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                >
                  {lang}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">System Prompt</label>
          <Textarea
            placeholder="Enter your custom system prompt..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSavePrompt} className="bg-blue-600 hover:bg-blue-700">
            Save & Apply
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};
