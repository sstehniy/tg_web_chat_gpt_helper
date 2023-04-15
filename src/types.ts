export enum BackgroundMessageEnum {
  UrlUpdate = "urlUpdate"
}

export type BackgroundMessage = {
  message: BackgroundMessageEnum;
  url: string;
};

export type ContextMessage = {
  content: string;
  isOwn: boolean;
};

export enum OutputMessageType {
  REPLY = "REPLY",
  FOLLOWUP = "FOLLOWUP"
}

export enum PromptType {
  SMART_PROMPT = "SMART_PROMPT"
}
