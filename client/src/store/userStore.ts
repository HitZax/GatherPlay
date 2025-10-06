import { create } from 'zustand';

interface User {
  id: string;
  username: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUsername: (username: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUsername: (username) =>
    set((state) => (state.user ? { user: { ...state.user, username } } : state)),
}));

// Load user from localStorage on init
const storedUser = localStorage.getItem('gatherplay_user');
if (storedUser) {
  try {
    useUserStore.setState({ user: JSON.parse(storedUser) });
  } catch (e) {
    localStorage.removeItem('gatherplay_user');
  }
}

// Save user to localStorage when it changes
useUserStore.subscribe((state) => {
  if (state.user) {
    localStorage.setItem('gatherplay_user', JSON.stringify(state.user));
  } else {
    localStorage.removeItem('gatherplay_user');
  }
});
