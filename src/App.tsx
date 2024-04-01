import { useEffect, useState } from "react";

import OBR from "@owlbear-rodeo/sdk";
import { LinkHeader } from "./LinkHeader";
import { LinkTracker } from "./LinkTracker";

export function App() {
  const [sceneReady, setSceneReady] = useState(false);
  useEffect(() => {
    OBR.scene.isReady().then(setSceneReady);
    return OBR.scene.onReadyChange(setSceneReady);
  }, []);

  if (sceneReady) {
    return <LinkTracker />;
  } else {
    // Show a basic header when the scene isn't ready
    return (
      <LinkHeader subtitle="Open a scene to use the link tracker" />
    );
  }
}
