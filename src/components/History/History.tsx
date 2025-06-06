
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { db, HistoryItem } from "@/db/historyDb";
import { useToast } from "@/hooks/use-toast";

export const History = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadHistory = async () => {
    try {
      const items = await db.history.orderBy('date').reverse().toArray();
      setHistoryItems(items);
    } catch (error) {
      console.error('Failed to load history:', error);
      toast({
        title: "Error",
        description: "Failed to load history.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await db.history.delete(id);
      setHistoryItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Deleted",
        description: "History item removed successfully.",
      });
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="px-6 pb-6 flex items-center justify-center min-h-[400px]">
        <div className="text-slate-300 text-lg">Loading history...</div>
      </div>
    );
  }

  if (historyItems.length === 0) {
    return (
      <div className="px-6 pb-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center text-slate-300">
          <p className="text-lg">No history items yet.</p>
          <p className="text-sm mt-2 text-slate-400">Enhanced prompts will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 space-y-4 max-h-[600px] overflow-y-auto">
      {historyItems.map((item) => (
        <Card key={item.id} className="bg-slate-800/40 backdrop-blur-sm border-slate-600/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-300">
                System Prompt: {item.systemPrompt}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  {new Date(item.date).toLocaleString()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => item.id && deleteItem(item.id)}
                  className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-300 text-slate-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="text-sm font-medium mb-1 text-slate-200">Original Input:</h4>
              <p className="text-sm text-slate-300 bg-slate-700/30 p-3 rounded border-l-2 border-yellow-400">
                {item.userInput}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1 text-slate-200">AI Response:</h4>
              <div className="text-sm text-slate-200 bg-slate-700/30 p-3 rounded border-l-2 border-green-400 whitespace-pre-wrap">
                {item.aiResponse}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
