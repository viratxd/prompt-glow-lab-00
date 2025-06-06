
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="px-6 py-4">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid w-fit grid-cols-2 bg-muted/50 rounded-full">
          <TabsTrigger 
            value="notepad" 
            className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            NOTE PAD
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            HISTORY
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
