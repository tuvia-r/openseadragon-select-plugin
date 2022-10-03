/* eslint-disable @typescript-eslint/no-var-requires */
(function () {
	var osd = window.OpenSeadragon;
	var plugin = window.OsdSelectionPlugin;
	if (!osd) {
		osd = require('openseadragon');
		if (!osd) {
			throw new Error('OpenSeadragon is missing.');
		}
	}
	if (!plugin) {
		plugin = require('./selection');
		if (!plugin) {
			throw new Error(
				'OsdSelectionPlugin in missing',
			);
		}
	}
	osd.Viewer.prototype.selection = plugin.selection;
	osd.Viewer.prototype.initSelection =
		plugin.initSelection;
})();
