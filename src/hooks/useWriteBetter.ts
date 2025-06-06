
import { useState, useRef, useCallback } from 'react';
import { sendMessage } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface SelectionState {
  start: number;
  end: number;
  text: string;
  x: number;
  y: number;
}

export const useWriteBetter = (onTextChange?: (newText: string) => void) => {
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleMouseUp = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end).trim();

    if (selectedText && start !== end) {
      const rect = textarea.getBoundingClientRect();
      const textBeforeSelection = textarea.value.substring(0, start);
      const lines = textBeforeSelection.split('\n');
      const lineHeight = 24;
      const charWidth = 8;
      
      const currentLine = lines.length - 1;
      const currentCol = lines[lines.length - 1].length;
      
      const x = rect.left + (currentCol * charWidth);
      const y = rect.top + (currentLine * lineHeight) - 40;

      setSelection({
        start,
        end,
        text: selectedText,
        x: Math.min(x, window.innerWidth - 200),
        y: Math.max(y, 10)
      });
    } else {
      setSelection(null);
    }
  }, []);

  const enhanceText = async (prompt: string) => {
    if (!selection || !textareaRef.current) return;

    setIsEnhancing(true);
    try {
      const response = await sendMessage(prompt);
      const data = await response.json();
      const enhancedText = data.choices?.[0]?.message?.content || selection.text;

      const textarea = textareaRef.current;
      const fullText = textarea.value;
      const newText = fullText.substring(0, selection.start) + enhancedText + fullText.substring(selection.end);
      
      textarea.value = newText;
      onTextChange?.(newText);

      setSelection(null);
      setShowPromptInput(false);
      setCustomPrompt('');

      toast({
        title: "Enhanced!",
        description: "Your text has been improved successfully.",
      });
    } catch (error) {
      console.error('Enhancement failed:', error);
      toast({
        title: "Error",
        description: "Failed to enhance text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const clearSelection = () => {
    setSelection(null);
    setShowPromptInput(false);
    setCustomPrompt('');
  };

  return {
    selection,
    showPromptInput,
    setShowPromptInput,
    customPrompt,
    setCustomPrompt,
    isEnhancing,
    textareaRef,
    handleMouseUp,
    enhanceText,
    clearSelection
  };
};
