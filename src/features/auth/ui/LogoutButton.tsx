
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export const LogoutButton = memo(() => {
  const navigate = useNavigate();
  
  const handleLogout = useCallback(() => {
    navigate(ROUTES.WELCOME);
  }, [navigate]);

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      className="flex items-center gap-2 font-medium"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </Button>
  );
});

LogoutButton.displayName = 'LogoutButton';
