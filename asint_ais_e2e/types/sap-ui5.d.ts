export {};

declare global {
  interface Window {
    sap?: {
      ui?: {
        getCore?: () => {
          getUIDirty?: () => boolean;
        };
      };
    };
  }
}
