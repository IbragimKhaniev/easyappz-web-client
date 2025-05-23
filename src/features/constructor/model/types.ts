import { GetApplicationsApplicationIdMessages200Item, GetApplicationsApplicationIdLogs200 } from "@/api/core";
import { IMongoModelApplication } from '@/api/core';

export interface ChatMessage {
  data: GetApplicationsApplicationIdMessages200Item;
  applicationId: string;
}

export interface ChatInputProps {
  handleSendMessage: (value: string) => void;
  isProcessing: boolean;
}

export interface PreviewPanelProps {
  application: IMongoModelApplication;
  
  keyIframe: number;
  isMobileView: boolean;
  toggleMobileView: () => void;
  handleReloadDemo: () => void;
  isMobileDisplay?: boolean;

  onClickRestart: VoidFunction;

  logs?: GetApplicationsApplicationIdLogs200;
}
