
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "@/components/Header/Header";
import { TabNavigation } from "@/components/Tabs/TabNavigation";
import { SystemPromptDropdown, SystemPrompt, DEFAULT_PROMPTS } from "@/components/SystemPromptDropdown/SystemPromptDropdown";
import { Notepad } from "@/components/Notepad/Notepad";
import { History } from "@/components/History/History";

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState("notepad");
  const [selectedSystemPrompt, setSelectedSystemPrompt] = useState<SystemPrompt>(DEFAULT_PROMPTS[0]);
  const [customPrompts, setCustomPrompts] = useState<SystemPrompt[]>([]);

  const handleAddPrompt = (prompt: string, language: string) => {
    const newPrompt: SystemPrompt = {
      id: `custom-${Date.now()}`,
      name: `Custom ${language}`,
      prompt: prompt
    };
    
    setCustomPrompts(prev => [...prev, newPrompt]);
    setSelectedSystemPrompt(newPrompt);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          {/* Background effects */}
          <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-background to-blue-950/10 pointer-events-none" />
          <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header onAddPrompt={handleAddPrompt} />
            
            <div className="flex items-center justify-center relative">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="absolute right-6">
                <SystemPromptDropdown
                  selectedPrompt={selectedSystemPrompt}
                  customPrompts={customPrompts}
                  onPromptChange={setSelectedSystemPrompt}
                />
              </div>
            </div>
            
            <main className="flex-1 flex flex-col">
              {activeTab === "notepad" ? (
                <Notepad selectedSystemPrompt={selectedSystemPrompt} />
              ) : (
                <History />
              )}
            </main>
          </div>
        </div>
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
