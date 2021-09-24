import React, { useRef, useEffect } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { useDelayedRouteExit } from "hooks/useDelayedRouteExit";
import { globalState } from "utils/globalState";

import { App } from "../classes/App";
import styles from "../styles/app.module.scss";
import "../styles/index.scss";

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  const router = useRouter();

  useDelayedRouteExit();

  const rendererWrapperEl = useRef(null);

  useEffect(() => {
    if (!rendererWrapperEl.current) return;

    if (rendererWrapperEl.current) {
      globalState.app = App.getInstance();
      globalState.app.rendererWrapperEl = rendererWrapperEl.current;
    }

    return () => {
      if (globalState.app) globalState.app.destroy();
    };
  }, []);

  return (
    <>
      <div className={styles.canvasWrapper} ref={rendererWrapperEl}></div>
      <Component router={router} {...pageProps} />
    </>
  );
}
