import { Extension } from '@tiptap/core';

declare module '@tiptap/extension-youtube' {
    interface YoutubeOptions {
        inline: boolean;
        controls: boolean;
        nocookie: boolean;
        allowFullscreen: boolean;
        autoplay: boolean;
        ccLanguage: string;
        ccLoadPolicy: boolean;
        disableKBcontrols: boolean;
        enableIFrameApi: boolean;
        endTime: number;
        height: number;
        interfaceLanguage: string;
        ivLoadPolicy: number;
        loop: boolean;
        modestBranding: boolean;
        origin: string;
        playlist: string;
        progressBarColor: string;
        start: number;
        width: number;
        HTMLAttributes: Record<string, any>;
    }

    interface YoutubeAttributes {
        src: {
            default: null;
        };
        start: {
            default: 0;
        };
        width: {
            default: 640;
        };
        height: {
            default: 480;
        };
    }

    export const Youtube: Extension<YoutubeOptions>;
    export default Youtube;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        youtube: {
            /**
             * Set a YouTube video
             */
            setYoutubeVideo: (options: { src: string; width?: number; height?: number; start?: number }) => ReturnType;
        };
    }
}
