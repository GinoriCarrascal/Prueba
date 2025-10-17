import { BotContext } from "@builderbot/bot/dist/types";

export type Role = 'user' | 'assistant';

export interface History {
  role: Role;
  content: string;
}

type State = BotContext['state'];

const HISTORY_KEY = 'history' as const;
const MAX_ENTRIES = 50;

/**
 * Agrega un mensaje al historial (sin mutar y con límite de tamaño)
 */
export const handleHistory = async (entry: History, state: State) => {
  const history = (state.get(HISTORY_KEY) as History[]) ?? [];
  const next = [...history, entry].slice(-MAX_ENTRIES);
  await state.update({ [HISTORY_KEY]: next });
};

/**
 * Obtiene los últimos k mensajes del historial
 */
export const getHistory = (state: State, k = 6): History[] => {
  const history = (state.get(HISTORY_KEY) as History[]) ?? [];
  return history.slice(-k);
};

/**
 * Devuelve el historial como string para pasarlo al prompt
 */
export const getHistoryParse = (state: State): string => {
  const history = (state.get(HISTORY_KEY) as History[]) ?? [];
  if (history.length === 0) return '';
  return history
    .map(msg => {
      const speaker = msg.role === 'user' ? 'Cliente' : 'Vendedor';
      const content = msg.content.replace(/"/g, '\\"');
      return `${speaker}: "${content}"`;
    })
    .join('\n');
};

/**
 * Limpia solo el historial (sin afectar otros datos del state)
 */
export const clearHistory = async (state: State) => {
  await state.update({ [HISTORY_KEY]: [] });
};
