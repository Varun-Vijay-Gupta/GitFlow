import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Moon, Sun, Zap } from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-primary">
          <Zap className="h-6 w-6" />
          <span>GigFlow</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user && (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.name}{' '}
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs capitalize text-primary">
                {user.role}
              </span>
            </span>
          )}

          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}
