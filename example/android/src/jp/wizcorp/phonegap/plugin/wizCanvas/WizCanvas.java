/*
 *   __    __ _                  _     ___
 *  / / /\ \ (_)______ _ _ __ __| |   / __\__ _ _ ____   ____ _ ___
 *  \ \/  \/ / |_  / _` | '__/ _` |  / /  / _` | '_ \ \ / / _` / __|
 *   \  /\  /| |/ / (_| | | | (_| | / /__| (_| | | | \ V / (_| \__ \
 *    \/  \/ |_/___\__,_|_|  \__,_| \____/\__,_|_| |_|\_/ \__,_|___/
 *
 * @author  	Ally Ogilvie
 * @copyright   Wizcorp Inc. [ Incorporated Wizards ] 2013
 * @file        WizCanvas.java
 * @about       Handle canvas view and communication.
*/
package jp.wizcorp.phonegap.plugin.wizCanvas;

import android.app.Activity;
import android.content.Intent;
import android.opengl.GLSurfaceView;
import android.os.AsyncTask;
import android.util.Base64;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import com.impactjs.ejecta.EjectaGLSurfaceView;
import com.impactjs.ejecta.EjectaRenderer;
import com.impactjs.ejecta.Utils;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.entity.BufferedHttpEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.zip.GZIPInputStream;

@SuppressLint("SetJavaScriptEnabled")
public class WizCanvas extends View {

    private String TAG = "WizCanvas";
    private GLSurfaceView mGLView;
    static final FrameLayout.LayoutParams COVER_SCREEN_GRAVITY_CENTER =
            new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    Gravity.CENTER);

    static {
        //System.loadLibrary("corefoundation");
        System.loadLibrary("JavaScriptCore");
        System.loadLibrary("ejecta");
    }

    public WizCanvas(String viewName, JSONObject settings, Activity act, CallbackContext callbackContext) {
        // Constructor method
        super(act);

        Log.d(TAG, " *************************************");
        Log.d(TAG, " building - new Wizard View");
        Log.d(TAG, " -> " + viewName);
        Log.d(TAG, " *************************************");

        int screenWidth = act.getWindowManager().getDefaultDisplay().getWidth();
        int screenHeight = act.getWindowManager().getDefaultDisplay().getHeight();

        int width = screenWidth;
        int height = screenHeight;
        String backgroundColor = "#fff";
        Boolean onTop = true;
        String source = null;

        // Get extra layout (optional) settings
        try {
            if (settings.has("width")) {
                width = settings.getInt("width");
            }
            if (settings.has("height")) {
                height = settings.getInt("height");
            }
            if (settings.has("backgroundColor")) {
                backgroundColor = settings.getString("backgroundColor");
            }
            if (settings.has("onTop")) {
                onTop = settings.getBoolean("onTop");
            }
            if (settings.has("src")) {
                source = settings.getString("src");
                // Remove source from settings as it will be loaded
                // in onCanvasCreated() after loading ejecta.js
                // Otherwise setLayout will try to load source for
                // a second time
                settings.remove("src");
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        // Set invisible by default, developer MUST call show to see the view
        this.setVisibility(View.INVISIBLE);

        final String _source = source;
        final String _viewName = viewName;
        final Activity _act = act;
        final CallbackContext _callbackContext = callbackContext;

        mGLView = new EjectaGLSurfaceView(act, width, height, backgroundColor, onTop);
        ((EjectaGLSurfaceView)mGLView).setEjectaEventListener(new EjectaRenderer.EjectaEventListener() {
            @Override
            public void onCanvasCreated() {
                Log.d(TAG, "Canvas created");

                // Evaluate script
                ((EjectaGLSurfaceView) mGLView).loadJavaScriptFile("ejecta.js");
                String js = "var wizCanvasMessenger = null; " +
                        "window.document._eventInitializers.message = function () {" +
                        "if (!wizCanvasMessenger) {" +
                        "wizCanvasMessenger = new Ejecta.WizCanvasMessenger('" + _viewName + "');" +
                        "wizCanvasMessenger.onmessage = function (origin, target, data, type) {" +
                        "origin = decodeURIComponent(origin);" +
                        "target = decodeURIComponent(target);" +
                        "data = decodeURIComponent(data);" +
                        "if (type === 'Array') {" +
                        "data = JSON.parse(data);" +
                        "} else if (type === 'String') {" +
                        "/* Nothing to see here */" +
                        "} else if (type === 'Number') {" +
                        "data = JSON.parse(data);" +
                        "} else if (type === 'Boolean') {" +
                        "data = Boolean(data);" +
                        "} else if (type === 'Function') {" +
                        "/* W3C says nothing about functions, will be returned as string. */" +
                        "} else if (type === 'Object') {" +
                        "data = JSON.parse(data);" +
                        "} else {" +
                        "console.error('Message Event received unknown type!');" +
                        "return;" +
                        "}" +
                        "var ev = {};" +
                        "ev.eventName = 'message';" +
                        "ev.origin = origin;" +
                        "ev.target = target;" +
                        "ev.data = data;" +
                        "ev.memo = {};" +
                        // "console.log('ev:' + ev.data );" +
                        "document._publishEvent('message', ev);" +
                        "};" +
                        "}" +
                        "};";
                ((EjectaGLSurfaceView) mGLView).evaluateScript(js);
                if(_source != null) {
                    ((EjectaGLSurfaceView) mGLView).loadJavaScriptFile(_source);
                } else {
                    ((EjectaGLSurfaceView) mGLView).loadJavaScriptFile("index.js");
                }
                // Callback success now
                PluginResult result = new PluginResult(PluginResult.Status.OK);
                _callbackContext.sendPluginResult(result);
            }

            @Override
            public void onPostMessageReceived(String target, String message, String type, String source) {
                Log.d(TAG, "To: " + target);
                Log.d(TAG, "Type: " + type);
                Log.d(TAG, "Message: " + message);
                Log.d(TAG, "From: " + source);

                // Send message to Cordova Plugin
                Intent i = new Intent("android.intent.action.MESSAGE");
                i.putExtra("COMMAND", "postMessage");
                i.putExtra("TARGET", target);
                i.putExtra("TYPE", type);
                i.putExtra("POSTMESSAGE", message);
                i.putExtra("SOURCE", source);
                _act.sendBroadcast(i);
            }
        });

        ViewGroup frame = (ViewGroup) act.findViewById(android.R.id.content);

        // Creating a new RelativeLayout fill its parent by default
        RelativeLayout.LayoutParams rlp = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.WRAP_CONTENT,
                RelativeLayout.LayoutParams.WRAP_CONTENT);

        // Default full screen
        frame.addView(mGLView, rlp);

        // Analyse settings object
        if (settings != null) {
            setLayout(settings, act);
        } else {
            // Apply Defaults
            mGLView.setLayoutParams(COVER_SCREEN_GRAVITY_CENTER);
        }

    } // ************ END CONSTRUCTOR **************

    public void load(Activity act, String source) {
        // Check remote or local source
        try {
            URL u = new URL(source);    // Check for the protocol
            u.toURI();                  // Extra checking required for validation of URI

            // If we did not fall out here then source is a valid URI
            Log.d(TAG, "load URL: " + source);

            // Download URL source to data/data/<package_name>/filename then call load()
            // again with local path
            new asyncDownload(u, act).execute();

        } catch (MalformedURLException ex1) {
            // Missing protocol

            // Copies the file to data/data/<package_name>/filename
            // Allows the file to be readable from Ejecta-X
            String mainBundle = "/data/data/" + act.getPackageName();
            new Utils().copyDatFile(act, mainBundle + "/cache/", source);

            File f = new File("file:///android_asset/" + source);

            ((EjectaGLSurfaceView)mGLView).loadJavaScriptFile(f.getName());

            f = null;

        } catch (URISyntaxException ex2) {

            // Copies the file to data/data/<package_name>/filename
            // Allows the file to be readable from Ejecta-X
            String mainBundle = "/data/data/" + act.getPackageName();
            new Utils().copyDatFile(act, mainBundle + "/cache/", source);

            File f = new File("file:///android_asset/" + source);

            ((EjectaGLSurfaceView)mGLView).loadJavaScriptFile(f.getName());

            f = null;
        }
    }

    public void hide(Activity act, String type, Long duration) {
        setVisibility(View.INVISIBLE);
        FrameLayout.LayoutParams newLayoutParams = (FrameLayout.LayoutParams) mGLView.getLayoutParams();
        newLayoutParams.leftMargin = 99999;

        mGLView.setLayoutParams(newLayoutParams);
    }

    public void show(Activity act, String type, Long duration) {
        setVisibility(View.VISIBLE);
        FrameLayout.LayoutParams newLayoutParams = (FrameLayout.LayoutParams) mGLView.getLayoutParams();
        newLayoutParams.leftMargin = 0;

        mGLView.setLayoutParams(newLayoutParams);
    }

    public void setLayout(JSONObject settings, Activity act) {
        Log.d(TAG, "Setting up layout...");

        String url;

        // Set default settings to max screen
        ViewGroup parent = (ViewGroup) mGLView.getParent();

        // Size
        int _parentHeight = parent.getHeight();
        int _parentWidth = parent.getWidth();
        int _height = _parentHeight;
        int _width = _parentWidth;

        // Margins
        int _x = 0;
        int _y = 0;
        int _top = 0;
        int _bottom = 0;
        int _right = 0;
        int _left = 0;

        if (settings.has("height")) {
            try {
                _height = settings.getInt("height");
            } catch (JSONException e) {
                // ignore
                Log.e(TAG, "Error obtaining 'height' in settings");
            }
        }

        if (settings.has("width")) {
            try {
                _width = settings.getInt("width");
            } catch (JSONException e) {
                // ignore
                Log.e(TAG, "Error obtaining 'width' in settings");
            }
        }

        if (settings.has("x")) {
            try {
                _x = settings.getInt("x");
                _left = _x;
                _width = _width + _x;
            } catch (JSONException e) {
                // ignore
                Log.e(TAG, "Error obtaining 'x' in settings");
            }
        }

        if (settings.has("y")) {
            try {
                _y = settings.getInt("y");
                _top = _y;
                _height = _height + _y;
            } catch (JSONException e) {
                // ignore
                Log.e(TAG, "Error obtaining 'y' in settings");
            }
        }

        if (settings.has("left")) {
            try {
                _left = _left + settings.getInt("left");
                _width -= _left;
            } catch (JSONException e) {
                // ignore
                Log.e(TAG, "Error obtaining 'left' in settings");
            }
        } else {
            // default
            if (_x != 0) {
                _left = _x;
            }
        }

        if (settings.has("right")) {
            try {
                _right = settings.getInt("right");
                _width = _width - _right;
            } catch (JSONException e) {
                // ignore
                Log.e(TAG, "Error obtaining 'right' in settings");
            }
        }

        if (settings.has("top")) {
            try {
                _top = _top + settings.getInt("top");
            } catch (JSONException e) {
                // ignore
                Log.e(TAG, "Error obtaining 'top' in settings");
            }
        } else {
            // default
            if (_y != 0) {
                _top = _y;
            }
        }

        if (settings.has("bottom")) {
            try {
                _top = _top + _parentHeight - _height - settings.getInt("bottom");
                _bottom = - settings.getInt("bottom");
            } catch (JSONException e) {
                // ignore
                Log.e(TAG, "Error obtaining 'bottom' in settings");
            }
        }

        FrameLayout.LayoutParams newLayoutParams = (FrameLayout.LayoutParams) mGLView.getLayoutParams();
        newLayoutParams.setMargins(_left, _top, _right, _bottom);
        newLayoutParams.height = _height;
        newLayoutParams.width = _width;

        mGLView.setLayoutParams(newLayoutParams);

        Log.d(TAG, "new layout -> width: " + newLayoutParams.width + " - height: " + newLayoutParams.height + " - margins: " + newLayoutParams.leftMargin + "," + newLayoutParams.topMargin + "," + newLayoutParams.rightMargin + "," + newLayoutParams.bottomMargin);

        if (settings.has("src")) {
            try {
                url = settings.getString("src");
                load(act, url);
            } catch (JSONException e) {
                // default
                // nothing to load
                Log.e(TAG, "Loading source from settings exception : " + e);
            }
        } else {
            Log.d(TAG, "No source to load");
        }
    }

    public void postMessage(String targetView, String data, String type) {
        // Send data into canvas
        Log.d(TAG, "[postMessage] to -> " + targetView + " with data -> " + data );
        ((EjectaGLSurfaceView)mGLView).triggerMessage(data, type);
    }

    public void destroy() {
        ((ViewGroup) mGLView.getParent()).removeView(mGLView);
        ((EjectaGLSurfaceView)mGLView).onDestroy();
    }

    private class asyncDownload extends AsyncTask<File, String , String> {

        private URL url;
        private Activity activity;

        // Constructor
        public asyncDownload(URL url, Activity activity) {
            // Assign class vars
            this.url = url;
            this.activity = activity;
        }

        @Override
        protected String doInBackground(File... params) {
            // Run async download task
            String filename;
            try {
                filename = new File(this.url.toURI().getPath()).getName();

            } catch (URISyntaxException e) {
                Log.e(TAG, "URL ERROR");
                return "";
            }

            File file = new File("/data/data/" + this.activity.getPackageName() + "/cache/" + filename);
            if (!file.exists()) {
                // Create the directory if not existing
                file.mkdirs();
            }

            Log.d(TAG, "[downloadUrl] *********** /data/data/" + this.activity.getPackageName() + "/cache/" + filename + " > " + file.getAbsolutePath());

            try {
                URL url = this.url;
                HttpGet httpRequest = null;
                httpRequest = new HttpGet(url.toURI());

                HttpClient httpclient = new DefaultHttpClient();

                // Credential check
                String credentials = url.getUserInfo();
                if (credentials != null) {
                    // Add Basic Authentication header
                    httpRequest.setHeader("Authorization", "Basic " + Base64.encodeToString(credentials.getBytes(), Base64.NO_WRAP));
                }

                HttpResponse response = httpclient.execute(httpRequest);
                HttpEntity entity = response.getEntity();

                InputStream is;

                Header contentHeader = entity.getContentEncoding();
                if (contentHeader != null) {
                    if (contentHeader.getValue().contains("gzip")) {
                        Log.d(TAG, "GGGGGGGGGZIIIIIPPPPPED!");
                        is = new GZIPInputStream(entity.getContent());
                    } else {
                        BufferedHttpEntity bufHttpEntity = new BufferedHttpEntity(entity);
                        is = bufHttpEntity.getContent();
                    }
                } else {
                    BufferedHttpEntity bufHttpEntity = new BufferedHttpEntity(entity);
                    is = bufHttpEntity.getContent();
                }
                byte[] buffer = new byte[1024];

                int len1 = 0;

                FileOutputStream fos = new FileOutputStream(file);

                while ( (len1 = is.read(buffer)) > 0 ) {
                    fos.write(buffer,0, len1);
                }

                fos.close();
                is.close();

                // Tell Ejecta-X to load file from downloaded path
                load(activity, filename);

            } catch (MalformedURLException e) {
                Log.e(TAG, "Bad url : ", e);
            } catch (Exception e) {
                Log.e(TAG, "Error : " + e);
            }
            return null;
        }
    }
}