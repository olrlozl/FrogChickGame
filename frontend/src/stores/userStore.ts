import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type UserStoreState = {
  isLogin: boolean;
};

type UserStoreActions = {
  login: () => void;
  logout: () => void;
};

type UserStore = UserStoreState & UserStoreActions;

export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      isLogin: false,
      login: () => set({ isLogin: true }),
      logout: () => set({ isLogin: false }),
    }),
    { name: 'UserStore' }
  )
);
