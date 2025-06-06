
import { useState, useRef, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Check, X } from 'lucide-react';
import { sendMessage } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface WriteBetterProps {
  children: ReactNode;
  onTextChange?: (newText: string) => void;
  className?: string;
}

interface SelectionState {
  start: number;
  end: number;
  text: string;
  x: number;
  y: number;
}

export const WriteBetter = ({ children, onTextChange, className }: WriteBetterProps) => {
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
      // Calculate button position
      const rect = textarea.getBoundingClientRect();
      const textBeforeSelection = textarea.value.substring(0, start);
      const lines = textBeforeSelection.split('\n');
      const lineHeight = 24; // Approximate line height
      const charWidth = 8; // Approximate character width
      
      const currentLine = lines.length - 1;
      const currentCol = lines[lines.length - 1].length;
      
      const x = rect.left + (currentCol * charWidth);
      const y = rect.top + (currentLine * lineHeight) - 40; // Position above selection

      setSelection({
        start,
        end,
        text: selectedText,
        x: Math.min(x, window.innerWidth - 200), // Prevent overflow
        y: Math.max(y, 10) // Prevent going above viewport
      });
    } else {
      setSelection(null);
    }
  }, []);

  const handleWriteBetter = () => {
    setShowPromptInput(true);
    setCustomPrompt(`You're an expert at writing better with more detail. Improve this: "${selection?.text}"`);
  };

  const handleEnhance = async () => {
    if (!selection || !textareaRef.current) return;

    setIsEnhancing(true);
    try {
      const response = await sendMessage(customPrompt);
      const data = await response.json();
      const enhancedText = data.choices?.[0]?.message?.content || selection.text;

      // Replace selected text with enhanced version
      const textarea = textareaRef.current;
      const fullText = textarea.value;
      const newText = fullText.substring(0, selection.start) + enhancedText + fullText.substring(selection.end);
      
      textarea.value = newText;
      onTextChange?.(newText);

      // Clear selection and close UI
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

  const handleCancel = () => {
    setSelection(null);
    setShowPromptInput(false);
    setCustomPrompt('');
  };

  const cloneChildWithRef = (child: ReactNode) => {
    if (child && typeof child === 'object' && 'type' in child) {
      return {
        ...child,
        props: {
          ...child.props,
          ref: textareaRef,
          onMouseUp: handleMouseUp,
          className: `${child.props.className || ''} ${className || ''}`.trim()
        }
      };
    }
    return child;
  };

  return (
    <div className="relative">
      {cloneChildWithRef(children)}
      
      <AnimatePresence>
        {selection && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50"
            style={{ left: selection.x, top: selection.y }}
          >
            {!showPromptInput ? (
              <Button
                onClick={handleWriteBetter}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 border-0"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Write Better
              </Button>
            ) : (
              <motion.div
                initial={{ width: 120 }}
                animate={{ width: 320 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3 shadow-xl"
              >
                <div className="space-y-2">
                  <Input
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Customize enhancement prompt..."
                    className="text-sm bg-slate-700/50 border-slate-600/50 text-slate-200"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className="h-8 text-slate-400 hover:text-slate-200"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={handleEnhance}
                      disabled={isEnhancing || !customPrompt.trim()}
                      size="sm"
                      className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isEnhancing ? (
                        <Sparkles className="h-3 w-3 animate-spin" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
