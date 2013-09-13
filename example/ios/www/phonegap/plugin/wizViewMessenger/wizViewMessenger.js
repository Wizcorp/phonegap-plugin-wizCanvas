/* WizViewMessenger for cordova - view message handler.
 *
 * @author Chris Wynn & Ally Ogilvie
 * @copyright Wizcorp Inc. [ Incorporated Wizards ] 2013
 * @file - wizViewMessenger.js
 * @about - JavaScript helper for wizViewManager & wizCanvas communications
 *
 *
 */

var wizViewMessenger = {

	message: function(targetView, msg) { 
		//
		// Deprecated! Use postMessage event system
		//
		console.warn("wizViewMessenger.message is deprecated. Use postMessage instead.");
		var iframe = document.createElement('IFRAME');
		iframe.setAttribute('src', 'wizMessageView://'+ window.encodeURIComponent(targetView)+ '?'+ window.encodeURIComponent(msg) );
		document.documentElement.appendChild(iframe);
		iframe.parentNode.removeChild(iframe);
		iframe = null;
    },
    
    postMessage: function(msg, targetView) { 
    	// wizPostMessage://origin?target?data
    	var iframe = document.createElement('IFRAME');
		iframe.setAttribute('src', 'wizPostMessage://'+ window.encodeURIComponent(window.name) + '?' + window.encodeURIComponent(targetView) + '?' + window.encodeURIComponent(msg) );
		document.documentElement.appendChild(iframe);
		iframe.parentNode.removeChild(iframe);
		iframe = null;		
    },
    
    __triggerMessageEvent: function(origin, target, data) { 
    	// Trigger message event	
    	
		var event = document.createEvent("HTMLEvents");
    	event.initEvent("message", true, true);
    	event.eventName = "message";
    	event.memo = { };
    	event.origin = origin;
    	event.source = target;
    	event.data = data;
    	dispatchEvent(event);
    }
	
};

