
export interface ArtworkData {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface ControlState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  view: boolean;
  exit: boolean;
}
