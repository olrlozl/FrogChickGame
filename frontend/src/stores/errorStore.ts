import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ErrorStoreState = {
  errorMessage: string;
}

type ErrorStoreActions = {
  setErrorMessage: (errorMessage: string) => void;
  clearErrorMessage: () => void;
}

type ErrorStore = ErrorStoreState & ErrorStoreActions
export const useErrorStore = create<ErrorStore>()(
  devtools(
    (set) => ({
      errorMessage: '',
      setErrorMessage: (errorMessage: ErrorStoreState['errorMessage']) => set({ errorMessage }),
      clearErrorMessage: () => set({ errorMessage: '' }),
    }),
    { name: 'ErrorStore' }
  )
);