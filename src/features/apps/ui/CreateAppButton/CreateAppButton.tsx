
import { memo } from 'react';
import { Plus } from 'lucide-react';
import { UI_ELEMENTS } from '@/shared/config/ui';
import { cn } from '@/shared/lib/utils/common';

interface CreateAppButtonProps {
  onClick: () => void;
}

export const CreateAppButton = memo(({ onClick }: CreateAppButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        UI_ELEMENTS.GLASS_EFFECT,
        'w-full flex items-center justify-center gap-2 text-white/70 hover:text-white',
        'border border-dashed border-white/20 hover:border-white/40'
      )}
    >
      <Plus size={20} className="group-hover:scale-110 transition-transform duration-200" />
      <span>Create New App</span>
    </button>
  );
});

CreateAppButton.displayName = 'CreateAppButton';
