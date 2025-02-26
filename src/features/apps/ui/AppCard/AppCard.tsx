
import { memo, useCallback } from 'react';
import type { App } from '../../model/types';
import { UI_ELEMENTS } from '@/shared/config/ui';
import { cn } from '@/shared/lib/utils/common';

interface AppCardProps {
  app: App;
  onClick: (id: number) => void;
}

export const AppCard = memo(({ app, onClick }: AppCardProps) => {
  const handleClick = useCallback(() => {
    onClick(app.id);
  }, [app.id, onClick]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        UI_ELEMENTS.GLASS_EFFECT,
        'w-full text-left hover:bg-white/5 transition-colors duration-200'
      )}
    >
      <h3 className="text-xl font-medium text-white mb-2">{app.name}</h3>
      <p className="text-gray-400">{app.description}</p>
    </button>
  );
});

AppCard.displayName = 'AppCard';
