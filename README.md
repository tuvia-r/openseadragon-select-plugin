# openseadragon-select-plugin
plugin for openseadragon image viewer.
this plugin adds the ability to select regions of the image by mouse gestures.

## installation
```sh
$   npm i openseadragon-select-plugin
```

## [Working Demo](https://tuvia-r.github.io/openseadragon-select-plugin/)

## Usage
Include openseadragon-select-plugin after OpenSeadragon in your file. 

```js
    import { Viewer } from 'openseadragon';
    import 'openseadragon-select-plugin'

    const viewer = new Viewer({})
```

Then after you create a viewer you can call the `selection` method from the viewer instance:

```js
    const selection = viewer.selection(options);
```

### options
the options is just an object with a callback function who is called once the  selecting is done:

```ts
    interface ViewerSelectionOptions {
	/**
	 * callback that will be called after the drawing is done.
	 * @param rect bounding box of the selected aria
	 * @param shape the shape object used to draw the selection
	 * @required
	 */
	onSelection: (rect: Rect, shape: BaseShape) => void;
	/**
	 * if set to true, the shape will automatically
	 * be added to the canvas after drawing is finished.
	 * @default false
	 */
	keep: boolean;
}
```

### Selection
the selection object has two methods:

```js
    /*
    * activate drawing mode
    */
    selection.enable();
    /*
    * deactivate drawing mode
    */
    selection.disable();
```

you can also add shapes to be displayed on the image by calling:

```js
    viewer.selectionHandler.addShape(shape)
```

and remove them by:

```js
    viewer.selectionHandler.removeShape(shape)

    // or remove all by:
    viewer.selectionHandler.clear()
```

note: if you want to add shapes without using the `viewer.selection` function, you need to initialize it first by calling `initSelection`:
```js
    viewer.initSelection();
```

## Advanced
you can customize the drawing process by changing the `drawOptions`, or evan add custom shapes to be drawn while selecting instead of default rectangle.

### drawOptions
you can change the drawing options, be setting:

```js
    viewer.selectionHandler.drawer.drawOptions = {...newOptions}
```
defaults to:
```js
    const defaultDrawingOptions = {
        color: 'rgb(200, 0, 0)',
        lineWidth: 2,
        fill: 'rgba(220,220,220,0.2)',
    }
```

### shapes

the default shape is `RectShape` but `PolygonShape`, `BrushShape` `LineShape` and `PointShape` are also available.

other shapes can be activated by:
```js
    viewer.selectionHandler.drawer.setDrawerShape(ShapeNames.name)
```

you can add custom shapes by extending the abstract `BaseShape` class

```js
    import { BaseShape } from 'openseadragon-select-plugin';

    class CustomShape extends BaseShape {
        ...
    }
```

or even create complex shapes by extending the abstract `GroupShape` class:

```ts
    class PolygonShape extends GroupShape<
        LineShape | PointShape
    > {
        get shapes (): BaseShape[] {
            return [];
        }
    }
```

you will need to implement these abstract methods/fields:

```ts
    class CustomShape extends BaseShape {
        readonly boundingBox: Rect;

        /*
        * this is not required in `GroupShape`
        */
        toPath2D(): Path2D;

        startDrawing(point: Point): void;
        updateDrawing(point: Point): void;
        endDrawing(point?: Point): void;
    }
```

once drawing is finished you need to call `this.finishDrawing()`.

### registering a custom shape:
custom shapes need to be registered manually:

```js
    viewer.selectionHandler.drawer.addShapes(ShapeNames.name, customShapesConstructor)
```

and then you can select them by:

```js
    viewer.selectionHandler.drawer.setDrawerShape(ShapeNames.name)
```

## License

Apache 2.0
