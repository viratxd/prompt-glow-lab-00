
import Dexie, { Table } from 'dexie';

export interface HistoryItem {
  id?: number;
  userInput: string;
  systemPrompt: string;
  aiResponse: string;
  date: Date;
}

export class HistoryDatabase extends Dexie {
  history!: Table<HistoryItem>;

  constructor() {
    super('PromptPadHistory');
    this.version(1).stores({
      history: '++id, userInput, systemPrompt, aiResponse, date'
    });
  }
}

export const db = new HistoryDatabase();
