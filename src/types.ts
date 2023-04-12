export enum BackgroundMessageEnum {
  UrlUpdate = "urlUpdate"
}

export type BackgroundMessage = {
  message: BackgroundMessageEnum;
  url: string;
};
