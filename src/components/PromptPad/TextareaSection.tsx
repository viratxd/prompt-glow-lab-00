
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Trash2, Copy } from "lucide-react";
import { WriteBetter } from "../WriteBetter/WriteBetter";

interface TextareaSectionProps {
  content: string;
  onContentChange: (content: string) => void;
  charCount: number;
  isEnhancing: boolean;
  onEnhance: () => void;
  onCopy: () => void;
  onClear: () => void;
}

export const TextareaSection = ({
  content,
  onContentChange,
  charCount,
  isEnhancing,
  onEnhance,
  onCopy,
  onClear
}: TextareaSectionProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getCharCountColor = () => {
    if (charCount >= 2000) return "text-red-400";
    if (charCount >= 1800) return "text-yellow-400";
    return "text-muted-foreground";
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  return (
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
              onClick={onCopy}
              variant="outline"
              size="sm"
              className="bg-slate-800/80 backdrop-blur-sm border-slate-600/50 text-slate-300 hover:bg-slate-700/80 hover:text-white"
              disabled={!content.trim()}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>

            <Button
              onClick={onClear}
              variant="outline"
              size="sm"
              className="bg-slate-800/80 backdrop-blur-sm border-slate-600/50 text-slate-300 hover:bg-slate-700/80 hover:text-white"
              disabled={!content.trim()}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>

            <Button
              onClick={onEnhance}
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
  );
};
