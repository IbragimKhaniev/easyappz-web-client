
export interface ChatMessage {
  text: string;
  isAI: boolean;
}

export interface ChatInputProps {
  handleSendMessage: (value: string) => void;
  isProcessing: boolean;
}

export interface PreviewPanelProps {
  keyIframe: number;
  isMobileView: boolean;
  toggleMobileView: () => void;
  handleReloadDemo: () => void;
  isMobileDisplay?: boolean;

  dir?: string;
}
