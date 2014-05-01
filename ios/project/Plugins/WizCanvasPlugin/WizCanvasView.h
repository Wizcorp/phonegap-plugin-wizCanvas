/* WizCanvasView - Setup and deploy an Ejecta canvas.
 *
 * @author WizCorp Inc. [ Incorporated Wizards ] 
 * @copyright 2013
 * @file WizCanvasView.h for PhoneGap
 *
 */ 

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>


#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>
#import <JavaScriptCore/JavaScriptCore.h>
#import "EJConvert.h"
#import "EJCanvasContext.h"
#import "EJPresentable.h"

#import "EJSharedOpenALManager.h"
#import "EJSharedTextureCache.h"
#import "EJSharedOpenGLContext.h"
#import "EJNonRetainingProxy.h"

#define EJECTA_VERSION @"1.4"
#define EJECTA_APP_FOLDER @"www/"

#define EJECTA_BOOT_JS @"phonegap/plugin/wizCanvas/ejecta.js"

@protocol EJTouchDelegate
- (void)triggerEvent:(NSString *)name all:(NSSet *)all changed:(NSSet *)changed remaining:(NSSet *)remaining;
@end

@protocol EJDeviceMotionDelegate
- (void)triggerDeviceMotionEvents;
@end

@protocol EJWindowEventsDelegate
- (void)resume;
- (void)pause;
- (void)resize;
@end

@class EJTimerCollection;
@class EJClassLoader;

@interface WizCanvasView : UIView {
    CGSize oldSize;
    NSString *appFolder;

    BOOL landscapeMode;
    BOOL pauseOnEnterBackground;
    BOOL hasScreenCanvas;

    BOOL isPaused;

    EJNonRetainingProxy	*proxy;

    JSGlobalContextRef jsGlobalContext;
    EJClassLoader *classLoader;

    EJTimerCollection *timers;

    EJSharedOpenGLContext *openGLContext;
    EJSharedTextureCache *textureCache;
    EJSharedOpenALManager *openALManager;

    EJCanvasContext *currentRenderingContext;
    EAGLContext *glCurrentContext;

    CADisplayLink *displayLink;

    NSObject<EJWindowEventsDelegate> *windowEventsDelegate;
    NSObject<EJTouchDelegate> *touchDelegate;
    NSObject<EJDeviceMotionDelegate> *deviceMotionDelegate;
    EJCanvasContext<EJPresentable> *screenRenderingContext;

    NSOperationQueue *backgroundQueue;
    JSClassRef jsBlockFunctionClass;

    // Public for fast access in bound functions
    @public JSValueRef jsUndefined;
}

@property (nonatomic, copy) NSString *appFolder;

@property (nonatomic, assign) BOOL pauseOnEnterBackground;
@property (nonatomic, assign, getter = isPaused) BOOL isPaused; // Pauses drawing/updating of the JSView
@property (nonatomic, assign) BOOL hasScreenCanvas;

@property (nonatomic, readonly) JSGlobalContextRef jsGlobalContext;
@property (nonatomic, readonly) EJSharedOpenGLContext *openGLContext;

@property (nonatomic, retain) NSObject<EJWindowEventsDelegate> *windowEventsDelegate;
@property (nonatomic, retain) NSObject<EJTouchDelegate> *touchDelegate;
@property (nonatomic, retain) NSObject<EJDeviceMotionDelegate> *deviceMotionDelegate;

@property (nonatomic, retain) EJCanvasContext *currentRenderingContext;
@property (nonatomic, retain) EJCanvasContext<EJPresentable> *screenRenderingContext;

@property (nonatomic, retain) NSOperationQueue *backgroundQueue;
@property (nonatomic, retain) EJClassLoader *classLoader;

- (id)initWithFrame:(CGRect)frame;
// - (id)initWithWindow:(UIView *)windowp name:(NSString*)viewName sourceToLoad:(NSString*)src;

- (BOOL)loadRequest:(NSString *)url;
- (void)loadScriptAtPath:(NSString *)path;
- (JSValueRef)evaluateScript:(NSString *)script;
// - (JSValueRef)evaluateScript:(NSString *)script sourceURL:(NSString *)sourceURL;

- (void)clearCaches;

- (JSValueRef)invokeCallback:(JSObjectRef)callback thisObject:(JSObjectRef)thisObject argc:(size_t)argc argv:(const JSValueRef [])argv;
- (NSString *)pathForResource:(NSString *)resourcePath;
- (JSValueRef)deleteTimer:(JSContextRef)ctx argc:(size_t)argc argv:(const JSValueRef [])argv;
- (JSValueRef)loadModuleWithId:(NSString *)moduleId module:(JSValueRef)module exports:(JSValueRef)exports;
- (JSValueRef)createTimer:(JSContextRef)ctxp argc:(size_t)argc argv:(const JSValueRef [])argv repeat:(BOOL)repeat;
- (JSObjectRef)createFunctionWithBlock:(JSValueRef (^)(JSContextRef ctx, size_t argc, const JSValueRef argv[]))block;

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event;
- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event;
- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event;
- (void)touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event;

@end
