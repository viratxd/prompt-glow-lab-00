
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PromptPad } from "@/components/PromptPad/PromptPad";
import { SystemPrompt, DEFAULT_PROMPTS } from "@/components/SystemPromptDropdown/SystemPromptDropdown";
import { History } from "@/components/History/History";

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState("notepad");
  const [selectedSystemPrompt, setSelectedSystemPrompt] = useState<SystemPrompt>(DEFAULT_PROMPTS[0]);
  const [customPrompts, setCustomPrompts] = useState<SystemPrompt[]>(DEFAULT_PROMPTS);

  const handleAddPrompt = (prompt: string, language: string) => {
    const newPrompt: SystemPrompt = {
      id: `custom-${Date.now()}`,
      name: `Custom ${language}`,
      prompt: prompt || `You are a ${language} expert. Help improve and enhance the given content with best practices and modern approaches.`
    };
    
    setCustomPrompts(prev => [...prev, newPrompt]);
    setSelectedSystemPrompt(newPrompt);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          {activeTab === "notepad" ? (
            <PromptPad 
              selectedSystemPrompt={selectedSystemPrompt}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onAddPrompt={handleAddPrompt}
              customPrompts={customPrompts}
              onPromptChange={setSelectedSystemPrompt}
            />
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <div className="relative z-10">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
                  <div className="flex bg-slate-800/50 backdrop-blur-sm rounded-full p-1 border border-slate-700/30">
                    {["notepad", "history"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
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
                </div>
                <History />
              </div>
            </div>
          )}
        </div>
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
