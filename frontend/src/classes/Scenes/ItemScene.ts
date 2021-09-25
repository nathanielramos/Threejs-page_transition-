import * as THREE from "three";

import { UpdateInfo, CardItemProps, Bounds } from "../types";
import { InteractiveScene } from "./InteractiveScene";
import { MouseMove } from "../Singletons/MouseMove";
import { CardItem3DAnimated } from "../Components/CardItem3DAnimated";
import { TextureItems } from "../types";

interface Constructor {
  camera: THREE.PerspectiveCamera;
  mouseMove: MouseMove;
}

export class ItemScene extends InteractiveScene {
  _planeGeometry = new THREE.PlaneGeometry(1, 1, 50, 50);
  _items3D: CardItem3DAnimated[] = [];
  _textureItems: TextureItems = {};
  _collectionWrapper: HTMLDivElement;
  _collectionWrapperRect: DOMRect;
  _imageWrapper: HTMLDivElement | null = null;
  _imageWrapperClientWidth = 1;
  _imageWrapperMarginRight = 1;

  constructor({ camera, mouseMove }: Constructor) {
    super({ camera, mouseMove });

    this._collectionWrapper = Array.from(
      document.querySelectorAll('[data-collection-wrapper="wrapper"]')
    )[0] as HTMLDivElement;

    this._collectionWrapperRect =
      this._collectionWrapper.getBoundingClientRect();
  }

  _handleIndexClick(index: number) {}

  _onItemClick = (e: THREE.Event) => {
    const indexClicked = this._items3D.findIndex((el) => el === e.target);

    this._handleIndexClick(indexClicked);
  };

  _destroyItems() {
    this._items3D.forEach((item) => {
      item.destroy();
      this.remove(item);
      item.removeEventListener("click", this._onItemClick);
    });
    this._items3D = [];
  }

  _onResize() {
    this._collectionWrapperRect =
      this._collectionWrapper.getBoundingClientRect();
    this._measureImageWrapper();
    if (this._items3D) {
      this._items3D.forEach((item) => {
        item.onResize();
      });
    }
  }

  _addListeners() {
    super._addListeners();
  }

  _removeListeners() {
    super._removeListeners();
  }

  _measureImageWrapper() {
    if (this._imageWrapper) {
      this._imageWrapperClientWidth = this._imageWrapper.clientWidth;
      const elStyle = getComputedStyle(this._imageWrapper);
      this._imageWrapperMarginRight = parseFloat(elStyle.marginRight);
    }
  }

  set items(items: CardItemProps[]) {
    this._destroyItems();

    this._items3D.forEach((item) => {
      item.addEventListener("click", this._onItemClick);
    });
  }

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);

    this._items3D.forEach((item) => {
      item.rendererBounds = this._rendererBounds;
    });

    this._onResize();
  }

  set textureItems(textureItems: TextureItems) {
    this._textureItems = textureItems;
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
    this._items3D.forEach((item) => {
      item.update(updateInfo);
    });
  }

  destroy() {
    super.destroy();
    this._destroyItems();
    this._planeGeometry.dispose();
  }
}
