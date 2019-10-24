import './custom-canvas-src.js';

declare module 'leaflet' {
    export namespace TileLayer {
        class CustomCanvas extends TileLayer.WMS {
            constructor(baseUrl: string, options: CustomCanvasOptions);
            options: CustomCanvasOptions;
        }
    }

    export interface CustomCanvasOptions extends WMSOptions {
        boundary?: GeoJSON.GeoJsonObject;
        useBoundaryGreaterAsZoom?: number;
        useCache?: boolean,
        crossOrigin?: boolean
    }

    export namespace tileLayer {
        export function customCanvas(baseUrl: string, options?: CustomCanvasOptions): TileLayer.CustomCanvas;
    }
}
