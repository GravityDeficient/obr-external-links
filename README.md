# External Links

This is an [Owlbear Rodeo](https://www.owlbear.rodeo/) extension for attaching external links to characters, mounts, and props. It allows you to share character sheets, additional documentation, and more with players. This provides quick access to vital information and resources for everyone involved.

![Example](/docs/example.png)

## Installing

The extension can be installed manually by pasting the manifest URL below in the Add Extension dialog.

```
https://obr-external-links.gravitydeficient.com/manifest.json
```

## How to Use External Links
### Adding External Links (GM Only)
Add external links to assets (characters, mounts, props, maps, notes, and text) by right-clicking the asset, selecting "Add External Link," and entering the URL when prompted.

### Viewing External Links
Click the <img src="https://raw.githubusercontent.com/GravityDeficient/obr-external-links/main/public/External_link_font_awesome.png" alt="external link" width="24"/> External Links button in the extensions toolbar to display all associated links in the External Links pane.

Links on assets which are hidden by the GM are only visible to the GM.

### Link Titles
Link titles are taken from the plain text title or accessibility text of assets with images asset. When adding links to text only it will use the first line if the accessibility text is set to the default "Text" value.

### Link Interaction Modes
Toggle how links open by using the "Modal Switch" in the External Links pane:

- Modal Window: Opens links within Owlbear Rodeo.
- New Window: Opens links in a new browser window.

![modal example](/docs/modal-example.png)

### Editing and Removing External Links

**To edit a link**: Right-click the asset, select "Edit External Link," modify the URL, and confirm.

**To remove a link**: Right-click the asset, choose "Remove External Link," and confirm removal.

## How it Works

This project is a simple [React](https://reactjs.org/) app.

It communicates with Owlbear Rodeo to create context menu items. When those menu items are clicked, their metadata is edited with an external link value.

## Building

This project uses [Yarn](https://yarnpkg.com/) as a package manager.

To install all the dependencies, run:

`yarn`

To run in a development mode run:

`yarn dev`

To make a production build run:

`yarn build`
