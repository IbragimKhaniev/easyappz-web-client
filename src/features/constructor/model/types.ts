import { GetApplicationsApplicationIdMessages200Item } from "@/api/core";

export interface ChatMessage {
  data: GetApplicationsApplicationIdMessages200Item;
  applicationId: string;
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
