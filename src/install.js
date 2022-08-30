(function () {
    var osd = window.OpenSeadragon;
    var plugin = require('./selection');
    if (!osd) {
        osd = require('openseadragon');
        if (!osd) {
            throw new Error('OpenSeadragon is missing.');
        }
    }
    osd.Viewer.prototype.selection = plugin.selection;
    osd.Viewer.prototype.initSelection = plugin.initSelection;
})()