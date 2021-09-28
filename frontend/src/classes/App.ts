import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import debounce from "lodash/debounce";

import { MouseMove } from "./Singletons/MouseMove";
import { Scroll } from "./Singletons/Scroll";
import { SlideScene } from "./Scenes/SlideScene";
import { Preloader } from "./Utility/Preloader";

export class App extends THREE.EventDispatcher {
  static defaultFps = 60;
  static dtFps = 1000 / App.defaultFps;

  static _instance: App | null;
  static _canCreate = false;
  static getInstance() {
    if (!App._instance) {
      App._canCreate = true;
      App._instance = new App();
      App._canCreate = false;
    }

    return App._instance;
  }

  _rendererWrapperEl: HTMLDivElement | null = null;
  _rafId: number | null = null;
  _isResumed = true;
  _lastFrameTime: number | null = null;
  _canvas: HTMLCanvasElement | null = null;
  _camera: THREE.PerspectiveCamera | null = null;
  _renderer: THREE.WebGLRenderer | null = null;
  _mouseMove = MouseMove.getInstance();
  _scroll = Scroll.getInstance();
  _preloader = new Preloader();
  _slideScene: SlideScene | null = null;

  constructor() {
    super();

    if (App._instance || !App._canCreate) {
      throw new Error("Use App.getInstance()");
    }

    App._instance = this;
  }

  _onResizeDebounced = debounce(() => this._onResize(), 300);

  _onResize() {
    if (!this._rendererWrapperEl || !this._camera || !this._renderer) {
      return;
    }
    const rendererBounds = this._rendererWrapperEl.getBoundingClientRect();
    const aspectRatio = rendererBounds.width / rendererBounds.height;
    this._camera.aspect = aspectRatio;

    //Set to match pixel size of the elements in three with pixel size of DOM elements
    this._camera.position.z = 1000;
    this._camera.fov =
      2 *
      Math.atan(rendererBounds.height / 2 / this._camera.position.z) *
      (180 / Math.PI);

    this._renderer.setSize(rendererBounds.width, rendererBounds.height);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._camera.updateProjectionMatrix();

    if (this._slideScene) this._slideScene.setRendererBounds(rendererBounds);
  }

  _onVisibilityChange = () => {
    if (document.hidden) {
      this._stopAppFrame();
    } else {
      this._resumeAppFrame();
    }
  };

  _onAssetsLoaded = (e: THREE.Event) => {
    if (this._slideScene) {
      this._slideScene.textureItems = (e.target as Preloader).textureItems;
      this._slideScene.animateIn();
    }
  };

  _addListeners() {
    window.addEventListener("resize", this._onResizeDebounced);
    window.addEventListener("visibilitychange", this._onVisibilityChange);
    this._preloader.addEventListener("loaded", this._onAssetsLoaded);
  }

  _removeListeners() {
    window.removeEventListener("resize", this._onResizeDebounced);
    window.removeEventListener("visibilitychange", this._onVisibilityChange);
    this._preloader.removeEventListener("loaded", this._onAssetsLoaded);
  }

  _resumeAppFrame() {
    this._rafId = window.requestAnimationFrame(this._renderOnFrame);
    this._isResumed = true;
  }

  _renderOnFrame = (time: number) => {
    this._rafId = window.requestAnimationFrame(this._renderOnFrame);

    if (this._isResumed || !this._lastFrameTime) {
      this._lastFrameTime = window.performance.now();
      this._isResumed = false;
      return;
    }

    TWEEN.update(time);

    const delta = time - this._lastFrameTime;
    let slowDownFactor = delta / App.dtFps;

    //Rounded slowDown factor to the nearest integer reduces physics lags
    const slowDownFactorRounded = Math.round(slowDownFactor);

    if (slowDownFactorRounded >= 1) {
      slowDownFactor = slowDownFactorRounded;
    }
    this._lastFrameTime = time;

    this._mouseMove.update({ delta, slowDownFactor, time });
    this._scroll.update({ delta, slowDownFactor, time });

    if (!this._slideScene || !this._renderer || !this._camera) {
      return;
    }

    this._slideScene.update({ delta, slowDownFactor, time });

    this._renderer.render(this._slideScene, this._camera);
  };

  _stopAppFrame() {
    if (this._rafId) {
      window.cancelAnimationFrame(this._rafId);
    }
  }

  destroy() {
    if (this._canvas && this._canvas.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
    }
    this._stopAppFrame();
    this._removeListeners();

    if (this._slideScene) this._slideScene.destroy();
    this._preloader.destroy();
  }

  onRouteChange(route: string, fn: (pageKey: string) => void) {
    setTimeout(() => {
      fn(route);
    }, 1000);
  }

  set rendererWrapperEl(el: HTMLDivElement) {
    this._rendererWrapperEl = el;
    this._canvas = document.createElement("canvas");
    this._rendererWrapperEl.appendChild(this._canvas);
    this._camera = new THREE.PerspectiveCamera();

    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
      alpha: true,
    });

    // this._slideScene = new SlideScene({
    //   camera: this._camera,
    //   scroll: this._scroll,
    //   mouseMove: this._mouseMove,
    // });

    this._onResize();
    this._addListeners();
    this._resumeAppFrame();
  }

  set imagesToPreload(images: string[]) {
    this._preloader.images = images;
  }
}
