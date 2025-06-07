
import { SystemPrompt } from "../SystemPromptDropdown/SystemPromptDropdown";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedSystemPrompt: SystemPrompt;
  customPrompts: SystemPrompt[];
  onPromptChange: (prompt: SystemPrompt) => void;
}

export const TabNavigation = ({
  activeTab,
  onTabChange,
  selectedSystemPrompt,
  customPrompts,
  onPromptChange
}: TabNavigationProps) => {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      {/* Tab Switcher */}
      <div className="flex bg-slate-800/50 backdrop-blur-sm rounded-full p-1 border border-slate-700/30">
        {["notepad", "history"].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === tab
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            {tab === "notepad" ? "NOTE PAD" : "HISTORY"}
          </button>
        ))}
      </div>

      {/* System Prompt Dropdown */}
      <div>
        <select
          value={selectedSystemPrompt.id}
          onChange={(e) => {
            const allPrompts = [...customPrompts];
            const prompt = allPrompts.find(p => p.id === e.target.value);
            if (prompt) onPromptChange(prompt);
          }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
        >
          <option value={selectedSystemPrompt.id}>
            System Prompt: {selectedSystemPrompt.name}
          </option>
          {customPrompts.map((prompt) => (
            <option key={prompt.id} value={prompt.id}>
              {prompt.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
