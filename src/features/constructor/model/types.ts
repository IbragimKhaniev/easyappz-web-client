
export interface ChatMessage {
  text: string;
  isAI: boolean;
  status?: string;
}

export interface ChatInputProps {
  handleSendMessage: (value: string) => void;
  isProcessing: boolean;
}

export interface PreviewPanelProps {
  applicationId: string;

  keyIframe: number;
  isMobileView: boolean;
  toggleMobileView: () => void;
  handleReloadDemo: () => void;
  isMobileDisplay?: boolean;

  dir?: string;
}
