cordova.define("jp.wizcorp.phonegap.plugin.wizCanvasPlugin", function(require, exports, module) {/* WizCanvas for cordova - Create a native canvas view.
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
};


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
		name = list[i];

		if (!this.views[name]) {
			this.views[name] = new View(name);
		}
	}
	
};

// instantiate wizCanvas (passing "mainView" which is Cordova's window)
window.wizCanvas = new WizCanvas('mainView');
module.exports = wizCanvas;

var WizCanvasMessenger = function () {};

WizCanvasMessenger.prototype.postMessage = function (message, targetView) { 
	// for more information on the MessageEvent API, see:
	// http://www.w3.org/TR/2008/WD-html5-20080610/comms.HTMLElement
	
	// wizPostMessage://origin?target?data
	
	// Check message type
    var type;
    if (Object.prototype.toString.call(message) === "[object Array]") {
        type = "Array";
        message = JSON.stringify(message);
    } else if (Object.prototype.toString.call(message) === "[object String]") {
        type = "String";
    } else if (Object.prototype.toString.call(message) === "[object Number]") {
        type = "Number";
        message = JSON.stringify(message);
    } else if (Object.prototype.toString.call(message) === "[object Boolean]") {
        type = "Boolean";
        message = message.toString();
    } else if (Object.prototype.toString.call(message) === "[object Function]") {
        type = "Function";
        message = message.toString();
    } else if (Object.prototype.toString.call(message) === "[object Object]") {
        type = "Object";
        message = JSON.stringify(message);
    } else {
        console.error("WizCanvasMessenger posted unknown type!");
        return;
    }
    
	var iframe = document.createElement('IFRAME');
	iframe.setAttribute('src', 'wizPostMessage://'+ window.encodeURIComponent(window.name) + '?' + window.encodeURIComponent(targetView) + '?' + window.encodeURIComponent(message) + '?' + type );
	// In case of heavy load or multiple views add a setTimeout
	setTimeout(function () {
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
	}, 1);

};
    
WizCanvasMessenger.prototype.__triggerMessageEvent = function (origin, target, data, type) { 
	// Trigger message event
	// Check message type
    if (type === "Array") {
        data = JSON.parse(data);
    } else if (type === "String") {
        // Stringy String String
    } else if (type === "Number") {
        data = JSON.parse(data);
    } else if (type === "Boolean") {
        data = Boolean(data);
    } else if (type === "Function") {
        // W3C says nothing about functions, will be returned as string.
    } else if (type === "Object") {
        data = JSON.parse(data);
    } else {
        console.error("Message Event received unknown type!");
        return;
    }
	
	var event = document.createEvent("HTMLEvents");
	event.initEvent("message", true, true);
	event.eventName = "message";
	event.memo = { };
	event.origin = origin;
	event.source = target;
	event.data = data;
	dispatchEvent(event);
};
	
window.wizCanvasMessenger = new WizCanvasMessenger();});
