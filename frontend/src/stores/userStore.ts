import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

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
    persist(
      (set) => ({
        isLogin: false,
        login: () => set({ isLogin: true }),
        logout: () => set({ isLogin: false }),
      }),
      { name: 'UserStore' }
    ),
    { name: 'UserStore' }
  )
);
