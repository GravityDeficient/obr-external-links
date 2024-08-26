import { useState, useEffect } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { LinkHeader } from "./LinkHeader";
import { LinkTracker } from "./LinkTracker";
import { RiskAcknowledgment } from "./RiskAcknowledgment";

export function App() {
  const [sceneReady, setSceneReady] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    OBR.scene.isReady().then(setSceneReady);
    OBR.action.setWidth(400);
    OBR.action.setHeight(268);
    return OBR.scene.onReadyChange(setSceneReady);
  }, []);

  const handleAcknowledge = () => {
    setAcknowledged(true);
  };

  if (!acknowledged) {
    return (
      <RiskAcknowledgment
        onAcknowledge={handleAcknowledge}
      />
    );
  } else {
    if (sceneReady) {
      return <LinkTracker />;
    } else {
      // Show a basic header when the scene isn't ready
      return (
        <LinkHeader subtitle="Open a scene to use external links" />
      );
    }
  }
}
