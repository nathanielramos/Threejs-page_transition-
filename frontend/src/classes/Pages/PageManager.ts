import * as THREE from 'three';

import { Bounds, UpdateInfo } from 'types';
import { globalState } from 'utils/globalState';

import { Transition } from '../Components/Transition';
import { DetailsPage } from './DetailsPage/DetailsPage';
import { IndexPage } from './IndexPage/IndexPage';
import { Page } from './Page';
import { InteractiveScene } from '../Components/InteractiveScene';

export class PageManager extends THREE.EventDispatcher {
  _pagesArray: Page[] = [];
  _transition: Transition;

  constructor() {
    super();

    this._pagesArray.push(new IndexPage({ pageId: '/' }));
    this._pagesArray.push(new DetailsPage({ pageId: '/details' }));
    this._transition = new Transition();
  }

  handlePageEnter(pageEl: HTMLElement) {
    const newPageId = pageEl.dataset.pageid;
    const oldPageId = globalState.currentPageId;
    if (newPageId) globalState.currentPageId = newPageId;

    let isEnterInitial = false;
    if (newPageId === oldPageId) isEnterInitial = true;

    const fromDetailsToIndex = oldPageId === '/details' && newPageId === '/';
    const fromIndexToDetails = oldPageId === '/' && newPageId === '/details';

    const newPage = this._pagesArray.find((page) => page.pageId === newPageId);
    const oldPage = this._pagesArray.find((page) => page.pageId === oldPageId);

    if (newPage) newPage.onEnter(pageEl);

    const parentFn = () => {
      if (newPage) newPage.animateIn();
    };

    if (fromDetailsToIndex) {
      if (oldPage) (oldPage as DetailsPage).onExitToIndex(parentFn);
    } else if (fromIndexToDetails) {
      if (oldPage) (oldPage as IndexPage).onExitToDetails(parentFn);
    } else {
      if (isEnterInitial) {
        // Raf fixes css styles issue (without Raf, they are being added at the same time as a class, and it removes the initial animation)
        return window.requestAnimationFrame(() => {
          parentFn();
        });
      }

      if (oldPage) oldPage.onExit();
      this._transition.show('#ded4bd', parentFn);
    }
    return;
  }

  setRendererBounds(rendererBounds: Bounds) {
    this._pagesArray.forEach((page) => {
      page.setRendererBounds(rendererBounds);
    });

    this._transition.setRendererBounds(rendererBounds);
  }

  setInteractiveScene(scene: InteractiveScene) {
    this._pagesArray.forEach((page) => {
      page.setInteractiveScene(scene);
    });
  }

  onAssetsLoaded() {
    this._pagesArray.forEach((page) => {
      page.onAssetsLoaded();
    });
  }

  update(updateInfo: UpdateInfo) {
    this._pagesArray.forEach((page) => {
      page.update(updateInfo);
    });
  }
}
