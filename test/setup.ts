/**
 * this is missing from jest-environment-jsdom
 */
HTMLCanvasElement.prototype.getContext = () => { 
    return {} as any
}