declare module '@orestbida/iframemanager' {
  interface IframeManagerInstance {
    run: (config: IframeManagerConfig) => void;
    reset: (hardReset?: boolean) => void;
    // Додайте інші методи, які ви використовуєте з IframeManager, наприклад:
    // acceptService: (serviceName: string | 'all') => void;
    // rejectService: (serviceName: string | 'all') => void;
    // getState: () => any; // Тип для getState потрібно буде уточнити
    // getConfig: () => any; // Тип для getConfig потрібно буде уточнити
  }

  interface IframeManagerConfig {
    currLang: string;
    autoLang?: boolean;
    onChange?: ({
      changedServices,
      eventSource,
    }: {
      changedServices: string[];
      eventSource: {
        type: 'api' | 'click';
        service?: string;
        action?: 'accept' | 'reject';
      };
    }) => void;
    services: {
      [serviceName: string]: IframeServiceConfig;
    };
  }

  interface IframeServiceConfig {
    embedUrl: string;
    thumbnailUrl?:
      | string
      | ((dataId: string, setThumbnail: (url: string) => void) => void)
      | (() => Promise<string>);
    iframe?: IframeOptions;
    cookie?: CookieOptions;
    languages: {
      [lang: string]: LanguageOptions;
    };
    onAccept?: (
      div: HTMLElement,
      setIframe: (iframe: HTMLIFrameElement) => void
    ) => void | Promise<void>;
    onReject?: (iframe: HTMLIFrameElement) => void;
  }
  interface IframeOptions {
    allow?: string;
    params?: string;
    [key: string]: string | number | boolean;
  }

  interface CookieOptions {
    name: string;
    path?: string;
    samesite?: 'lax' | 'strict' | 'none';
    domain?: string;
  }

  interface LanguageOptions {
    notice: string;
    loadBtn: string;
    loadAllBtn: string;
  }

  const iframemanager: () => IframeManagerInstance;
  export default iframemanager;
}
