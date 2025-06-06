
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onAddPrompt: (prompt: string, language: string) => void;
}

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

export const Header = ({ onAddPrompt }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('General');

  const handleSave = () => {
    if (customPrompt.trim()) {
      onAddPrompt(customPrompt, selectedLanguage);
      setCustomPrompt('');
      setSelectedLanguage('General');
      setIsOpen(false);
    }
  };

  return (
    <header className="flex items-center justify-center p-6 border-b border-border relative">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
        PROMPT PAD
      </h1>
      
      <div className="absolute right-6">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25">
              ADD PROMPT
            </Button>
          </DialogTrigger>
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
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  Save & Apply
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};
