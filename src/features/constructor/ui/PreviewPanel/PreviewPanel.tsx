
import { memo, useCallback } from 'react';
import { RefreshCw, ExternalLink, Smartphone } from 'lucide-react';
import type { PreviewPanelProps } from '../../model/types';
import { UI_ELEMENTS } from '@/shared/config/ui';
import { cn } from '@/shared/lib/utils/common';
import { Button } from '@/shared/ui/button/Button';

export const PreviewPanel = memo(({
  dir,
  keyIframe,
  isMobileView,
  toggleMobileView,
  handleReloadDemo,
  isMobileDisplay = false,
}: PreviewPanelProps) => {
  const handleOpenInNewWindow = useCallback(() => {
    window.open(`${import.meta.env.VITE_HOST_URL}/${dir}/index.html`, '_blank');
  }, [dir]);

  const renderButton = useCallback((icon: React.ReactNode, onClick: () => void, title: string, isActive?: boolean) => (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        'p-2 rounded-lg',
        isActive && 'bg-white/10'
      )}
      title={title}
    >
      {icon}
    </Button>
  ), []);

  return (
    <div className="h-full flex flex-col">
      <div className={cn("flex justify-between items-center mb-4", isMobileDisplay ? "mx-0 mt-1" : "mx-[10px]")}>
        <div className="flex gap-2">
          {renderButton(<RefreshCw className="w-5 h-5 text-white" />, handleReloadDemo, "Reload preview")}
          {renderButton(<ExternalLink className="w-5 h-5 text-white" />, handleOpenInNewWindow, "Open in new window")}
          {!isMobileDisplay && renderButton(<Smartphone className="w-5 h-5 text-white" />, toggleMobileView, "Toggle mobile view", isMobileView)}
        </div>
      </div>
 
      <div className={cn(UI_ELEMENTS.GLASS_EFFECT, 'flex-1 overflow-hidden', isMobileDisplay ? "ml-0" : "ml-2")}>
        <div
          className={`w-full h-full transition-all duration-300 ${isMobileView || isMobileDisplay ? 'max-w-[375px] mx-auto' : ''}`}
        >
          <iframe
            key={keyIframe}
            id="preview-iframe"
            src={`${import.meta.env.VITE_HOST_URL}/${dir}/index.html`}
            className="w-full h-full rounded-lg bg-white/5"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
});

PreviewPanel.displayName = 'PreviewPanel';
