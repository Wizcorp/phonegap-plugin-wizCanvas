cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "phonegap/plugin/wizCanvas/wizCanvas.js",
        "id": "jp.wizcorp.phonegap.plugin.wizCanvasPlugin",
        "clobbers": [
            "window.wizCanvas"
        ]
    }
]
});