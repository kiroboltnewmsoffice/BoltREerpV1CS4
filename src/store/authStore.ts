import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';
import { Theme } from '../hooks/useTheme';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  theme: Theme;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setTheme: (theme: Theme) => void;
  hasPermission: (module: string, action: string) => boolean;
  updateUser: (updates: Partial<User>) => void;
  toggleTheme: () => void;
}

// Sample users data
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Anderson',
    email: 'admin@realestate.com',
    role: 'super_admin',
    department: 'Administration',
    isActive: true,
    createdAt: '2024-01-01',
    permissions: [
      { module: 'all', actions: ['create', 'read', 'update', 'delete'] }
    ]
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'finance@realestate.com',
    role: 'finance_manager',
    department: 'Finance',
    isActive: true,
    createdAt: '2024-01-01',
    permissions: [
      { module: 'accounting', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'reports', actions: ['read', 'create'] },
      { module: 'cheques', actions: ['create', 'read', 'update'] }
    ]
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'sales@realestate.com',
    role: 'sales_manager',
    department: 'Sales',
    isActive: true,
    createdAt: '2024-01-01',
    permissions: [
      { module: 'crm', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'properties', actions: ['read', 'update'] },
      { module: 'contracts', actions: ['create', 'read', 'update'] }
    ]
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      theme: 'light',
      
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo login - accepts any email/password combo
        const user = sampleUsers.find(u => u.email === email) || sampleUsers[0];
        
        set({ user, isAuthenticated: true });
        return true;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      setTheme: (theme: Theme) => {
        set({ theme });
      },
      
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        
        // Apply theme to document
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
        
        return newTheme;
      },
      
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
      
      hasPermission: (module: string, action: string) => {
        const { user } = get();
        if (!user) return false;
        
        // Super admin has all permissions
        if (user.role === 'super_admin') return true;
        
        // Check specific permissions
        return user.permissions.some(p => 
          (p.module === module || p.module === 'all') && 
          p.actions.includes(action)
        );
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);