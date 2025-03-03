import { useEffect, useRef, useState } from "react";

import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import Box from "@mui/material/Box";

import OBR, { isImage, isText, Item, Player } from "@owlbear-rodeo/sdk";

import { sanitizeUrl } from "@braintree/sanitize-url";

import { LinkItem } from "./LinkItem";

import addIcon from "./assets/add.svg";
import removeIcon from "./assets/remove.svg";
import editIcon from "./assets/edit.svg";
import externalLinkIcon from "../public/External_link_font_awesome.svg";

import { LinkListItem } from "./LinkListItem";
import { getPluginId } from "./getPluginId";
import { LinkHeader } from "./LinkHeader";
import { isPlainObject } from "./isPlainObject";

type SortOrder = "asc" | "desc" | "none"; // Sorting order types

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

  const [sortOrder, setSortOrder] = useState<SortOrder>("none"); // Sorting state

  // State to control whether links open in a modal or a new window
  const [openInModal, setOpenInModal] = useState(false);

  // Function to toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder((prev) => {
      if (prev === "none") return "asc";
      if (prev === "asc") return "desc";
      return "none";
    });
  };

  // Function to sort links based on `sortOrder`
  const sortedLinks = () => {
    if (sortOrder === "none") return linkItems;
    return [...linkItems].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  };

  // Load the player role when the scene is ready
  useEffect(() => {
    const handlePlayerChange = (player: Player) => {
      setRole(player.role);
    };
    OBR.player.getRole().then(setRole);
    return OBR.player.onChange(handlePlayerChange);
  }, []);

  // Load the external links when the scene is ready
  useEffect(() => {
    const handleItemsChange = async (items: Item[]) => {
      const linkItems: LinkItem[] = [];
      for (const item of items) {
        if (isImage(item) || isText(item)) {
          const metadata = item.metadata[getPluginId("metadata")];
          if (isMetadata(metadata)) {
            linkItems.push({
              id: item.id,
              url: metadata.url,
              name: ((item.name === "Text") ? item.text.richText[0].children[0].text : item.text.plainText || item.name),
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

  // Add a context menu item to add or remove the external link
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
              { key: "layer", value: "PROP", coordinator: "||" },
              { key: "layer", value: "MAP", coordinator: "||" },
              { key: "layer", value: "TEXT", coordinator: "||" },
              { key: "layer", value: "NOTE" },
              { key: "type", value: "TEXT", coordinator: "||" },
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
              { key: "layer", value: "PROP", coordinator: "||" },
              { key: "layer", value: "MAP", coordinator: "||" },
              { key: "layer", value: "TEXT", coordinator: "||" },
              { key: "layer", value: "NOTE" },
              { key: "type", value: "TEXT", coordinator: "||" },
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
                const sanitizedUrl = sanitizeUrl(url);
                OBR.scene.items.updateItems(context.items, (items) => {
                  for (let item of items) {
                    item.metadata[getPluginId("metadata")] = {
                      url: sanitizedUrl,
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
 
  // Add a context menu item to edit an existing external link
  useEffect(() => {
    OBR.contextMenu.create({
      icons: [
        {
          icon: editIcon,
          label: "Edit External Link",
          filter: {
            roles: ['GM'],
            every: [
              { key: "layer", value: "CHARACTER", coordinator: "||" },
              { key: "layer", value: "MOUNT", coordinator: "||" },
              { key: "layer", value: "PROP", coordinator: "||" },
              { key: "layer", value: "MAP", coordinator: "||" },
              { key: "layer", value: "TEXT", coordinator: "||" },
              { key: "layer", value: "NOTE" },
              { key: "type", value: "TEXT", coordinator: "||" },
              { key: "type", value: "IMAGE" },
              { key: ["metadata", getPluginId("metadata")], value: undefined, operator: "!=" },
            ],
            permissions: ["UPDATE"],
          }
        }
      ],
      id: getPluginId("edit-link"),
      onClick(context) {
        OBR.scene.items.updateItems(context.items, (items) => {
          // Check whether to add the items to external links or remove them
	        const editLinks = context.items.every(
        	  item => item.metadata[getPluginId("metadata")] !== undefined
       	  );
          
          for (let item of items) {
		        if (editLinks) {
              const currentUrl = (item.metadata[getPluginId("metadata")] as LinkItem)?.url;
              const newUrl = prompt(`Edit the URL for ${item.name}:`, currentUrl);
              if (newUrl && newUrl !== currentUrl) {
                const sanitizedUrl = sanitizeUrl(newUrl);
                (item.metadata[getPluginId("metadata")] as LinkItem).url = sanitizedUrl;
              }
            }
          }
        });
      },
    });
  }, []); 

  useEffect(() => {
    OBR.contextMenu.create({
      icons: [
        {
          icon: externalLinkIcon,
          label: "Open External Link",
          filter: {
            roles: ['GM', 'PLAYER'],
            every: [
              { key: "layer", value: "CHARACTER", coordinator: "||" },
              { key: "layer", value: "MOUNT", coordinator: "||" },
              { key: "layer", value: "PROP", coordinator: "||" },
              { key: "layer", value: "MAP", coordinator: "||" },
              { key: "layer", value: "TEXT", coordinator: "||" },
              { key: "layer", value: "NOTE" },
              { key: "type", value: "TEXT", coordinator: "||" },
              { key: "type", value: "IMAGE" },
              { key: ["metadata", getPluginId("metadata")], value: undefined, operator: "!=" },
            ]
          },
        }
      ],
      id: getPluginId("open-link"),
      onClick(context) {
        console.log("Context menu clicked", context);
        // Fetch the first item's metadata to get the URL
        const item = context.items[0];
        // const metadata = item.metadata[getPluginId("metadata")] as LinkItem;
        const url = (item.metadata[getPluginId("metadata")] as LinkItem)?.url

        console.log("Selected Item:", item);
        console.log("URL:", url);
  
        if (url) {
          console.log("openInModal", openInModal);

          if (openInModal) {
            // Open in modal
            OBR.modal.open({
              id: "external-links-modal",
              url: url,
              height: 800,
              width: 600,
            });
          } else {
            // Open in a new window
            window.open(url, "_blank", "noopener,noreferrer");
          }
        }
      }
    });
  }, [openInModal]);

  const listRef = useRef<HTMLUListElement>(null); // Create a ref to the list element

  // Use a ResizeObserver to set the height of the list
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
          const listHeight = Math.max(borderHeight, 74);
          // Set the action height to the list height + the card header height + the divider
          OBR.action.setHeight(listHeight + 74 + 1);
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

  // Render the list of external links
  return (
    <Stack height="100vh">
      <LinkHeader
        subtitle={
          linkItems.length === 0 ? "Add a link to start" : undefined
        }
        openInModal={openInModal}
        setOpenInModal={setOpenInModal}
        sortOrder={sortOrder}
        toggleSortOrder={toggleSortOrder}
      />
      <Box sx={{ overflowY: "auto" }}>
        <List ref={listRef}>
          {sortedLinks().map((linkItem) => (
            <LinkListItem
              key={linkItem.id}
              linkItem={linkItem}
              showHidden={role === "GM"}
              openInModal={openInModal}
            />
          ))}
        </List>
      </Box>
    </Stack>
  );
}
