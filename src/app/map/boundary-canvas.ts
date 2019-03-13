import './boundary-canvas-src.js';

declare module 'leaflet' {
    export namespace TileLayer {
        class BoundaryCanvas extends TileLayer.WMS {
            constructor(baseUrl: string, options: BoundaryCanvasOptions);
            options: BoundaryCanvasOptions;
        }
    }

    export interface BoundaryCanvasOptions extends WMSOptions {
        boundary?: GeoJSON.GeoJsonObject;
        useBoundaryGreaterAsZoom?: number;
    }

    export namespace tileLayer {
        export function boundaryCanvas(baseUrl: string, options?: BoundaryCanvasOptions): TileLayer.BoundaryCanvas;
    }
}
