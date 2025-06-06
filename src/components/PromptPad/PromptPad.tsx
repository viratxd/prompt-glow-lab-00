
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Plus, Trash2 } from "lucide-react";
import { enhancePrompt } from "@/services/api";
import { db } from "@/db/historyDb";
import { SystemPrompt } from "../SystemPromptDropdown/SystemPromptDropdown";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface PromptPadProps {
  selectedSystemPrompt: SystemPrompt;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddPrompt: (prompt: string, language: string) => void;
  customPrompts: SystemPrompt[];
  onPromptChange: (prompt: SystemPrompt) => void;
}

export const PromptPad = ({ 
  selectedSystemPrompt, 
  activeTab, 
  onTabChange,
  onAddPrompt,
  customPrompts,
  onPromptChange 
}: PromptPadProps) => {
  const [content, setContent] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [charCount, setCharCount] = useState(0);
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

      // Save to history
      await db.history.add({
        userInput: content,
        systemPrompt: selectedSystemPrompt.name,
        aiResponse: response.enhancedText,
        date: new Date()
      });

      // Update content with enhanced version
      setContent(response.enhancedText);
      
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
    setContent('');
    setCharCount(0);
  };

  const getCharCountColor = () => {
    if (charCount >= 2000) return "text-red-400";
    if (charCount >= 1800) return "text-yellow-400";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="fixed inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      <motion.div 
        className="fixed inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_50%)]"
        animate={{
          background: [
            "radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_50%)",
            "radial-gradient(circle_at_70%_70%,rgba(147,51,234,0.15),transparent_50%)",
            "radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_50%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Animated Header */}
        <motion.header 
          className="flex items-center justify-between p-6 border-b border-slate-700/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            PROMPT PAD
          </motion.h1>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 border-0"
              onClick={() => onAddPrompt("", "General")}
            >
              <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Plus className="mr-2 h-4 w-4" />
              </motion.div>
              Add Prompt
            </Button>
          </motion.div>
        </motion.header>

        {/* Tab Navigation and System Prompt Dropdown */}
        <motion.div 
          className="flex items-center justify-between px-6 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Tab Switcher */}
          <div className="flex bg-slate-800/50 backdrop-blur-sm rounded-full p-1 border border-slate-700/30">
            {["notepad", "history"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab === "notepad" ? "NOTE PAD" : "HISTORY"}
              </motion.button>
            ))}
          </div>

          {/* System Prompt Dropdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
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
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === "notepad" && (
            <motion.main 
              className="flex-1 px-6 pb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative">
                {/* Textarea Container */}
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.001 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start typing your prompt here... Let your creativity flow!"
                    className="w-full h-[600px] bg-slate-800/30 backdrop-blur-sm border-slate-700/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none text-slate-100 placeholder:text-slate-400 rounded-xl p-6 text-base leading-relaxed transition-all duration-300 focus:shadow-lg focus:shadow-blue-500/10 scrollbar-hide"
                  />
                  
                  {/* Action Buttons */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
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
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleEnhance}
                        disabled={isEnhancing || !content.trim()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 border-0"
                      >
                        {isEnhancing ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles className="mr-2 h-4 w-4" />
                            </motion.div>
                            Enhancing...
                          </>
                        ) : (
                          <>
                            <motion.div
                              animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Sparkles className="mr-2 h-4 w-4" />
                            </motion.div>
                            ENHANCE
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Character Counter */}
                <motion.div 
                  className="flex justify-end mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className={`text-sm ${getCharCountColor()} bg-slate-800/30 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-700/30`}>
                    {charCount}/2000 characters
                    {charCount >= 1800 && (
                      <motion.span
                        className="ml-2"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        {charCount >= 2000 ? "⚠️ Limit reached!" : "⚠️ Approaching limit"}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
