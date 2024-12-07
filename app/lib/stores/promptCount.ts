import { atom } from 'nanostores';

export const UNREGISTERED_PROMPT_LIMIT = 10;

export const promptCountStore = atom<number>(0);

export function incrementPromptCount() {
  promptCountStore.set(promptCountStore.get() + 1);
}

export function resetPromptCount() {
  promptCountStore.set(0);
} 