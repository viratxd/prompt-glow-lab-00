
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sparkles, Plus, Trash2, ChevronDown } from "lucide-react";
import { enhancePrompt } from "@/services/api";
import { db } from "@/db/historyDb";
import { SystemPrompt } from "../SystemPromptDropdown/SystemPromptDropdown";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { WriteBetter } from "../WriteBetter/WriteBetter";

interface PromptPadProps {
  selectedSystemPrompt: SystemPrompt;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddPrompt: (prompt: string, language: string) => void;
  customPrompts: SystemPrompt[];
  onPromptChange: (prompt: SystemPrompt) => void;
  content: string;
  onContentChange: (content: string) => void;
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

export const PromptPad = ({ 
  selectedSystemPrompt, 
  activeTab, 
  onTabChange,
  onAddPrompt,
  customPrompts,
  onPromptChange,
  content,
  onContentChange
}: PromptPadProps) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('General');
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  const handleEnhance = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to enhance.",
        variant: "destructive"
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await enhancePrompt({
        userInput: content,
        systemPrompt: selectedSystemPrompt.prompt
      });

      await db.history.add({
        userInput: content,
        systemPrompt: selectedSystemPrompt.name,
        aiResponse: response.enhancedText,
        date: new Date()
      });

      onContentChange(response.enhancedText);
      
      toast({
        title: "Enhanced!",
        description: "Your content has been enhanced and saved to history.",
      });
    } catch (error) {
      console.error('Enhancement failed:', error);
      toast({
        title: "Error",
        description: "Failed to enhance content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleClear = () => {
    onContentChange('');
  };

  const handleSavePrompt = () => {
    if (customPrompt.trim()) {
      onAddPrompt(customPrompt, selectedLanguage);
      setCustomPrompt('');
      setSelectedLanguage('General');
      setIsDialogOpen(false);
    }
  };

  const getCharCountColor = () => {
    if (charCount >= 2000) return "text-red-400";
    if (charCount >= 1800) return "text-yellow-400";
    return "text-muted-foreground";
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Static Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="fixed inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-slate-700/50 backdrop-blur-sm">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            PROMPT PAD
          </h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 border-0">
                <Plus className="mr-2 h-4 w-4" />
                Add Prompt
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
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePrompt} className="bg-blue-600 hover:bg-blue-700">
                    Save & Apply
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        {/* Tab Navigation and System Prompt Dropdown */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Tab Switcher */}
          <div className="flex bg-slate-800/50 backdrop-blur-sm rounded-full p-1 border border-slate-700/30">
            {["notepad", "history"].map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                {tab === "notepad" ? "NOTE PAD" : "HISTORY"}
              </button>
            ))}
          </div>

          {/* System Prompt Dropdown */}
          <div>
            <select
              value={selectedSystemPrompt.id}
              onChange={(e) => {
                const allPrompts = [...customPrompts];
                const prompt = allPrompts.find(p => p.id === e.target.value);
                if (prompt) onPromptChange(prompt);
              }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
            >
              <option value={selectedSystemPrompt.id}>
                System Prompt: {selectedSystemPrompt.name}
              </option>
              {customPrompts.map((prompt) => (
                <option key={prompt.id} value={prompt.id}>
                  {prompt.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === "notepad" && (
            <main className="flex-1 px-6 pb-6">
              <div className="relative">
                {/* Textarea Container with WriteBetter */}
                <div className="relative group">
                  <WriteBetter content={content} onTextChange={onContentChange}>
                    <Textarea
                      ref={textareaRef}
                      value={content}
                      onChange={handleTextareaChange}
                      placeholder="Start typing your prompt here... Select any text and click 'Write Better' to enhance it with AI!"
                      className="w-full h-[600px] bg-slate-800/30 backdrop-blur-sm border-slate-700/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none text-slate-100 placeholder:text-slate-400 rounded-xl p-6 text-base leading-relaxed transition-all duration-300 focus:shadow-lg focus:shadow-blue-500/10 scrollbar-hide"
                    />
                  </WriteBetter>
                  
                  {/* Action Buttons */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button
                      onClick={handleClear}
                      variant="outline"
                      size="sm"
                      className="bg-slate-800/80 backdrop-blur-sm border-slate-600/50 text-slate-300 hover:bg-slate-700/80 hover:text-white"
                      disabled={!content.trim()}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear
                    </Button>

                    <Button
                      onClick={handleEnhance}
                      disabled={isEnhancing || !content.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 border-0"
                    >
                      {isEnhancing ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          ENHANCE
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Character Counter */}
                <div className="flex justify-end mt-4">
                  <div className={`text-sm ${getCharCountColor()} bg-slate-800/30 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-700/30`}>
                    {charCount}/2000 characters
                    {charCount >= 1800 && (
                      <span className="ml-2">
                        {charCount >= 2000 ? "⚠️ Limit reached!" : "⚠️ Approaching limit"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </main>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
