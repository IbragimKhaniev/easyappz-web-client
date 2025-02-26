
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/shared/ui/button/Button';
import { ROUTES } from '@/shared/config/routes';

export const LogoutButton = memo(() => {
  const navigate = useNavigate();
  
  const handleLogout = useCallback(() => {
    navigate(ROUTES.HOME);
  }, [navigate]);

  return (
    <Button
      variant="danger"
      onClick={handleLogout}
      className="flex items-center gap-2 font-medium"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </Button>
  );
});

LogoutButton.displayName = 'LogoutButton';
