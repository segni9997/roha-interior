export {};

declare global {
  interface Window {
    pannellum: PannellumStatic;
  }
}

interface PannellumStatic {
  viewer(
    container: HTMLElement,
    config: PannellumViewerConfig
  ): PannellumViewer;
}

interface PannellumViewerConfig {
  default?: {
    firstScene?: string;
    sceneFadeDuration?: number;
    autoRotate?: number;
    autoRotateInactivityDelay?: number;
    autoRotateStopDelay?: number;
    compass?: boolean;
    mouseZoom?: boolean;
  };
  scenes: Record<string, PannellumScene>;
}

interface PannellumScene {
  type: "equirectangular";
  panorama: string;
  hotSpots?: unknown[];
  autoLoad?: boolean;
  showControls?: boolean;
  hfov?: number;
  pitch?: number;
  yaw?: number;
}

export interface PannellumViewer {
  destroy(): void;
  loadScene(sceneId: string): void;
  on(event: "scenechange", cb: (sceneId: string) => void): void;
  on(event: "load", cb: () => void): void;
  on(event: "error", cb: (err: string) => void): void;

  getHfov(): number;
  setHfov(value: number): void;
  getPitch(): number;
  setPitch(value: number): void;
  getYaw(): number;
  setYaw(value: number): void;
  getScene(): string;
  toggleFullscreen(): void;
  startAutoRotate(speed?: number): void;
  stopAutoRotate(): void;
  isLoaded(): boolean;
}
