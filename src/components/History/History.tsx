
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Search } from "lucide-react";
import { db, HistoryItem } from "@/db/historyDb";
import { useToast } from "@/hooks/use-toast";

export const History = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadHistory = async () => {
    try {
      const items = await db.history.orderBy('date').reverse().toArray();
      setHistoryItems(items);
      setFilteredItems(items);
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
      const updatedItems = historyItems.filter(item => item.id !== id);
      setHistoryItems(updatedItems);
      setFilteredItems(updatedItems.filter(item => 
        item.userInput.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.aiResponse.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.systemPrompt.toLowerCase().includes(searchQuery.toLowerCase())
      ));
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredItems(historyItems);
    } else {
      const filtered = historyItems.filter(item =>
        item.userInput.toLowerCase().includes(query.toLowerCase()) ||
        item.aiResponse.toLowerCase().includes(query.toLowerCase()) ||
        item.systemPrompt.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="px-6 pb-6 flex items-center justify-center min-h-[400px]">
        <div className="text-slate-200 text-lg">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search history by content, prompt, or response..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-slate-800/50 backdrop-blur-sm border-slate-600/50 text-slate-200 placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center text-slate-200">
            {searchQuery ? (
              <>
                <p className="text-lg">No results found for "{searchQuery}"</p>
                <p className="text-sm mt-2 text-slate-400">Try a different search term.</p>
              </>
            ) : (
              <>
                <p className="text-lg">No history items yet.</p>
                <p className="text-sm mt-2 text-slate-400">Enhanced prompts will appear here.</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="max-h-[600px] overflow-y-auto space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="bg-slate-800/60 backdrop-blur-sm border-slate-600/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-blue-300">
                    System Prompt: {item.systemPrompt}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300">
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
                  <h4 className="text-sm font-medium mb-1 text-slate-100">Original Input:</h4>
                  <p className="text-sm text-slate-200 bg-slate-700/40 p-3 rounded border-l-2 border-yellow-400">
                    {item.userInput}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1 text-slate-100">AI Response:</h4>
                  <div className="text-sm text-slate-100 bg-slate-700/40 p-3 rounded border-l-2 border-green-400 whitespace-pre-wrap">
                    {item.aiResponse}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
