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
```
npm install
```
```
npm run dev
```
 or accesss the hosted site: [Shape Viewer](https://cmsalmon.github.io/shape-viewer/) 

## Input Files
Files to test Shape Viewer can be found in the "shapefiles" folder.
 - [Completely valid files] contains files with only valid shape data
 - [Files with error] contains files that have either incorrect data format or invalid files that triggers a error modal.

 Data Format: 
  - Rectangles should have the following data format:
```
 Rectangle, 0, 0, 1, 50, 50, ff0000
```
    where:
     - "Rectangle" is the shape
     - (0, 0) is the x, y coordinates
     - 1 is the z - index
     - 50 is the width
     - 50 is the height
     - "ff0000" is the shape's color code

 - Triangles should have the following data format:
```
Triangle, 30, 40, 3, 30, 90, 20, 20, 10, 10, 9a0f9d
```
    where:
     - "Triangle" is the shape
     - (30, 40) is the x, y coordinates
     - 3 is the z - index
     - (30, 90), (20, 20), (10, 10) are the triangle's vertices
     - "9a0f9d" is the shape's color code

 - Polygons should have the following data format:
```
Polygon, 600, 70, 4, 50, 50, 100, 100, 100, 150, 200, 250, 70, 300, 55, 150, 4172db
```
    where:
     - "Polygon" is the shape
     - (600, 70) is the x, y coordinates
     - 4 is the z - index
     - (50, 50), (100, 100), (100, 150), (200, 250), (70, 300), (55, 150) are the polygon's vertices
     - "4172db" is the shape's color code
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
 