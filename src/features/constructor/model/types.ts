
export interface ChatMessage {
  text: string;
  isAI: boolean;
}

export interface PreviewPanelProps {
  dir: string;
  keyIframe: number;

  isMobileView: boolean;
  toggleMobileView: () => void;
  handleReloadDemo: () => void;
  handleOpenInNewWindow: () => void;
}

export interface ChatInputProps {
  handleSendMessage: (value: string) => void;
  isProcessing: boolean;
}
