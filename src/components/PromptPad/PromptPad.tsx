
import { AnimatePresence } from "framer-motion";
import { SystemPrompt } from "../SystemPromptDropdown/SystemPromptDropdown";
import { usePromptPad } from "@/hooks/usePromptPad";
import { PromptPadHeader } from "./PromptPadHeader";
import { TabNavigation } from "./TabNavigation";
import { TextareaSection } from "./TextareaSection";

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
  const {
    isEnhancing,
    charCount,
    isDialogOpen,
    setIsDialogOpen,
    handleEnhance,
    handleCopy,
    handleClear
  } = usePromptPad({ selectedSystemPrompt, content, onContentChange });

  const handleSavePrompt = (prompt: string, language: string) => {
    onAddPrompt(prompt, language);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Static Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="fixed inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <PromptPadHeader 
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          onAddPrompt={handleSavePrompt}
        />

        {/* Tab Navigation and System Prompt Dropdown */}
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={onTabChange}
          selectedSystemPrompt={selectedSystemPrompt}
          customPrompts={customPrompts}
          onPromptChange={onPromptChange}
        />

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === "notepad" && (
            <TextareaSection 
              content={content}
              onContentChange={onContentChange}
              charCount={charCount}
              isEnhancing={isEnhancing}
              onEnhance={handleEnhance}
              onCopy={handleCopy}
              onClear={handleClear}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
