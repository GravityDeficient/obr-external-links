import { useEffect, useRef, useState } from "react";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Box from "@mui/material/Box";

import SkipNextRounded from "@mui/icons-material/SkipNextRounded";

import OBR, { isImage, Item, Player } from "@owlbear-rodeo/sdk";

import { LinkItem } from "./LinkItem";

import addIcon from "./assets/add.svg";
import removeIcon from "./assets/remove.svg";

import { LinkListItem } from "./LinkListItem";
import { getPluginId } from "./getPluginId";
import { LinkHeader } from "./LinkHeader";
import { isPlainObject } from "./isPlainObject";

/** Check that the item metadata is in the correct format */
function isMetadata(
  metadata: unknown
): metadata is { url: string; active: boolean } {
  return (
    isPlainObject(metadata) &&
    typeof metadata.url === "string" &&
    typeof metadata.active === "boolean"
  );
}

export function LinkTracker() {
  const [linkItems, setLinkItems] = useState<LinkItem[]>([]);
  const [role, setRole] = useState<"GM" | "PLAYER">("PLAYER");

  useEffect(() => {
    const handlePlayerChange = (player: Player) => {
      setRole(player.role);
    };
    OBR.player.getRole().then(setRole);
    return OBR.player.onChange(handlePlayerChange);
  }, []);

  useEffect(() => {
    const handleItemsChange = async (items: Item[]) => {
      const linkItems: LinkItem[] = [];
      for (const item of items) {
        if (isImage(item)) {
          const metadata = item.metadata[getPluginId("metadata")];
          if (isMetadata(metadata)) {
            linkItems.push({
              id: item.id,
              url: metadata.url,
              name: item.text.plainText || item.name,
              visible: item.visible,
              active: metadata.active
            });
          }
        }
      }
      setLinkItems(linkItems);
    };

    OBR.scene.items.getItems().then(handleItemsChange);
    return OBR.scene.items.onChange(handleItemsChange);
  }, []);

  useEffect(() => {
    OBR.contextMenu.create({
      icons: [
        {
          icon: addIcon,
          label: "Add External Link",
          filter: {
            roles: ['GM'],
            every: [
              { key: "layer", value: "CHARACTER", coordinator: "||" },
              { key: "layer", value: "MOUNT", coordinator: "||" },
              { key: "layer", value: "PROP" },
              { key: "type", value: "IMAGE" },
              { key: ["metadata", getPluginId("metadata")], value: undefined },
            ],
            permissions: ["UPDATE"],
          },
        },
        {
          icon: removeIcon,
          label: "Remove External Link",
          filter: {
            roles: ['GM'],
            every: [
              { key: "layer", value: "CHARACTER", coordinator: "||" },
              { key: "layer", value: "MOUNT", coordinator: "||" },
              { key: "layer", value: "PROP" },
              { key: "type", value: "IMAGE" },
            ],
            permissions: ["UPDATE"],
          },
        },
      ],
      id: getPluginId("menu/toggle"),
      onClick(context) {
        OBR.scene.items.updateItems(context.items, (items) => {
          // Check whether to add the items to external links or remove them
          const addToLinks = items.every(
            (item) => item.metadata[getPluginId("metadata")] === undefined
          );
          
          for (let item of items) {
            if (addToLinks) {
              const url = prompt(`Enter the URL for ${item.name}:`);

              // Ensure URL and title are provided before proceeding
              if (url) {
                OBR.scene.items.updateItems(context.items, (items) => {
                  for (let item of items) {
                    item.metadata[getPluginId("metadata")] = {
                      url: url,
                      active: false, // Set active or any other default properties as needed
                    };
                  }
                });
              }
            } else {
              delete item.metadata[getPluginId("metadata")];
            }
          }
        });
      },
    });
  }, []); 

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current && ResizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          const entry = entries[0];
          // Get the height of the border box
          // In the future you can use `entry.borderBoxSize`
          // however as of this time the property isn't widely supported (iOS)
          const borderHeight = entry.contentRect.bottom + entry.contentRect.top;
          // Set a minimum height of 64px
          const listHeight = Math.max(borderHeight, 64);
          // Set the action height to the list height + the card header height + the divider
          OBR.action.setHeight(listHeight + 64 + 1);
        }
      });
      resizeObserver.observe(listRef.current);
      return () => {
        resizeObserver.disconnect();
        // Reset height when unmounted
        OBR.action.setHeight(129);
      };
    }
  }, []);

  return (
    <Stack height="100vh">
      <LinkHeader
        subtitle={
          linkItems.length === 0 ? "Add a link to start" : undefined
        }
      />
      <Box sx={{ overflowY: "auto" }}>
        <List ref={listRef}>
          {linkItems.map((linkItem) => (
            <LinkListItem
              key={linkItem.id}
              linkItem={linkItem}
              showHidden={role === "GM"}
            />
          ))}
        </List>
      </Box>
    </Stack>
  );
}
