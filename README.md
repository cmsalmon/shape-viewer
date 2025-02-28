# Shape Viewer

## Table of Contents

- [Overview](#overview)
- [Running Shape Viewer](#running-shape-viewer)
- [Input Files](#input-files)
- [Iterations](#iterations)
- [Bonus and Extras](#bonus-and-extras)
- [Known Problems](#known-problems)

## Overview

Shape Viewer displays valid shapes rendered from uploaded shapefiles that contains shape data.
Shapes that contain incorrect format or invalid data points will be skipped over, but all other valid shapes will be rendered. Data that got skipped over will be listed in the error modal so the user can check what went wrong.

## Running Shape Viewer
Shape Viewer requires: 
 - Node: 22.14.0

Open Shape-Viewer folder in an IDE.

 Run:
  - npm install
  - npm run dev

 or accesss the hosted site: [Shape Viewer](https://cmsalmon.github.io/shape-viewer/) 

## Input Files
Files to test Shape Viewer can be found in the "shapefiles" folder.
 - [Completely valid files] contains files with only valid shape data
 - [Files with error] contains files that have either incorrect data format or invalid files that triggers a error modal.

## Iterations
 - Iteration 1: User Interface Layout
 - Iteration 2: Shape File
 - Iteration 3: Shape Rendering
 - Iteration 4: Polygon Support
 - Iteration 5: UI Enhancement

 are all completed.

## Bonus and Extras
 - Bonus Feature 1: Shape Translation
    - Shape translation has been implemented but save option has not.
 - Error Modal: When an invalid file is uploaded, or file has invalid shape data, an error modal will pop up and tell users what went wrong.

## Known Problems
 - Checks to ensure polygons do not have vertices that go over its own edges were not implemented, allowing possible renders of invalid polgons.
 