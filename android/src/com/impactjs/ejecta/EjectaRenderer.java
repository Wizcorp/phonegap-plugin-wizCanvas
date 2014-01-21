package com.impactjs.ejecta;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

import android.content.Context;
import android.opengl.GLSurfaceView.Renderer;

public class EjectaRenderer implements Renderer {
	
    public static String mainBundle;
    private int screen_width;
    private int screen_height;
    private EjectaEventListener ejectaEventListener = null;

    public EjectaRenderer(Context ctx, int width, int height) {
        mainBundle = "/data/data/" + ctx.getPackageName();
        // Copy app files
        Utils.copyDatFiles(ctx, mainBundle + "/cache/", "www");

        screen_width = width;
        screen_height = height;
	}

	@Override
	public void onDrawFrame(GL10 gl) {
        nativeRender();
	}

	@Override
	public void onSurfaceChanged(GL10 gl, int width, int height) {
        nativeChanged(width, height);
        screen_width = width;
        screen_height = height;
	}

	@Override
	public void onSurfaceCreated(GL10 gl, EGLConfig config) {
		nativeCreated(mainBundle, screen_width, screen_height);
        onCanvasCreated();
	}

	private native void nativeRender();

	private native void nativeCreated(String mainBundle, int width, int height);
	
	private native void nativeChanged(int width, int height);
	
	public native void nativeFinalize();
    
	public native void nativePause();
	public native void nativeResume();

    public native void nativeLoadJavaScriptFile(String filename);
    public native void nativeEvaluateScript(String script);
    public native void nativeTriggerMessage(String message, String type);

	public native void nativeTouch(int action, int x, int y);
	public native void nativeOnSensorChanged(float accle_x, float accle_y, float accle_z);
	public native void nativeOnKeyDown(int key_code);
	public native void nativeOnKeyUp(int key_code);

    // Emit event. Ejecta surface was created and init() has been called in JNI
    private void onCanvasCreated() {
        if (ejectaEventListener != null) {
            // Trigger event
            ejectaEventListener.onCanvasCreated();
        }
    };

    private void onPostMessageReceived(String target, String message, String type, String origin) {
        if (ejectaEventListener != null) {
            // Trigger event
            ejectaEventListener.onPostMessageReceived(target, message, type, origin);
        }
    };

    // Set listener public interface
    public void setOnCanvasListener(EjectaEventListener listener) {
        ejectaEventListener = listener;
    }

    public interface EjectaEventListener {
        public abstract void onCanvasCreated();
        public abstract void onPostMessageReceived(String target, String message, String type, String origin);
    }
}