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
  };
  scenes: Record<string, PannellumScene>;
}

interface PannellumScene {
  type: "equirectangular";
  panorama: string;
  hotSpots?: unknown[];
  autoLoad?: boolean;
  showControls?: boolean;
}

export interface PannellumViewer {
  destroy(): void;
  loadScene(sceneId: string): void;
  on(event: "scenechange", cb: (sceneId: string) => void): void;
  on(event: "load", cb: () => void): void;
  on(event: "error", cb: (err: string) => void): void;

  getHfov(): number;
  setHfov(value: number): void;
  setPitch(value: number): void;
  setYaw(value: number): void;
}
