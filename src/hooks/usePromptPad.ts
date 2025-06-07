
import { useState, useEffect } from "react";
import { enhancePrompt } from "@/services/api";
import { db } from "@/db/historyDb";
import { SystemPrompt } from "@/components/SystemPromptDropdown/SystemPromptDropdown";
import { useToast } from "@/hooks/use-toast";

interface UsePromptPadProps {
  selectedSystemPrompt: SystemPrompt;
  content: string;
  onContentChange: (content: string) => void;
}

export const usePromptPad = ({ selectedSystemPrompt, content, onContentChange }: UsePromptPadProps) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

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

  const handleCopy = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "No content to copy.",
        variant: "destructive"
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Content has been copied to clipboard.",
      });
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: "Error",
        description: "Failed to copy content to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleClear = () => {
    onContentChange('');
  };

  return {
    isEnhancing,
    charCount,
    isDialogOpen,
    setIsDialogOpen,
    handleEnhance,
    handleCopy,
    handleClear
  };
};
