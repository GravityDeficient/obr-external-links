# OBR External Links

An [Owlbear Rodeo](https://www.owlbear.rodeo/) extension for attaching external links to characters, mounts, and props allowing you to share character sheets, additional documentation, and more with players. Provide quick access to vital information and resources for everyone involved.

![Example](/docs/example.png)

## Installing

Use the following Install Link "https://obr-external-links.gravitydeficient.com/manifest.json"

## How to use it

GM's can right click on an asset (characters, mounts, and props) chaand select "Add External Link" then enter the URL you want to link when prompted.

To see the list of links slect the <img src="https://obr-external-links.gravitydeficient.com/External_link_font_awesome.png" alt="external link" width="24"/> button to expand the entered links.

GM's can remove a link by right clicking on an asset which has a link and selecting "Remove External Link."

## How it Works

This project is a simple [React](https://reactjs.org/) app.

It communicates with Owlbear Rodeo to create context menu items. When those menu items are clicked it edits the metadata of the item with an external links value.

## Building

This project uses [Yarn](https://yarnpkg.com/) as a package manager.

To install all the dependencies run:

`yarn`

To run in a development mode run:

`yarn dev`

To make a production build run:

`yarn build`
