import * as THREE from 'three';

export interface TextureItem {
  texture: THREE.Texture;
  naturalWidth: number;
  naturalHeight: number;
}

export type TextureItems = Record<string, TextureItem>;

export interface UpdateInfo {
  slowDownFactor: number;
  delta: number;
  time: number;
}

export interface Bounds {
  width: number;
  height: number;
}

interface Coords {
  x: number;
  y: number;
}

export interface Mouse {
  current: Coords;
  target: Coords;
}

export interface CardItemProps {
  itemKey: number;
  itemKeyReverse: number;
}

export interface AnimateProps {
  duration?: number;
  delay?: number;
  destination: number;
  easing?: (amount: number) => number;
}

export type DirectionX = 'left' | 'right';
export type DirectionY = 'up' | 'down';

export interface ScrollValues {
  direction: DirectionY;
  scroll: {
    current: number;
    target: number;
    last: number;
  };
  strength: {
    current: number;
    target: number;
  };
}

export interface DomRectSSR {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
}

export interface AnimateScale {
  xScale: number;
  yScale: number;
  duration?: number;
  parentFn?: () => void;
}

export interface ExitFn {
  targetId: string;
  parentFn: () => void;
}

export interface WrapEl {
  el: HTMLElement | null;
  wrapperClass: string;
}
