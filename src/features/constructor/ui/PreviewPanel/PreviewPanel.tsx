
import { memo, useCallback, useMemo, useState } from 'react';
import { RefreshCw, ExternalLink, Smartphone, CodeXml, Component } from 'lucide-react';
import type { PreviewPanelProps } from '../../model/types';
import { UI_ELEMENTS } from '@/shared/config/ui';
import { cn } from '@/shared/lib/utils/common';
import { Button } from '@/shared/ui/button/Button';

import { CodeEditor } from './components/CodeEditor';

export const PreviewPanel = memo(({
  application,
  keyIframe,
  isMobileView,
  toggleMobileView,
  handleReloadDemo,
  isMobileDisplay = false,
  logs,
}: PreviewPanelProps) => {
  const [codeEditorOpened, setCodeEditorOpened] = useState(false);
  const [logsOpened, setLogsOpened] = useState(false);

  const parsedDir = useMemo(() => `https://${application.domain}.easyappz.ru`, [application.domain]);

  const handleOpenInNewWindow = useCallback(() => {
    window.open(parsedDir, '_blank');
  }, [parsedDir]);

  const handleOpenCodeEditor = useCallback(() => {
    setCodeEditorOpened(true);
  }, []);

  const handleOpenPreviewPanel = useCallback(() => {
    setCodeEditorOpened(false);
  }, []);

  const toggleOpenLogs = useCallback(() => {
    setLogsOpened((logsOpened) => !logsOpened);
  }, []);

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
          {!codeEditorOpened && renderButton(<CodeXml className="w-5 h-5 text-white" />, handleOpenCodeEditor, "Open code editor")}
          {codeEditorOpened && renderButton(<Component className="w-5 h-5 text-white" />, handleOpenPreviewPanel, "Open preview")}
          {renderButton(<Component className="w-5 h-5 text-white" />, toggleOpenLogs, "Open logs")}
        </div>
      </div>
 
      <div className={cn(UI_ELEMENTS.GLASS_EFFECT, 'flex-1 overflow-hidden', isMobileDisplay ? "ml-0" : "ml-2")}>
        <div
          className={`w-full h-full transition-all duration-300 ${isMobileView || isMobileDisplay ? 'max-w-[375px] mx-auto' : ''}`}
        >
          {codeEditorOpened ? (
            <CodeEditor applicationId={application._id} />
          ) : application.dir ? (
            <iframe
              key={keyIframe}
              id="preview-iframe"
              src={parsedDir}
              className="w-full h-full rounded-lg bg-white"
              title="Превью"
              sandbox="allow-scripts allow-forms"
            />
          ) : (
            <div className='h-full flex justify-center' />
          )}
        </div>
        {logsOpened && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#000] p-4 rounded-lg z-999">
            <h2 className="text-lg font-semibold text-white">Logs</h2>
            <div className="overflow-y-auto max-h-[200px]">
              {logs.logs.map((log, index) => (
                <div key={index} className="text-white">
                  <p
                    className={cn(
                      'text-sm',
                    )}
                    style={{
                      color: log.type === 'error' ? 'red' : log.type === 'warning' ? 'yellow' : 'white'
                    }}
                  >
                    {log.createdAt}: {log.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

PreviewPanel.displayName = 'PreviewPanel';
