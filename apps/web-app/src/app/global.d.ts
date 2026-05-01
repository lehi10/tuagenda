declare module "*.css";

interface Window {
  $chatway?: {
    updateChatwayCustomData: (key: string, value: string) => void;
    isChatwayLoaded: () => boolean;
    isChatwayWidgetOpen: () => boolean;
  };
  $chatwayOnLoad?: (data: { widgetId: string }) => void;
}
