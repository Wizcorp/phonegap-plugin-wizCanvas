# phonegap-plugin-wizCanvas

- PhoneGap Version : 3.0
- last update : 5/11/2013

## Description

PhoneGap plugin for creating and manipulating native canvas without UIWebView for ultra performance.

## Install (with Plugman) 

	cordova plugin add https://github.com/Wizcorp/phonegap-plugin-wizCanvas
	cordova build
	
	< or >
	
	phonegap local plugin add https://github.com/Wizcorp/phonegap-plugin-wizCanvas
	phonegap build

## Booting

wizCanvas looks automatically for an index.js file in ```www/assets/canvas/``` if you wish to ignore this and load from another relative location, use ```wizCanvas.load()```.

### Additional Steps in Xcode

In Xcode Build Settings, add the following 2 lines in the Header Path

	"$(SRCROOT)/<your project name>/Plugins/jp.wizcorp.phonegap.plugin.wizCanvasPlugin/lib"
	"$(SRCROOT)/<your project name>/Plugins/jp.wizcorp.phonegap.plugin.wizCanvasPlugin/lib/JavaScriptCore"

In Xcode Build Settings, add the following 2 lines in the Library Search Path

	"$(SRCROOT)/<your project name>/Plugins/jp.wizcorp.phonegap.plugin.wizCanvasPlugin/lib"
	"$(SRCROOT)/<your project name>/Plugins/jp.wizcorp.phonegap.plugin.wizCanvasPlugin/lib/JavaScriptCore"

In Xcode Build Settings remove `armv7s` from valid architectures.


## APIs

### Create

Currently, only 1 canvas view can be created. View is hidden after creation.

	wizCanvas.create(String viewName, JSONObject options, Function success, Function fail);

Options list;

	{
	    src: "my/local/script.js" [relative to www/]
	    height: 300, [accepts "300px", "30%" - default : fills height] 
	    width: 300, [accepts "300px", "30%" - default : fills width] 
	    x: 0,
	    y: 0, 
	    top: 0, [string, pixels or percent - default : 0]
	    bottom: 0, [string, pixels or percent - default : 0]
	    left: 0, [pixels or percent - default : 0]    
	    right:0, [string, pixels or percent - default : 0]
	    backgroundColor: [Colour as hex RGB/ARGB/RRGGBB or "transparent"]
	}; 

** Note - Android does not yet support String " px" values or " %" values ** 

### Load

	wizCanvas.load(String viewName, String URI or URL, Function success, Function fail);
	
	
### Set Layout
	
	wizCanvas.setLayout(String viewName, JSONObject options, Function success, Function fail);

See `create` API for a list of options.

### Show

	wizCanvas.show(String viewName, JSONObject options, Function success, Function fail);

A list of animations;

- slideInFromLeft
- slideInFromRight
- slideInFromTop
- slideInFromBottom
- fadeIn

Example animation Object;

	options : {
		animation: {
	    	type: "fadeIn", 
	    	duration: "300"
	    }
	};
	
** NOTE : Animation options not yet fully supported! **

### Hide

	wizCanvas.hide(String viewName, JSONObject options, Function success, Function fail);

A list of animations;

- slideOutFromLeft
- slideOutFromRight
- slideOutFromTop
- slideOutFromBottom
- fadeOut

Example animation Object;

	options : {
		animation: {
    		type: "fadeOut",
    		duration: "300"
    	}
	}; 

** NOTE : Animation options not yet fully supported! **

### Messaging

To send a messsage to a view based on W3C post message API... for more information on the MessageEvent API, see: [http://www.w3.org/TR/2008/WD-html5-20080610/comms.HTMLElement](http://www.w3.org/TR/2008/WD-html5-20080610/comms.HTMLElement)

	wizCanvasMessenger.postMessage(Data message, String targetView);

- `message` is Data as Array, String, Number, Object
- `targetView` is the string name of the target view.
- to reach Cordova window, `targetView` = `"mainView"`

Add an event listener in the html that wishes to receive the message...

	window.addEventListener('message', wizMessageReceiver, false);

Example receiver;

	function wizMessageReceiver (e) {
	    // Event data object comes in here
	    // e.data - message data
		// e.origin - the origin of the data
		// e.target - the target for the data
	}
