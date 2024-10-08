import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import IconButton from "@mui/material/IconButton";
import PolicyIcon from '@mui/icons-material/Policy';
import Tooltip from '@mui/material/Tooltip';

import OBR, { Math2, Vector2, Player } from "@owlbear-rodeo/sdk";

import { LinkItem } from "./LinkItem";

type LinkListItemProps = {
  linkItem: LinkItem;
  showHidden: boolean;
  openInModal: boolean;
};

export function LinkListItem({
  linkItem,
  showHidden,
  openInModal
}: LinkListItemProps) {
  if (!linkItem.visible && !showHidden) {
    return null;
  }

  async function handleDoubleClick() {
    // Deselect the list item text
    window.getSelection()?.removeAllRanges();

    // Select this item
    await OBR.player.select([linkItem.id]);

    // Focus on this item

    // Convert the center of the selected item to screen-space
    const bounds = await OBR.scene.items.getItemBounds([linkItem.id]);
    const boundsAbsoluteCenter = await OBR.viewport.transformPoint(
      bounds.center
    );

    // Get the center of the viewport in screen-space
    const viewportWidth = await OBR.viewport.getWidth();
    const viewportHeight = await OBR.viewport.getHeight();
    const viewportCenter: Vector2 = {
      x: viewportWidth / 2,
      y: viewportHeight / 2,
    };

    // Offset the item center by the viewport center
    const absoluteCenter = Math2.subtract(boundsAbsoluteCenter, viewportCenter);

    // Convert the center to world-space
    const relativeCenter = await OBR.viewport.inverseTransformPoint(
      absoluteCenter
    );

    // Invert and scale the world-space position to match a viewport position offset
    const viewportScale = await OBR.viewport.getScale();
    const viewportPosition = Math2.multiply(relativeCenter, -viewportScale);

    await OBR.viewport.animateTo({
      scale: viewportScale,
      position: viewportPosition,
    });
  }

  function openModal() {
    OBR.modal.open({
      id: "external-links-modal",
      url: linkItem.url,
      height: 800,
      width: 600,
    });
  }

  async function inspectURL() {
    try {
      await navigator.clipboard.writeText(linkItem.url);
      OBR.notification.show(`URL copied to clipboard. Please inspect it carefully before proceeding. ${linkItem.url}`, 'INFO');
    } catch (error) {
      OBR.notification.show(`Failed to copy external link URL: ${linkItem.url}`, 'ERROR');
    }
  }

  return (
    <ListItem
      key={linkItem.id}
      divider
      onDoubleClick={handleDoubleClick}
    >
      {!linkItem.visible && showHidden && (
      <ListItemIcon sx={{ minWidth: "30px", opacity: "0.5" }}>
        <VisibilityOffRounded fontSize="small" />
      </ListItemIcon>
      )}
      <ListItemText
        sx={{ color: "text.primary" }}
        primary={linkItem.name}
      />
      <ListItemIcon sx={{ marginRight: "-16px" }}>
      <Tooltip title="Copy & Inspect" placement="left">
        <IconButton onClick={inspectURL} size="small" sx={{ padding: "6px" }}>
          <PolicyIcon />
        </IconButton>
        </Tooltip>
      </ListItemIcon>
      {openInModal ? (
      <ListItemIcon sx={{ marginRight: "-16px" }}>
        <Tooltip title={linkItem.url} placement="left">
          <IconButton onClick={openModal} size="small" sx={{ padding: "6px" }} disabled={linkItem.url === "about:blank" || !linkItem.url.startsWith("http") }>
            <OpenInBrowserIcon />
          </IconButton>
        </Tooltip>
      </ListItemIcon>
      ) : (
      <ListItemIcon sx={{ marginRight: "-16px" }}>
        <Tooltip title={linkItem.url} placement="left">
          <IconButton href={linkItem.url} target="_blank" rel="noopener" size="small" sx={{ padding: "6px" }} disabled={linkItem.url === "about:blank"}>
            <OpenInNewIcon />
          </IconButton>
        </Tooltip>
      </ListItemIcon>
      )}
    </ListItem>
  );
}
