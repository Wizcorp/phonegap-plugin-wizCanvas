/*
 *   __    __ _                  _     ___
 *  / / /\ \ (_)______ _ _ __ __| |   / __\__ _ _ ____   ____ _ ___
 *  \ \/  \/ / |_  / _` | '__/ _` |  / /  / _` | '_ \ \ / / _` / __|
 *   \  /\  /| |/ / (_| | | | (_| | / /__| (_| | | | \ V / (_| \__ \
 *    \/  \/ |_/___\__,_|_|  \__,_| \____/\__,_|_| |_|\_/ \__,_|___/
 *
 * @author  	Ally Ogilvie
 * @copyright   Wizcorp Inc. [ Incorporated Wizards ] 2013
 * @file        WizCanvasPlugin.java
 * @about       Handle canvas view and communication.
*/
package jp.wizcorp.phonegap.plugin.wizCanvas;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.view.ViewGroup;
import android.webkit.WebResourceResponse;
import android.widget.LinearLayout;
import com.impactjs.ejecta.EjectaActivity;
import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import android.view.View;

import java.io.ByteArrayInputStream;

public class WizCanvasPlugin extends CordovaPlugin {

	private static String TAG = "WizCanvasPlugin";
    private static String viewName = "mainView";
	static JSONObject viewList = new JSONObject();
    static CordovaInterface _cordova;
    static CordovaWebView _webView;

    @Override
    public void initialize(final CordovaInterface cordova, CordovaWebView webView) {
        _cordova = cordova;
        _webView = webView;
        Log.d(TAG, "Initialize Plugin");
        // By default, get a pointer to mainView and add mainView to the viewList as it always exists (hold phonegap's view)
        if (!viewList.has(viewName)) {
            // Cordova view is not in the viewList so add it.
            try {
                viewList.put(viewName, webView);
                Log.d(TAG, "Found CordovaView ****** " + webView);
            } catch (JSONException e) {
                // Error handle (this should never happen!)
                Log.e(TAG, "Critical error. Failed to retrieve Cordova's view");
            }
        }

        IntentFilter intentFilter = new IntentFilter("android.intent.action.MESSAGE");

        BroadcastReceiver mReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                // Extract our message from intent
                String command = intent.getStringExtra("MESSAGE");

                // Check command
                assert command != null;

                if (command.contains("postMessage")) {
                    // Receiving postMessage
                    String targetView = intent.getStringExtra("TARGET");
                    if (targetView.equalsIgnoreCase(viewName)) {
                        // postmessage is for mainView
                        String message = intent.getStringExtra("POSTMESSAGE");
                        String type = intent.getStringExtra("TYPE");
                        String source = intent.getStringExtra("SOURCE");

                        try {
                            final CordovaWebView _targetView = (CordovaWebView) viewList.get(targetView);
                            // __triggerMessageEvent: function(origin, target, data, type) { }
                            final String js = String.format(
                                    "window.wizCanvasMessenger.__triggerMessageEvent('%s', '%s', '%s', '%s');",
                                    source,
                                    targetView,
                                    message,
                                    type);
                            Log.d(TAG, "Sending messsage into: " + targetView);
                            cordova.getActivity().runOnUiThread(
                                    new Runnable() {
                                        @Override
                                        public void run() {
                                            _targetView.sendJavascript(js);
                                        }
                                    }
                            );
                        } catch (JSONException e) {
                            Log.e(TAG, "Could not find target view in viewList");
                        }
                    }
                }
            }
        };

        // Registering our receiver
        cordova.getActivity().registerReceiver(mReceiver, intentFilter);

        super.initialize(cordova, webView);
    }

    @android.annotation.TargetApi(11)
    public WebResourceResponse shouldInterceptRequest(String url) {
        ByteArrayInputStream stream = new ByteArrayInputStream(url.getBytes());
        this.onOverrideUrlLoading(url);
        return new WebResourceResponse("text/plain", "UTF-8", stream);
    }

    @Override
    public boolean onOverrideUrlLoading(String url) {

        Log.d(TAG, "[Override URL] ****** "+ url);

        String[] urlArray;
        String splitter = "://";

        // Split url by only 2 in the event "://" occurs elsewhere (SHOULD be impossible because you string encoded right!?)
        urlArray = url.split(splitter,2);
        if (urlArray[0].equalsIgnoreCase("wizpostmessage") ) {

            String[] msgData;
            splitter = "\\?";

            // Split url by only 2 again to make sure we only spit at the first "?"
            msgData = urlArray[1].split(splitter);

            // Target View is msgData[1] and message is msgData[2]

            // Get WebView list from viewList
            JSONObject viewList = WizCanvasPlugin.getViews();

            if (viewList.has(msgData[1]) ) {
                if (msgData[1].equalsIgnoreCase(viewName)) {
                    // Message for self? ignore...
                    Log.e(TAG, "Ignoring message for self");
                } else {
                    // Send message to canvas
                    String data2send = msgData[2];
                    data2send = data2send.replace("'", "\\'");
                    final String _target = msgData[1];
                    final String _type = msgData[3];
                    final String _data = String.format("%s", data2send);
                    cordova.getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            // Send post message to activity
                            Intent intent = new Intent("android.intent.action.MESSAGE");
                            intent.putExtra("MESSAGE", "postMessage");
                            intent.putExtra("TYPE", _type);
                            intent.putExtra("TARGET", _target);
                            intent.putExtra("DATA", _data);

                            cordova.getActivity().sendBroadcast(intent);
                        }
                    });
                }
            }
            // App will handle this url, don't allow the WebView to change url
            return true;
        }
        return super.onOverrideUrlLoading(url);
    }

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        Log.d(TAG, "[action] ****** " + action );

		if (action.equals("createView")) {
			// Create a new view
			Log.d(TAG, "[createView] ****** " + args.toString() );

			final String canvasName;
			final JSONObject settings;
			try {
				// Get view name
				canvasName = args.getString(0);
                if (args.optJSONObject(1) != null) {
                    settings = args.optJSONObject(1);
                } else {
                    settings = new JSONObject();
                    settings.put("width", cordova.getActivity().getWindowManager().getDefaultDisplay().getWidth());
                    settings.put("height", cordova.getActivity().getWindowManager().getDefaultDisplay().getHeight());
                }
				Log.d(TAG, "Create view with settings : " + settings);
				
			} catch (Exception e) {
				Log.e(TAG, "Exception: " + e);
				callbackContext.error("Cannot create view. Missing view name parameter");
				return true;
			}

            // Create a final link so we can run on UI thread
            Log.d(TAG, "list: " + viewList.names().toString());

            // Create link to callback
            final CallbackContext create_cb = callbackContext;

            cordova.getActivity().runOnUiThread(
                    new Runnable() {
                        @Override
                        public void run() {
                            Intent intent = new Intent(cordova.getActivity(), EjectaActivity.class);
                            try {
                                intent.putExtra("EXTRA_NAME", canvasName);

                                if (settings.has("backgroundColor")) {
                                    intent.putExtra("BACKGROUND_COLOR", settings.getString("backgroundColor"));
                                }
                                if (settings.has("width")) {
                                    intent.putExtra("EXTRA_WIDTH", settings.getInt("width"));
                                }
                                if (settings.has("height")) {
                                    intent.putExtra("EXTRA_HEIGHT", settings.getInt("height"));
                                }
                                if (settings.has("x")) {
                                    intent.putExtra("EXTRA_X", settings.getInt("x"));
                                }
                                if (settings.has("y")) {
                                    intent.putExtra("EXTRA_Y", settings.getInt("y"));
                                }
                                if (settings.has("top")) {
                                    intent.putExtra("EXTRA_TOP", settings.getInt("top"));
                                }
                                if (settings.has("left")) {
                                    intent.putExtra("EXTRA_LEFT", settings.getInt("left"));
                                }
                                if (settings.has("right")) {
                                    intent.putExtra("EXTRA_RIGHT", settings.getInt("right"));
                                }
                                if (settings.has("bottom")) {
                                    intent.putExtra("EXTRA_BOTTOM", settings.getInt("bottom"));
                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }

                            cordova.getActivity().startActivity(intent);
                            // Set no animation on activity
                            cordova.getActivity().overridePendingTransition(0, 0);

                            // Put our new view into viewList
                            try {
                                viewList.put(canvasName, "wizCanvas");
                                updateViewList();

                            } catch (JSONException e) {
                                // Error handle
                                e.printStackTrace();
                            }

                            PluginResult res = new PluginResult(PluginResult.Status.OK);
                            res.setKeepCallback(false);
                            create_cb.sendPluginResult(res);
                        }
                    }
            );

            // Wait for callback
            PluginResult res = new PluginResult(PluginResult.Status.NO_RESULT);
            res.setKeepCallback(true);
            callbackContext.sendPluginResult(res);

            // Clean up
            callbackContext = null;

			return true;

        } else if (action.equals("removeView")) {
            // TODO: Async callback
            // Remove a view from the application
            Log.d(TAG, "[removeView] ****** " + args.toString() );

            final String canvasName;
            try {
                // Get view name
                canvasName = args.getString(0);
            } catch (Exception e) {
                Log.e(TAG, "Cannot remove view. Missing view name parameter");
                callbackContext.error("Cannot remove view. Missing view name parameter");
                return true;
            }

            if (canvasName.equalsIgnoreCase(viewName)) {
                // Cannot remove this view
                callbackContext.error("Cannot remove the view: " + viewName);
                return true;
            }

            // Find WebView by this name and remove it
            if (viewList.has(canvasName) ) {

                cordova.getActivity().runOnUiThread(
                    new Runnable() {
                        @Override
                        public void run() {
                            // Send destroy message to activity
                            Intent intent = new Intent("android.intent.action.MESSAGE");
                            intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
                            intent.putExtra("MESSAGE", "DESTROY");
                            cordova.getActivity().sendBroadcast(intent);
                        }
                    });

                viewList.remove(canvasName);
                updateViewList();

                // Remove is running on a different thread, but for now assume view was removed
                callbackContext.success();
                return true;
            } else {
                // Cannot find view
                Log.e(TAG, "Cannot remove view. " + canvasName + " not found");
                callbackContext.error("Cannot remove view. " + canvasName + " not found");
                return true;
            }

		} else {
            if (action.equals("hideView")) {
                // TODO: Async callback
                // TODO: animations like iOS

                // Hide a particular view...
                Log.d(TAG, "[hideView] ****** " + args.toString());

                final String canvasName;

                // Set defaults for animations
                long animDuration = 500;
                String animType = "none";

                try {
                    canvasName = args.getString(0);
                    // Analyse settings object
                    try {

                        JSONObject settings = (JSONObject) args.get(1);

                        if (settings.has("animation")) {
                            JSONObject animation = settings.getJSONObject("animation");

                            if (animation.has("duration")) {
                                animDuration = (long) animation.getInt("duration");
                            }

                            if (animation.has("type")) {
                                animType = animation.getString("type");
                            }
                        }

                    } catch (Exception e) {
                        // no settings, use default
                    }

                    // Find Canvas view by this name and hide it
                    if (viewList.has(canvasName)) {

                        final long duration = animDuration;
                        final String type = animType;

                        if (canvasName.equals(viewName)) {
                            final CordovaWebView targetView = (CordovaWebView) viewList.get(viewName);

                            cordova.getActivity().runOnUiThread(
                                    new Runnable() {
                                        @Override
                                        public void run() {
                                            if (targetView.getPaddingLeft() == 0) {

                                                targetView.setVisibility(View.INVISIBLE);
                                                targetView.setPadding(999, 0, 0, 0);

                                            } else {
                                                // already hidden, just callback
                                                Log.d(TAG, "[hide - view already invisible]");
                                            }
                                        }
                                    }
                            );
                        } else {
                            // Send message to hide canvas view
                            cordova.getActivity().runOnUiThread(
                                new Runnable() {
                                    @Override
                                    public void run() {
                                        // Send destroy message to activity
                                        Intent intent = new Intent("android.intent.action.MESSAGE");
                                        intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
                                        intent.putExtra("MESSAGE", "HIDE");
                                        intent.putExtra("ANIMATION_TYPE", type);
                                        intent.putExtra("ANIMATION_DURATION", duration);
                                        cordova.getActivity().sendBroadcast(intent);
                                    }
                                });
                        }

                        callbackContext.success();
                        return true;

                    } else {
                        // Error handle
                        callbackContext.error("cannot find view");
                        return true;
                    }

                } catch (JSONException e) {
                    // Error handle
                    callbackContext.error("missing view name parameter");
                    return true;
                }

            } else if (action.equals("showView")) {
                // TODO: Async callback
                // TODO: animations like iOS
                // Show a particular view...
                Log.d(TAG, "[showView] ****** " + args.toString());

                final String canvasName;

                // Set defaults for animations
                long animDuration = 500;
                String animType = "none";

                try {
                    canvasName = args.getString(0);
                    // Analyse settings object
                    try {

                        JSONObject settings = (JSONObject) args.get(1);

                        if (settings.has("animation")) {
                            JSONObject animation = settings.getJSONObject("animation");

                            if (animation.has("duration")) {
                                animDuration = (long) animation.getInt("duration");
                            }

                            if (animation.has("type")) {
                                animType = animation.getString("type");
                            }
                        }

                    } catch (Exception e) {
                        // no settings, use default
                    }

                    // Find canvas view by this name and hide it
                    if (viewList.has(canvasName)) {

                        final long duration = animDuration;
                        final String type = animType;

                        if (canvasName.equals(viewName)) {
                            final CordovaWebView targetView = (CordovaWebView) viewList.get(viewName);

                            cordova.getActivity().runOnUiThread(
                                new Runnable() {
                                    @Override
                                    public void run() {
                                        if (targetView.getPaddingLeft() == 0) {

                                            targetView.setVisibility(View.INVISIBLE);
                                            targetView.setPadding(999, 0, 0, 0);

                                        } else {
                                            // Already hidden, just call back
                                            Log.d(TAG, "[show - view already invisible]");
                                        }
                                    }
                                }
                            );
                        } else {
                            // Send message to show canvas view
                            cordova.getActivity().runOnUiThread(
                                new Runnable() {
                                    @Override
                                    public void run() {
                                        // Send destroy message to activity
                                        Intent intent = new Intent("android.intent.action.MESSAGE");
                                        intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
                                        intent.putExtra("MESSAGE", "SHOW");
                                        intent.putExtra("ANIMATION_TYPE", type);
                                        intent.putExtra("ANIMATION_DURATION", duration);

                                        Intent intent1 = new Intent(cordova.getActivity(), EjectaActivity.class);
                                        intent1.setFlags(Intent.FLAG_ACTIVITY_BROUGHT_TO_FRONT);
                                        cordova.getActivity().startActivity(intent1);
                                        cordova.getActivity().sendBroadcast(intent);

                                    }
                                });
                        }

                        callbackContext.success();
                        return true;

                    } else {
                        // Error handle
                        callbackContext.error("cannot find view");
                        return true;
                    }

                } catch (JSONException e) {
                    // Error handle
                    callbackContext.error("missing view name parameter");
                    return true;
                }

            } else {
                if (action.equals("setLayout")) {

                    try {
                        final String canvasName = args.getString(0);
                        final JSONObject options = args.getJSONObject(1);

                        if (viewName.equals(viewName)) {
                            final CordovaWebView targetView = (CordovaWebView) viewList.get(viewName);

                            cordova.getActivity().runOnUiThread(
                                new Runnable() {
                                    @Override
                                    public void run() {
                                        WizCanvasPlugin.setLayout(targetView, options);
                                    }
                                }
                            );
                        } else {

                            cordova.getActivity().runOnUiThread(
                                new Runnable() {
                                    @Override
                                    public void run() {
                                        // Send destroy message to activity
                                        Intent intent = new Intent("android.intent.action.MESSAGE");
                                        intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
                                        intent.putExtra("MESSAGE", "LAYOUT");
                                        try {
                                            if (options.has("width")) {
                                                intent.putExtra("EXTRA_HEIGHT", options.getInt("width"));
                                            }
                                            if (options.has("height")) {
                                                intent.putExtra("EXTRA_WIDTH", options.getInt("height"));
                                            }
                                            if (options.has("x")) {
                                                intent.putExtra("EXTRA_X", options.getInt("x"));
                                            }
                                            if (options.has("y")) {
                                                intent.putExtra("EXTRA_Y", options.getInt("y"));
                                            }
                                            if (options.has("top")) {
                                                intent.putExtra("EXTRA_TOP", options.getInt("top"));
                                            }
                                            if (options.has("left")) {
                                                intent.putExtra("EXTRA_LEFT", options.getInt("left"));
                                            }
                                            if (options.has("right")) {
                                                intent.putExtra("EXTRA_RIGHT", options.getInt("right"));
                                            }
                                            if (options.has("bottom")) {
                                                intent.putExtra("EXTRA_BOTTOM", options.getInt("bottom"));
                                            }
                                            intent.putExtra("EXTRA_NAME", canvasName);
                                        } catch (JSONException e) {
                                            // Ignore exception
                                        }
                                        cordova.getActivity().sendBroadcast(intent);
                                    }
                                });
                        }

                    } catch (Exception e) {
                        Log.e(TAG, "Error: " + e);
                    }

                    callbackContext.success();

                    return true;

                } else if (action.equals("load")) {
                    Log.d(TAG, "[load] ****** ");

                    String canvasName;
                    try {
                        viewName = args.getString(0);
                    } catch (JSONException e) {
                        Log.e(TAG, "Cannot load into view. Missing view name parameter");
                        callbackContext.error("Cannot load into view. Missing view name parameter");
                        return true;
                    }

                    // Find canvas view by this name and show it
                    if (viewList.has(viewName)) {

                        JSONObject options = args.getJSONObject(1);

                        if (options.has("src")) {
                            final String url = options.getString("src");
                            Log.d(TAG, "[load] url>> " + url);
                            final CallbackContext load_cb = callbackContext;
                            cordova.getActivity().runOnUiThread(
                                new Runnable() {
                                    public void run() {
                                        // Send load message to activity
                                        Intent intent = new Intent("android.intent.action.MESSAGE");
                                        intent.putExtra("MESSAGE", "LOAD");
                                        intent.putExtra("SOURCE", url);
                                        cordova.getActivity().sendBroadcast(intent);
                                        // targetView.load(url, load_cb);
                                    }
                                }
                            );
                        } else {
                            Log.e(TAG, "Cannot load into view. No source to load.");
                            callbackContext.error("Cannot load into view.  No source to load.");
                            return true;
                        }

                        // Wait for callback
                        PluginResult res = new PluginResult(PluginResult.Status.NO_RESULT);
                        res.setKeepCallback(true);
                        callbackContext.sendPluginResult(res);

                        // Clean up
                        callbackContext = null;
                        return true;

                    } else {
                        Log.e(TAG, "Cannot update view. Missing view name parameter");
                        callbackContext.error("Cannot update view. Missing view name parameter");
                        return true;
                    }
                }
            }
        }
		return false;
	}

	public static JSONObject getViews() {
		return viewList;
	}


    public static void updateViewList() {
        CordovaWebView targetView = null;
        String jsString = "";
        try {
            // Build JS execution String form all view names in viewList
            targetView = (CordovaWebView) viewList.get(viewName);
            JSONArray viewListNameArray = viewList.names();
            jsString += "window.wizCanvas.updateViewList(" + viewListNameArray.toString() + "); ";
            Log.d("wizCanvas", "Execute JS: " + jsString);
            Log.d("wizCanvas", "Updated view list");
        } catch (JSONException ex) {
            return;
        }
        final CordovaWebView _targetView = targetView;
        final String _jsString = jsString;

        _cordova.getActivity().runOnUiThread(
            new Runnable() {
                public void run() {
                    if (_targetView != null) {
                        _targetView.loadUrl("javascript:" + _jsString);
                    }
                }
            }
        );

        // Clean up references
        targetView = null;
        jsString = null;
    }

    private static void setLayout(final CordovaWebView webView, JSONObject settings) {

        Log.d(TAG, "Setting up new layout...");
        Log.d(TAG, webView.toString());

        String url;
        // Size
        int _height = webView.getHeight();
        int _width = webView.getWidth();
        // Margins
        int _x = 0;
        int _y = 0;
        int _top = 0;
        int _bottom = 0;

        int _right = 0;
        int _left = 0;

        if (settings.has("src")) {
            try {
                url = settings.getString("src");
                webView.loadUrl(url);
            } catch (JSONException e) {
                // default
                // nothing to load
            }
        }

        if (settings.has("height")) {
            try {
                _height = settings.getInt("height");
            } catch (JSONException e) {
                // default
                _height = ViewGroup.LayoutParams.MATCH_PARENT;
            }
        }

        if (settings.has("width")) {
            try {
                _width = settings.getInt("width");
            } catch (JSONException e) {
                // default
                _width = ViewGroup.LayoutParams.MATCH_PARENT;
            }
        }

        if (settings.has("x")) {
            try {
                _x = settings.getInt("x");
            } catch (JSONException e) {
                // default
                _x = 0;
            }
        }

        if (settings.has("y")) {
            try {
                _y = settings.getInt("y");
            } catch (JSONException e) {
                // default
                _y = 0;
            }
        }

        if (settings.has("left")) {
            try {
                _left = _x + settings.getInt("left");
                _width -= _left;
            } catch (JSONException e) {
                // default
                _left = _x;
            }
        }

        if (settings.has("right")) {
            try {
                _right = settings.getInt("right");
                _width += _right;
            } catch (JSONException e) {
                // default
                _right = 0;
            }
        }

        if (settings.has("top")) {
            try {
                _top = _y + settings.getInt("top");
            } catch (JSONException e) {
                // default
                _top = _y;
            }
        }
        if (settings.has("bottom")) {
            try {
                _bottom = settings.getInt("bottom") - _y;
            } catch (JSONException e) {
                // default
                _bottom = 0 - _y;
            }
        }

        LinearLayout.LayoutParams layoutParams = (LinearLayout.LayoutParams) webView.getLayoutParams();
        Log.d(TAG, layoutParams.toString());
        layoutParams.setMargins(_left, _top, _right, _bottom);
        layoutParams.height = _height;
        layoutParams.width = _width;

        webView.setLayoutParams(layoutParams);

        Log.d(TAG, "new layout -> width: " + layoutParams.width + " - height: " + layoutParams.height + " - margins: " + layoutParams.leftMargin + "," + layoutParams.topMargin + "," + layoutParams.rightMargin + "," + layoutParams.bottomMargin);
    }
}
