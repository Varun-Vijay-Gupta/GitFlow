import { Outlet, Link } from 'react-router-dom';
import { Zap, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '../ui/Button';

export function AuthLayout() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <header className="flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary">
          <Zap className="h-6 w-6" />
          GigFlow
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </header>
      <div className="flex flex-1 items-center justify-center px-4 pb-12">
        <Outlet />
      </div>
    </div>
  );
}
