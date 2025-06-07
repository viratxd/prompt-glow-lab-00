
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { enhancePrompt } from "@/services/api";
import { db } from "@/db/historyDb";
import { SystemPrompt } from "../SystemPromptDropdown/SystemPromptDropdown";
import { useToast } from "@/hooks/use-toast";

interface NotepadProps {
  selectedSystemPrompt: SystemPrompt;
}

export const Notepad = ({ selectedSystemPrompt }: NotepadProps) => {
  const [content, setContent] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

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

  return (
    <div className="px-6 pb-6 flex-1 flex flex-col">


      <div className="relative flex-1 min-h-[400px]">


        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}


          placeholder="Start typing your prompt here..."
          className="w-full h-full min-h-[400px] bg-muted/20 backdrop-blur-sm border-blue-500/20 focus:border-blue-400 resize-none text-foreground placeholder:text-muted-foreground/60"


        />
        
        <Button
          onClick={handleEnhance}

          disabled={isEnhancing || !content.trim()}
          className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 disabled:opacity-50"


        >
          {isEnhancing ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-fadein" />


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
  );
};







