import './control-opacity-src.js';

declare module 'leaflet' {
    export namespace control {
        function opacity(overlays?: Control.LayersObject, options?: OpacityOptions): Control.Layers;
    }
    export interface OpacityOptions extends ControlOptions {
        collapsed?: boolean;
        label?: string;
    }
}
