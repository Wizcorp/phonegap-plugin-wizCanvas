package com.impactjs.ejecta;

import android.content.Context;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.opengl.GLSurfaceView;
import android.os.Build;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;

public class EjectaGLSurfaceView extends GLSurfaceView {
	private static String TAG = "ejecta";
	public EjectaGLSurfaceView(Context context) {
		// TODO Auto-generated constructor stub
		super(context);
	}
	
	EjectaRenderer mRenderer;
	public EjectaGLSurfaceView(Context context, int width, int height, String backgroundColor, Boolean onTop) {
		super(context);
		// Sets OpenGLES 2.0 to be used
        setEGLContextClientVersion(2);

        mRenderer = new EjectaRenderer(context, width, height);
        if (onTop) {
            // To get transparent we must set ZOrderOnTop.
            setZOrderOnTop(true);
            setEGLConfigChooser(8, 8, 8, 8, 16, 0);
            getHolder().setFormat(PixelFormat.RGBA_8888);

            // If backgroundColor is not "transparent" set it
            // Default is white
            if (!backgroundColor.equalsIgnoreCase("transparent")) {
                // Set new background colour
                String hash = backgroundColor.substring(0,1);
                String color = backgroundColor.substring(1);
                if (hash.equalsIgnoreCase("#")) {
                    String a, r, g, b;
                    switch (color.length()) {
                        case 8:
                            // #AARRGGBB
                            setBackgroundColor(Color.parseColor(backgroundColor));
                            int argb8 = Color.parseColor(backgroundColor);
                            float alpha8 = argb8 >>> 24;
                            if (Build.VERSION.SDK_INT >= 11) {
                                // Safe for Honeycomb only
                                setAlpha(alpha8);
                            }
                            break;
                        case 6:
                            // #RRGGBB
                            setBackgroundColor(Color.parseColor(backgroundColor));
                            break;
                        case 4:
                            // #ARGB
                            a = color.substring(0, 1);
                            r = color.substring(1, 2);
                            g = color.substring(2, 3);
                            b = color.substring(3, 4);
                            setBackgroundColor(Color.parseColor("#" + r + r + g + g + b + b));
                            // Set alpha
                            int argb4 = Color.parseColor("#" + a + a + r + r + g + g + b + b);
                            float alpha4 = argb4 >>> 24;
                            if (Build.VERSION.SDK_INT >= 11) {
                                // Safe for Honeycomb only
                                setAlpha(alpha4);
                            }
                            break;
                        case 3:
                            // #RGB
                            r = color.substring(0, 1);
                            g = color.substring(1, 2);
                            b = color.substring(2, 3);
                            setBackgroundColor(Color.parseColor("#" + r + r + g + g + b + b));
                            break;
                        default:
                            // Unknown hex length
                            Log.e(TAG, "Unknown colour hex length");
                    }
                } else {
                    Log.e(TAG, "Unknown colour hex. Forget '#'?");
                    // else invalid colour hex
                }
            }
        } else {
            // We cannot have transparency when onTop is false
            setZOrderOnTop(false);
            // Default GLSurfaceView chooses a EGLConfig that has an RGB_888 pixel
            // format, with at least a 16-bit depth buffer and no stencil

            // Throw a developer warning if transparency has been asked for
            if (backgroundColor.equalsIgnoreCase("transparent")) {
                Log.w(TAG, "GLSurface view cannot be transparent when set ZOrderOnTop is set. This is a limitation of Android's OpenGL implementation.");
            }
        }

        setRenderer(mRenderer);
        super.setOnTouchListener(new OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                switch (motionEvent.getAction() & MotionEvent.ACTION_MASK) {
                    case MotionEvent.ACTION_DOWN:
                        mRenderer.nativeTouch(motionEvent.getAction(), (int)motionEvent.getX(), (int)motionEvent.getY());
                        break;
                    case MotionEvent.ACTION_UP:
                        mRenderer.nativeTouch(motionEvent.getAction(), (int)motionEvent.getX(), (int)motionEvent.getY());
                        break;
                    case MotionEvent.ACTION_MOVE:
                        mRenderer.nativeTouch(motionEvent.getAction(), (int)motionEvent.getX(), (int)motionEvent.getY());
                        break;
                }
                // Get all touches, return true
                return true;
            }
        });
	}
	
	@Override
	public void onResume() {
		// TODO Auto-generated method stub
		mRenderer.nativeResume();
		super.onResume();
	}
	
	@Override
	public void onPause() {
		// TODO Auto-generated method stub
		super.onPause();
		mRenderer.nativePause();
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		// TODO Auto-generated method stub
		mRenderer.nativeOnKeyDown(keyCode);
		return super.onKeyDown(keyCode, event);
	}
	
	@Override
	public boolean onKeyUp(int keyCode, KeyEvent event) {
		// TODO Auto-generated method stub
		mRenderer.nativeOnKeyUp(keyCode);
		return super.onKeyUp(keyCode, event);
	}
	
	@Override
	protected void onConfigurationChanged(Configuration newConfig) {
		// TODO Auto-generated method stub
		
		super.onConfigurationChanged(newConfig);
	}
	
	public void onDestroy() {
		// TODO Auto-generated method stub
		mRenderer.nativeFinalize();
	}

    public void setEjectaEventListener(final EjectaRenderer.EjectaEventListener eventListener) {
        mRenderer.setOnCanvasListener(new EjectaRenderer.EjectaEventListener() {
            @Override
            public void onCanvasCreated() {
                eventListener.onCanvasCreated();
            }

            @Override
            public void onPostMessageReceived(String target, String message, String type, String origin) {
                eventListener.onPostMessageReceived(target, message, type, origin);
            }
        });
    }

    public void loadJavaScriptFile(String filename) {
        mRenderer.nativeLoadJavaScriptFile(filename);
    }

    public void evaluateScript(String script) {
        mRenderer.nativeEvaluateScript(script);
    }

    public void triggerMessage(String message, String type) {
        mRenderer.nativeTriggerMessage(message, type);
    }

	@Override
	protected void onSizeChanged(int w, int h, int oldw, int oldh) {
		// TODO Auto-generated method stub
		super.onSizeChanged(w, h, oldw, oldh);
	}

	private static native void nativeSetPaths();
}
