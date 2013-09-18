/* WizCanvas for cordova - Create a native canvas view.
*
 * @author Ally Ogilvie  
 * @copyright Wizcorp Inc. [ Incorporated Wizards ] 2013
 * @file - wizCanvas.js
 * @about - JavaScript cordova bridge for canvas view management
 *
 *
*/

(function (window) {

	// inheritor helper for each library (copy please)
	function inherits(ctor, superCtor) {
		ctor.prototype = Object.create(superCtor.prototype, {
			constructor: { value: ctor, enumerable: false, writable: true, configurable: true }
		});
	};

	// object stringifier helper
	function propsToString(obj) {
		// stringify all vars
		for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                obj[i] = '' + obj[i];
            }
        }
    }

	// View for Cordova
	function View(name) {
		this.name = name;
	}


	View.create = function (name, options, success, failure) {
		propsToString(options);
        cordova.exec(success, failure, "WizCanvasPlugin", "createView", [name, options]);
	};


	View.prototype.remove = function (success, failure) {
        cordova.exec(success, failure, "WizCanvasPlugin", "removeView", [this.name]);
	};


	View.prototype.show = function (animOptions, success, failure) {
        cordova.exec(success, failure, "WizCanvasPlugin", "showView", [this.name, animOptions]);                      
	};


	View.prototype.hide = function (animOptions, success, failure) {
        cordova.exec(success, failure, "WizCanvasPlugin", "hideView", [this.name, animOptions]);                      
	};


    View.prototype.load = function (source, success, failure) {
        cordova.exec(success, failure, "WizCanvasPlugin", "load", [this.name, { src: source }]);
	};


    View.prototype.setLayout = function (options, success, failure) {
		propsToString(options);
        cordova.exec(success, failure, "WizCanvasPlugin", "setLayout", [this.name, options]);
    };



	// WizCanvas parent class for each library (copy please)
	function WizCanvas(name) {
		this.name = name;
		this.views = {};
	}



	WizCanvas.prototype.throwError = function (cb, error) {
		if (cb) {
			cb(error);
		} else {
			throw error;
		}
	};


	WizCanvas.prototype.create = function (name, options, success, failure) {
		if (!View.create) {
			return this.throwError(failure, new Error('The create API is not implemented, while trying to create: ' + name));
		}

		var views = this.views;
		// wrap around the success callback, so we can return a View instance

		function successWrapper() {
			var view = new View(name);

			views[name] = view;

			if (typeof(success) === 'function') {
				success(view);	
			}
			
		}

		View.create(name, options, successWrapper, failure);
	};


	WizCanvas.prototype.show = function (name, animOptions, success, failure) {
		if (!this.views[name]) {
			return this.throwError(failure, new Error('Show Error with view name: ' + name + '. View does not exist'));
		}
	
		this.views[name].show(animOptions, success, failure);
	};


	WizCanvas.prototype.hide = function (name, animOptions, success, failure) {
		if (!this.views[name]) {
			return this.throwError(failure, new Error('Hide Error with view name: ' + name + '. View does not exist'));
		}
	
		this.views[name].hide(animOptions, success, failure);
	};
 
 	WizCanvas.prototype.setLayout = function (name, animOptions, success, failure) {
		if (!this.views[name]) {
			return this.throwError(failure, new Error('Set Layout Error with view name: ' + name + '. View does not exist'));
		}
	
		this.views[name].setLayout(animOptions, success, failure);
 	};

  	WizCanvas.prototype.load = function (name, source, success, failure) {
		if (!this.views[name]) {
			return this.throwError(failure, new Error('Load Error with view name: ' + name + '. View does not exist'));
		}
	
		this.views[name].load(source, success, failure);
  	};
  	
  	WizCanvas.prototype.remove = function (name, success, failure) {
		if (!this.views[name]) {
			return this.throwError(failure, new Error('Remove Error with view name: ' + name + '. View does not exist'));
		}
	
		this.views[name].remove(success, failure);
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

}(window));
