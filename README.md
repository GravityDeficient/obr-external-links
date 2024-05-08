# OBR External Links

This is an [Owlbear Rodeo](https://www.owlbear.rodeo/) extension for attaching external links to characters, mounts, and props. It allows you to share character sheets, additional documentation, and more with players. This provides quick access to vital information and resources for everyone involved.

![Example](/docs/example.png)

## Installing

The extension can be installed manually by pasting the manifest URL below in the Add Extension dialog.

```
https://obr-external-links.gravitydeficient.com/manifest.json
```

## How to use it

GMs can right-click on an asset (characters, mounts, and props) and select "Add External Link." When prompted, they can enter the URL they want to link to.

To see the list of links, select the <img src="https://raw.githubusercontent.com/GravityDeficient/obr-external-links/main/public/External_link_font_awesome.png" alt="external link" width="24"/> button to expand the entered links.

GMs can remove a link by right-clicking on an asset with a link you want to remove and selecting "Remove External Link."

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
