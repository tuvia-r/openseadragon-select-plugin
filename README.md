# openseadragon-select-plugin
plugin for openseadragon to allow selecting with the mouse

## installation
```sh
$   npm i openseadragon-select-plugin
```
## Usage
Include openseadragon-select-plugin after OpenSeadragon in your file. 

```js
    import { Viewer } from 'openseadragon';
    import 'openseadragon-select-plugin'

    const viewer = new Viewer({})
```

Then after you create a viewer:

```js
    const selection = viewer.selection(options);
```
the selection object has three methods:

### options
the options is just an object with a callback function who is called once the  selecting is done:

```ts
    interface selectionOptions { 
        onSelection: (rect: Rect, shape: BaseShape) => void 
    }
```

### Selection
the selection object has 3 methods:

```js
    selection.enable();
    selection.disable();
    selection.toggleState();
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

you can add custom shapes by extending the abstract `BaseShape` class

```js
    import { BaseShape } from 'openseadragon-select-plugin';

    class CustomShape extends BaseShape {
        ...
    }
```

you will need to implement these abstract methods/fields:

```ts
class CustomShape extends BaseShape {
    readonly rect: Rect;

    createSvgRect(): Path2D;

    startDrawing(point: Point): void;
    updateDrawing(point: Point): void;
    endDrawing(point?: Point): void;
}
```

### registering a custom shape:
custom shapes need to be registered manually:

```js
    viewer.selectionHandler.drawer.addShapes(...customShapesConstructor)
```

and then you can select them by:

```js
    viewer.selectionHandler.drawer.setDrawerShape(CustomShape.name)
```
    (constructor.name)



## development
```sh
$ npm i
```

## development
```sh
$ npm test
```

## License

Apache 2.0