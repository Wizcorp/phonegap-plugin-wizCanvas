cordova.define("jp.wizcorp.phonegap.plugin.wizCanvasPlugin", function(require, exports, module) {
/* WizCanvas for cordova - Create a native canvas view.
*
 * @author Ally Ogilvie  
 * @copyright Wizcorp Inc. [ Incorporated Wizards ] 2013
 * @file - wizCanvas.js
 * @about - JavaScript cordova bridge for canvas view management
 *
 *
*/

var exec = require("cordova/exec");


function propsToString(obj) {
    // stringify all vars
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            obj[i] = '' + obj[i];
        }
    }
}

var WizCanvas = function (name) {
	this.name = name;
	this.views = {};
};

// View for Cordova
var View = function (name) {
	this.name = name;
}


View.create = function (name, options, success, failure) {
	propsToString(options);
    exec(success, failure, "WizCanvasPlugin", "createView", [name, options]);
};


View.prototype.remove = function (success, failure) {
    exec(success, failure, "WizCanvasPlugin", "removeView", [this.name]);
};


View.prototype.show = function (animOptions, success, failure) {
    exec(success, failure, "WizCanvasPlugin", "showView", [this.name, animOptions]);
};


View.prototype.hide = function (animOptions, success, failure) {
    exec(success, failure, "WizCanvasPlugin", "hideView", [this.name, animOptions]);
};


View.prototype.load = function (source, success, failure) {
    exec(success, failure, "WizCanvasPlugin", "load", [this.name, { src: source }]);
};


View.prototype.setLayout = function (options, success, failure) {
	propsToString(options);
    exec(success, failure, "WizCanvasPlugin", "setLayout", [this.name, options]);
};
    
WizCanvas.prototype.throwError = function (cb, error) {
    if (cb) {
        cb(error);
    } else {
        throw error;
    }
};

WizCanvas.prototype.create = function (name, options, success, failure) {

	var views = this.views;
	// wrap around the success callback, so we can return a View instance
	function successWrapper() {

		var view = new View(name);
		views[name] = view;

		if (typeof(success) === 'function') {
            success(view);
		}

	}
		
    propsToString(options);
    View.create(name, options, successWrapper, failure);
};

WizCanvas.prototype.remove = function (name, success, failure) {
    this.views[name].remove(success, failure);
};

WizCanvas.prototype.show = function (name, animOptions, success, failure) {
    this.views[name].show(animOptions, success, failure);
};

WizCanvas.prototype.hide = function (name, animOptions, success, failure) {
    this.views[name].hide(animOptions, success, failure);
};

WizCanvas.prototype.load = function (name, source, success, failure) {
    this.views[name].load(source, success, failure);
};

WizCanvas.prototype.setLayout = function (name, options, success, failure) {
	propsToString(options);
    this.views[name].setLayout(options, success, failure);
};

WizCanvas.prototype.updateViewList = function (list) {
		
	// check for removed views
	for (var name in this.views) {
		if (list.indexOf(name) === -1) {
			delete this.views[name];
		}
	}

	// check for new views
	for (var i = 0; i < list.length; i++) {
		var name = list[i];

		if (!this.views[name]) {
			this.views[name] = new View(name);
		}
	}
	
};

// instantiate wizCanvas (passing "mainView" which is Cordova's window)
window.wizCanvas = new WizCanvas('mainView');
module.exports = wizCanvas;
});
