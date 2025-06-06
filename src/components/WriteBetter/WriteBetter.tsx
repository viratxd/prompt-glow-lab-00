
import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Check, X } from 'lucide-react';
import { useWriteBetter } from '@/hooks/useWriteBetter';

interface WriteBetterProps {
  children: ReactNode;
  content: string;
  onTextChange?: (newText: string) => void;
  className?: string;
}

export const WriteBetter = ({ children, content, onTextChange, className }: WriteBetterProps) => {
  const {
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
  } = useWriteBetter(content, onTextChange);

  const handleWriteBetter = () => {
    setShowPromptInput(true);
    setCustomPrompt(`You're an expert at writing better with more detail. Improve this: "${selection?.text}"`);
  };

  const handleEnhance = async () => {
    if (!customPrompt.trim()) return;
    await enhanceText(customPrompt);
  };

  const handleCancel = () => {
    clearSelection();
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
