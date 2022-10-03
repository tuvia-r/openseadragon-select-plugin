/* eslint-disable @typescript-eslint/no-var-requires */
(function () {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	var require = window.require || function () {};
	var osd =
		window.OpenSeadragon || require('openseadragon');
	var plugin =
		window.OsdSelectionPlugin || require('./selection');
	if (!osd) {
		throw new Error('OpenSeadragon is missing.');
	}
	if (!plugin) {
		throw new Error('OsdSelectionPlugin in missing');
	}
	osd.Viewer.prototype.selection = plugin.selection;
	osd.Viewer.prototype.initSelection =
		plugin.initSelection;
})();
