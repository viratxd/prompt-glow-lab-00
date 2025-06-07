
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { AddPromptDialog } from "./AddPromptDialog";

interface PromptPadHeaderProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onAddPrompt: (prompt: string, language: string) => void;
}

export const PromptPadHeader = ({ 
  isDialogOpen, 
  setIsDialogOpen, 
  onAddPrompt 
}: PromptPadHeaderProps) => {
  return (
    <header className="flex items-center justify-between p-6 border-b border-slate-700/50 backdrop-blur-sm">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        PROMPT PAD
      </h1>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 border-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Prompt
          </Button>
        </DialogTrigger>
        <AddPromptDialog 
          onAddPrompt={onAddPrompt}
          setIsDialogOpen={setIsDialogOpen}
        />
      </Dialog>
    </header>
  );
};
