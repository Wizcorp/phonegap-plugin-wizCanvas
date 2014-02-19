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
import android.widget.LinearLayout;
import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

public class WizCanvasPlugin extends CordovaPlugin {

    private static String TAG = "WizCanvasPlugin";
    private static String mainView = "mainView";
    private WizCanvas canvas;

    static JSONObject viewList = new JSONObject();
    static CordovaInterface _cordova;
    static CordovaWebView _webView;

    @Override
    public void initialize(final CordovaInterface cordova, CordovaWebView webView) {
        _cordova = cordova;
        _webView = webView;
        Log.d(TAG, "Initialize Plugin");
        // By default, get a pointer to mainView and add mainView to the viewList as it always exists (hold phonegap's view)
        if (!viewList.has(mainView)) {
            // Cordova view is not in the viewList so add it.
            try {
                viewList.put(mainView, webView);
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
                String command = intent.getStringExtra("COMMAND");

                // Check command
                if (command != null) {
                    if (command.contains("postMessage")) {
                        Log.d(TAG, "Plugin receiving postMessage");
                        // Receiving postMessage
                        String targetView = intent.getStringExtra("TARGET");
                        if (targetView.equalsIgnoreCase(mainView)) {
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
                                Log.d(TAG, "Sending message into: " + targetView);
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
            }
        };

        // Registering our receiver
        cordova.getActivity().registerReceiver(mReceiver, intentFilter);

        super.initialize(cordova, webView);
    }

    @Override
    public boolean onOverrideUrlLoading(String url) {

        Log.d(TAG, "[Override URL] ****** " + url);

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
                if (msgData[1].equalsIgnoreCase(mainView)) {
                    // Message for self? ignore...
                    Log.e(TAG, "Ignoring message for self");
                } else {
                    // Send message to canvas
                    Log.d(TAG, "sending to canvas...");
                    String data2send = msgData[2];
                    data2send = data2send.replace("'", "\\'");

                    if (canvas != null) {
                        canvas.postMessage(msgData[1], String.format("%s", data2send), msgData[3]);
                    }
                }
                // App will handle this url, don't allow the WebView to change url
                return true;
            }
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
                        canvas = new WizCanvas(canvasName, settings, cordova.getActivity(), create_cb);
                        // Put our new view into viewList
                        try {
                            viewList.put(canvasName, canvas);
                            updateViewList();

                        } catch (JSONException e) {
                            // Error handle
                            e.printStackTrace();
                        }
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

            if (canvasName.equalsIgnoreCase(mainView)) {
                // Cannot remove this view
                callbackContext.error("Cannot remove the view: " + mainView);
                return true;
            }

            // Find WebView by this name and remove it
            if (viewList.has(canvasName) ) {

                cordova.getActivity().runOnUiThread(
                    new Runnable() {
                        @Override
                        public void run() {
                            canvas.destroy();
                        }
                    }
                );

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

                        long duration = animDuration;
                        String type = animType;

                        // Send message to hide canvas view
                        cordova.getActivity().runOnUiThread(
                                new Runnable() {
                                    @Override
                                    public void run() {
                                        canvas.hide(null, null, null);
                                    }
                                });

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

                        long duration = animDuration;
                        String type = animType;

                        // Send message to show canvas view
                        cordova.getActivity().runOnUiThread(
                            new Runnable() {
                                @Override
                                public void run() {
                                    canvas.show(null, null, null);
                                }
                            });

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
                        final JSONObject options = args.getJSONObject(1);

                        cordova.getActivity().runOnUiThread(
                            new Runnable() {
                                @Override
                                public void run() {
                                    canvas.setLayout(options, cordova.getActivity());
                                }
                            }
                        );

                    } catch (Exception e) {
                        Log.e(TAG, "Error: " + e);
                    }

                    callbackContext.success();
                    return true;

                } else if (action.equals("load")) {
                    Log.d(TAG, "[load] ****** ");

                    String canvasName;
                    try {
                        canvasName = args.getString(0);
                    } catch (JSONException e) {
                        Log.e(TAG, "Cannot load into view. Missing view name parameter");
                        callbackContext.error("Cannot load into view. Missing view name parameter");
                        return true;
                    }

                    // Find canvas view by this name and show it
                    if (viewList.has(canvasName)) {

                        JSONObject options = args.getJSONObject(1);

                        if (options.has("src")) {
                            final String url = options.getString("src");
                            Log.d(TAG, "[load] url>> " + url);
                            cordova.getActivity().runOnUiThread(
                                new Runnable() {
                                    public void run() {
                                        canvas.load(cordova.getActivity(), url);
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
            targetView = (CordovaWebView) viewList.get(mainView);
            JSONArray viewListNameArray = viewList.names();
            jsString += "window.wizCanvas.updateViewList(" + viewListNameArray.toString() + "); ";
            Log.d(TAG, "Execute JS: " + jsString);
            Log.d(TAG, "Updated view list");
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
