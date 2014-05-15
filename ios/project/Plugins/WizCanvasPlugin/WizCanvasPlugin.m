/* WizCanvasPlugin - Create a native canvas view.
 *
 * @author Ally Ogilvie
 * @copyright Wizcorp Inc. [ Incorporated Wizards ] 2013
 * @file WizCanvasPlugin.m for PhoneGap
 *
 */

#import "WizCanvasPlugin.h"
#import "WizCanvasView.h"
#import "WizDebugLog.h"
#import "EAGLView.h"

@implementation WizCanvasPlugin

@synthesize showViewCallbackId, hideViewCallbackId, webviewDelegate;


static NSMutableDictionary *wizViewList = nil;
static CGFloat viewPadder = 9999.0f;
static NSMutableDictionary *viewLoadedCallbackId = nil;
static NSMutableDictionary *isAnimating = nil;
static WizCanvasPlugin * wizViewManagerInstance = NULL;

- (CDVPlugin *)initWithWebView:(UIWebView *)theWebView {

    self = (WizCanvasPlugin *)[super initWithWebView:theWebView];
    if (self) {
		originalWebViewBounds = theWebView.bounds;
        
        self.webviewDelegate = theWebView.delegate;
        theWebView.delegate = self;

        wizViewManagerInstance = self;
    }
    
    // this holds all our views, first we add MainView to our view list by default
    wizViewList = [[NSMutableDictionary alloc ] initWithObjectsAndKeys: theWebView, @"mainView", nil];
    
    // Tell our mainView it IS mainView
    // (We don't need to do this earlier,only for the name mainView
    // to window.name when we are using wizViewManager)
    NSString *js = [NSString stringWithFormat:@"window.name = '%@'", @"mainView"];
    [theWebView stringByEvaluatingJavaScriptFromString:js];   
    
    // this holds callbacks for each view
    viewLoadedCallbackId = [[NSMutableDictionary alloc ] init];
    
    // this holds any views that are animating
    isAnimating = [[NSMutableDictionary alloc ] init];

    // init at nil
    self.showViewCallbackId = nil;
    self.hideViewCallbackId = nil;

    return self;
}

+ (NSMutableDictionary *)getViews {
    // return instance of current view list
    return wizViewList;
}

+ (NSMutableDictionary *)getViewLoadedCallbackId {
    // return instance of updateCallbackId
    return viewLoadedCallbackId;
}

+ (WizCanvasPlugin *)instance {
	return wizViewManagerInstance;
}

- (void)createView:(CDVInvokedUrlCommand *)command {
    
    // assign arguments
    NSString *viewName      = [command.arguments objectAtIndex:0];
    NSDictionary *options   = [command.arguments objectAtIndex:1];
    
    NSLog(@"[WizCanvasPlugin] ******* createView name:  %@ withOptions: %@", viewName, options);


    // For a webview we should push the callbackId to stack to use later after source
    // is loaded.
    // [viewLoadedCallbackId setObject:command.callbackId forKey:@"updateCallback"];

    // For the canvasView creation is so fast we don't need to stack callbackId.

    // Create a new wizCanvasView with options (if specified)
    NSString *src           = [options objectForKey:@"src"];
    CGRect newRect          = [self frameWithOptions:options];

    // Check view already exists?
    if ([wizViewList objectForKey:viewName]) {

        NSLog(@"[WizCanvasPlugin] ******* %@ view already exists... ", viewName);
        // View already exists return to JS with error
        CDVPluginResult *pluginResultErr = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        [self writeJavascript: [pluginResultErr toErrorCallbackString:command.callbackId]];

        return;
        /*
        // Is view hidden already? Apply padding
        WizCanvasView *canvas = [wizViewList objectForKey:viewName];
        if (canvas.window.isHidden) {
            // If hidden, add padding
            newRect.origin = CGPointMake(newRect.origin.x + viewPadder, newRect.origin.y);
        }

        canvas.window.frame = newRect;
        */
    }

    //canvasView = [[UIView alloc] initWithFrame:newRect];
    //WizCanvasView *canvas = [[WizCanvasView alloc] initWithWindow:canvasView name:viewName sourceToLoad:src];
    WizCanvasView *canvas = [[WizCanvasView alloc] initWithFrame:newRect];

    // Additional boot file
    if (![src isEqualToString:@""]) {
        if ([self validateUrl:src]) {
            if ([canvas loadRequest:src]) {
                NSLog(@"Loaded source");
            } else {
                NSLog(@"FAILED to load source on create");
            }
        } else {
            [canvas loadScriptAtPath:src];
        }
    }

    // Defaults
    canvas.backgroundColor          = [UIColor blackColor];
    canvas.opaque                   = YES; // Default to YES, this makes for faster rendering
    canvas.autoresizesSubviews      = YES;

    NSString *backgroundColor = [options objectForKey:@"backgroundColor"];
    if (![backgroundColor isKindOfClass:[NSNull class]] && backgroundColor != nil) {

        for (id view in canvas.subviews){
            if([view isKindOfClass:NSClassFromString(@"EAGLView")]){
                // Turn off opaque property on GL view
                CAEAGLLayer *eaglLayer = (CAEAGLLayer *)view;
                if ([backgroundColor isEqualToString:@"transparent"]) {
                    canvas.opaque          = NO;
                    canvas.backgroundColor = [UIColor clearColor];
                    eaglLayer.opaque       = FALSE;
                } else {
                    canvas.backgroundColor = [UIColor clearColor];
                    // Get out the colour calculator
                    eaglLayer.backgroundColor = (struct CGColor *)[self colorWithHexString:backgroundColor];
                }
            }
        }
    }

    // move view out of display
    [canvas setFrame:CGRectMake(
            canvas.frame.origin.x + viewPadder,
            canvas.frame.origin.y,
            canvas.frame.size.width,
            canvas.frame.size.height
    )];

    [canvas setHidden:TRUE];
    
    // add WizViewCanvas class to our wizard view list
    [wizViewList setObject:canvas forKey:viewName];

    // add view to parent UIWebView
    [self.webView addSubview:canvas];

    CDVPluginResult *pluginResultSuccess = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self writeJavascript: [pluginResultSuccess toSuccessCallbackString:command.callbackId]];

}

- (void)hideView:(CDVInvokedUrlCommand *)command {

    WizLog(@"wiz view list: %@", wizViewList);
    // Assign params
    NSString *viewName = [command.arguments objectAtIndex:0];

    if ([wizViewList objectForKey:viewName]) {
        
        // Hide the canvas view
        WizLog(@"START hideCanvasView with callback :  %@", command.callbackId);
        NSString *viewName = [command.arguments objectAtIndex:0];
        UIView *targetCanvasView = (UIView *)[wizViewList objectForKey:viewName];

        WizLog(@"START hideCanvasView hidden:  %i animating: %i", targetCanvasView.isHidden, [isAnimating objectForKey:viewName]);
        if (!targetCanvasView.isHidden || [isAnimating objectForKey:viewName]) {

            if ([isAnimating objectForKey:viewName]) {
                // TODO: view is animating - stop current animation can release previous callback

                WizLog(@"[WizCanvasPlugin] ******* hideView hideViewCallbackId %@", self.hideViewCallbackId);
                WizLog(@"[WizCanvasPlugin] ******* hideView showViewCallbackId %@", self.showViewCallbackId);
                if (self.hideViewCallbackId.length > 0) {
                    NSLog(@"[WizCanvasPlugin] ******* hideView, callback to hide - %@", self.hideViewCallbackId);
                    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                    [self writeJavascript: [result toSuccessCallbackString:self.hideViewCallbackId]];
                    self.hideViewCallbackId = nil;
                    // We are hiding when hiding, so exit.
                    WizLog(@"returning - already hiding animation");
                    return;
                }
                if (self.showViewCallbackId.length > 0) {
                    WizLog(@"[WizCanvasPlugin] ******* showView, callback to show - %@", self.showViewCallbackId);
                    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                    [self writeJavascript: [result toSuccessCallbackString:self.showViewCallbackId]];
                    self.showViewCallbackId = nil;
                }
            }

            // Assign new hide callback
            self.hideViewCallbackId = command.callbackId;

            NSDictionary *options = NULL;
            if ([command.arguments count] > 0) {
                // Assign options
                options = [command.arguments objectAtIndex:1];
            }

            if (![options isKindOfClass:[NSNull class]]) {
                NSDictionary *animationDict = [options objectForKey:@"animation"];
                if (animationDict) {
                    NSString *type               = [animationDict objectForKey:@"type"];
                    int animateTimeInMilliSecs   = [[animationDict objectForKey:@"duration"] intValue];
                    CGFloat animateTime          = (CGFloat)animateTimeInMilliSecs / 1000;
                    if (!animateTime) {
                        // Default value
                        animateTime = 0.3f;
                    }

                    if (!type) {
                        // Default value
                        [self hideWithFadeAnimation:targetCanvasView duration:animateTime option:UIViewAnimationOptionCurveEaseOut|UIViewAnimationOptionBeginFromCurrentState viewName:viewName];

                    } else if ([type isEqualToString:@"zoomOut"]) {

                        [self hideWithZoomOutAnimation:targetCanvasView duration:animateTime option:UIViewAnimationOptionCurveEaseOut|UIViewAnimationOptionBeginFromCurrentState viewName:viewName];

                    } else if ([type isEqualToString:@"fadeOut"]) {

                        [self hideWithFadeAnimation:targetCanvasView duration:animateTime option:UIViewAnimationOptionCurveEaseOut|UIViewAnimationOptionBeginFromCurrentState viewName:viewName];

                    } else if ([type isEqualToString:@"slideOutToLeft"]) {

                        [self hideWithSlideOutToLeftAnimation:targetCanvasView duration:animateTime option:UIViewAnimationOptionCurveEaseOut|UIViewAnimationOptionBeginFromCurrentState viewName:viewName];

                    } else if ([type isEqualToString:@"slideOutToRight"]) {

                        [self hideWithSlideOutToRightAnimation:targetCanvasView duration:animateTime option:UIViewAnimationOptionCurveEaseOut|UIViewAnimationOptionBeginFromCurrentState viewName:viewName];

                    } else if ([type isEqualToString:@"slideOutToTop"]) {

                        [self hideWithSlideOutToTopAnimation:targetCanvasView duration:animateTime option:UIViewAnimationOptionCurveEaseOut|UIViewAnimationOptionBeginFromCurrentState viewName:viewName];

                    } else if ([type isEqualToString:@"slideOutToBottom"]) {

                        [self hideWithSlideOutToBottomAnimation:targetCanvasView duration:animateTime option:UIViewAnimationOptionCurveEaseOut|UIViewAnimationOptionBeginFromCurrentState viewName:viewName];

                    } else {
                        // Not found do "none"
                        [self hideWithNoAnimation:targetCanvasView];
                        // Not animating so remove from animate store
                        [isAnimating removeObjectForKey:viewName];
                    }

                } else {
                    // Not found do "none"
                    [self hideWithNoAnimation:targetCanvasView];
                    // Not animating so remove from animate list
                    [isAnimating removeObjectForKey:viewName];
                }
            } else {
                // Not found do "none"
                [self hideWithNoAnimation:targetCanvasView];
                // Not animating so remove from animate list
                [isAnimating removeObjectForKey:viewName];
            }

        } else {
            // Target already hidden, do nothing
            WizLog(@"[WizCanvasPlugin] ******* target already hidden! ");
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            [self writeJavascript: [result toErrorCallbackString:command.callbackId]];
            // self.showViewCallbackId = nil;
        }

        // NOTE: Other success callbacks come from AFTER the view is added to animation object

    } else {
        // View not found
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"view not found!"];
        [self writeJavascript: [pluginResult toErrorCallbackString:command.callbackId]];
        return;
    }
}

- (void)showView:(CDVInvokedUrlCommand *)command {
    NSString *viewName = [command.arguments objectAtIndex:0];

    if ([wizViewList objectForKey:viewName]) {
        
        // Show the web view
        WizLog(@"START showCanvasView with callback :  %@", command.callbackId);

        UIView *targetCanvasView = [wizViewList objectForKey:viewName];
        WizLog(@"START showCanvasView with view :  %@", targetCanvasView);
        if (targetCanvasView.isHidden || [isAnimating objectForKey:viewName]) {

            if ([isAnimating objectForKey:viewName]) {
                // TODO: view is animating - stop current animation can release previous callback
                if (self.hideViewCallbackId.length > 0) {
                    WizLog(@"[WizCanvas] ******* showView, callback to hide - %@", self.hideViewCallbackId);
                    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                    [self writeJavascript: [result toSuccessCallbackString:self.hideViewCallbackId]];
                    self.hideViewCallbackId = nil;
                }
                if (self.showViewCallbackId.length > 0) {
                    WizLog(@"[WizCanvas] ******* showView, callback to show - %@", self.showViewCallbackId);
                    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                    [self writeJavascript: [result toSuccessCallbackString:self.showViewCallbackId]];
                    self.showViewCallbackId = nil;
                    // we are showing when showing, exit.
                    WizLog(@"returning - already showing animation");
                    return;
                }
            }

            // Assign new show callback
            self.showViewCallbackId = command.callbackId;

            NSDictionary *options = NULL;
            if ([command.arguments count] > 0) {
                // Assign options
                options = [command.arguments objectAtIndex:1];
            }
            if (![options isKindOfClass:[NSNull class]]) {
                NSDictionary* animationDict = [options objectForKey:@"animation"];
                if (animationDict) {

                    WizLog(@"[WizCanvas] ******* with options : %@ ", options);
                    NSString* type               = [animationDict objectForKey:@"type"];
                    int animateTimeInMilliSecs   = [[animationDict objectForKey:@"duration"] intValue];
                    CGFloat animateTime          = (CGFloat)animateTimeInMilliSecs / 1000;
                    if (!animateTime) {
                        // default
                        animateTime = 0.3f;
                    }
                    WizLog(@"[WizCanvas] ******* showView animateTime : %f ", animateTime);

                    if (!type) {

                        // default
                        [self showWithFadeAnimation:targetCanvasView duration:animateTime option:UIViewAnimationOptionCurveEaseIn|UIViewAnimationOptionBeginFromCurrentState showViewCallbackId:command.callbackId viewName:viewName];

                    } else if ([type isEqualToString:@"zoomIn"]) {

                        [self showWithZoomInAnimation:targetCanvasView duration:animateTime option:UIViewAnimationOptionCurveEaseIn|UIViewAnimationOptionBeginFromCurrentState showViewCallbackId:command.callbackId viewName:viewName];

                    } else if ([type isEqualToString:@"fadeIn"]) {

                        [self showWithFadeAnimation:targetCanvasView duration:animateTime option:UIViewAnimationOptionCurveEaseIn|UIViewAnimationOptionBeginFromCurrentState showViewCallbackId:command.callbackId viewName:viewName];

                    } else if ([type isEqualToString:@"slideInFromLeft"]) {

                        [self showWithSlideInFromLeftAnimation:targetCanvasView duration:animateTime option:UIViewAnimationOptionCurveEaseIn|UIViewAnimationOptionBeginFromCurrentState showViewCallbackId:command.callbackId viewName:viewName];

                    } else if ([type isEqualToString:@"slideInFromRight"]) {

                        [self showWithSlideInFromRightAnimation:targetCanvasView duration:animateTime option:UIViewAnimationOptionCurveEaseIn|UIViewAnimationOptionBeginFromCurrentState showViewCallbackId:command.callbackId viewName:viewName];

                    } else if ([type isEqualToString:@"slideInFromTop"]) {

                        [self showWithSlideInFromTopAnimation:targetCanvasView duration:animateTime option:UIViewAnimationOptionCurveEaseIn|UIViewAnimationOptionBeginFromCurrentState showViewCallbackId:command.callbackId viewName:viewName];

                    } else if ([type isEqualToString:@"slideInFromBottom"]) {

                        [self showWithSlideInFromBottomAnimation:targetCanvasView duration:animateTime option:UIViewAnimationOptionCurveEaseIn|UIViewAnimationOptionBeginFromCurrentState showViewCallbackId:command.callbackId viewName:viewName];

                    } else {
                        // Not found do "none"
                        [self showWithNoAnimation:targetCanvasView];
                        // no animate so remove from animate store
                        [isAnimating removeObjectForKey:viewName];
                        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                        [self writeJavascript: [result toSuccessCallbackString:command.callbackId]];
                        self.showViewCallbackId = nil;
                    }

                } else {
                    // Not found do "none"
                    [self showWithNoAnimation:targetCanvasView];
                    // no animate so remove from animate store
                    [isAnimating removeObjectForKey:viewName];
                    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                    [self writeJavascript: [result toSuccessCallbackString:command.callbackId]];
                    self.showViewCallbackId = nil;
                }

            } else {
                // Not found do "none"
                [self showWithNoAnimation:targetCanvasView];
                // Not animating so remove from animate list
                // [isAnimating removeObjectForKey:viewName];
                CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                [self writeJavascript: [result toSuccessCallbackString:command.callbackId]];
                self.showViewCallbackId = nil;
            }

        } else {
            // Target already showing
            WizLog(@"[WizCanvas] ******* target already shown! ");
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
            [self writeJavascript: [result toErrorCallbackString:command.callbackId]];
            // self.showViewCallbackId = nil;

        }
    } else {
        // View not found
        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"view not found!"];
        [self writeJavascript: [result toErrorCallbackString:command.callbackId]];
    }
}

- (void)load:(CDVInvokedUrlCommand *)command {
    // assign arguments
    NSString *viewName    = [command.arguments objectAtIndex:0];

    NSDictionary *options = NULL;
    if ([command.arguments count] > 0) {
        options = [command.arguments objectAtIndex:1];
    }

    WizLog(@"[WizCanvasPlugin] ******* Load into canvas : %@ - viewlist -> %@ options %@", viewName, wizViewList, options);

    if (![options isKindOfClass:[NSNull class]]) {
        // Find the correct view
        if ([wizViewList objectForKey:viewName]) {

            NSString *src               = [options objectForKey:@"src"];
            
            if ([src length] > 0) {
                WizLog(@"[WizCanvasPlugin] ******* loading source to view : %@ ", viewName);
            } else {
                WizLog(@"Load Error: no source");
                CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Load Error: no sourc"];
                [self writeJavascript: [pluginResult toErrorCallbackString:command.callbackId]];
                return;
            }

            WizCanvasView *canvas = [wizViewList objectForKey:viewName];
            if ([self validateUrl:src]) {
                // Source is url
                if ([canvas loadRequest:src]) {
                    
                    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                    [self writeJavascript: [pluginResult toSuccessCallbackString:command.callbackId]];
                    
                } else {
                    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:
                                                     CDVCommandStatus_ERROR messageAsString:[NSString stringWithFormat:@"Error: Can't Find Script %@", src]];
                    [self writeJavascript: [pluginResult toErrorCallbackString:command.callbackId]];
                }
             
            } else {
                [canvas loadScriptAtPath:src];

                CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                [self writeJavascript: [pluginResult toSuccessCallbackString:command.callbackId]];
            }
        } else {
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"error - view not found"];
            [self writeJavascript: [pluginResult toErrorCallbackString:command.callbackId]];
        }
    } else {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"error - no options passed"];
        [self writeJavascript: [pluginResult toErrorCallbackString:command.callbackId]];
    }
}

- (void)removeView:(CDVInvokedUrlCommand *)command {
    // assign arguments
    NSString *viewName = [command.arguments objectAtIndex:0];
    WizLog(@"[WizCanvasPlugin] ******* removeView name : %@ ", viewName);
    
    // search for view
    if ([wizViewList objectForKey:viewName]) {

        // Get the view from the view list
        WizCanvasView *canvas = (WizCanvasView *)[wizViewList objectForKey:viewName];
        [canvas removeFromSuperview];
        [canvas release];
        canvas = nil;

        // remove the view from wizViewList
        [wizViewList removeObjectForKey:viewName];

        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self writeJavascript: [pluginResult toSuccessCallbackString:command.callbackId]];

        NSLog(@"[WizViewManager] ******* removeView views left : %@ ", wizViewList);

    } else {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"error - view not found"];
        [self writeJavascript: [pluginResult toErrorCallbackString:command.callbackId]];
    }
}

- (CGRect)frameWithOptions:(NSDictionary *)options {
    // get Device width and height
    CGRect screenRect = [[UIScreen mainScreen] bounds];
    int screenHeight = (int) screenRect.size.height;
    int screenWidth = (int) screenRect.size.width;
    
    // define vars
    int top;
    int left;
    int width;
    int height;
    
    if (options) {
        WizLog(@"SIZING OPTIONS: %@", options);
        
        if ([options objectForKey:@"top"]) {
            top = [self getWeakLinker:[options objectForKey:@"top"] ofType:@"top"];
        } else if ([options objectForKey:@"y"]) {
            // backward compatibility
            top = [self getWeakLinker:[options objectForKey:@"y"] ofType:@"top"];
        } else if ([options objectForKey:@"height"] && [options objectForKey:@"bottom"]) {
            top = screenHeight - [self getWeakLinker:[options objectForKey:@"bottom"] ofType:@"bottom"]
            - [self getWeakLinker:[options objectForKey:@"height"] ofType:@"height"];
        } else {
            top = 0;
        }
        // NSLog(@"TOP: %i", top);
        
        if ([options objectForKey:@"left"]) {
            left = [self getWeakLinker:[options objectForKey:@"left"] ofType:@"left"];
        } else if ([options objectForKey:@"x"]) {
            // backward compatibility
            left = [self getWeakLinker:[options objectForKey:@"x"] ofType:@"left"];
        } else if ([options objectForKey:@"width"] && [options objectForKey:@"right"]) {
            left = screenWidth - [self getWeakLinker:[options objectForKey:@"right"] ofType:@"right"]
            - [self getWeakLinker:[options objectForKey:@"width"] ofType:@"width"];
        } else {
            left = 0;
        }
        // NSLog(@"LEFT: %i", left);
        
        if ([options objectForKey:@"height"]) {
            height = [self getWeakLinker:[options objectForKey:@"height"] ofType:@"height"];
        } else if ([options objectForKey:@"bottom"]) {
            height = screenHeight - [self getWeakLinker:[options objectForKey:@"bottom"] ofType:@"bottom"] - top;
        } else {
            height = screenHeight;
        }
        // NSLog(@"HEIGHT: %i", height);
        
        if ([options objectForKey:@"width"]) {
            width = [self getWeakLinker:[options objectForKey:@"width"] ofType:@"width"];
        } else if ([options objectForKey:@"right"]) {
            width = screenWidth - [self getWeakLinker:[options objectForKey:@"right"] ofType:@"right"] - left;
        } else {
            width = screenWidth;
        }
        // NSLog(@"WIDTH: %i", width);
    } else {
        // Defaults to full screen fill
        top = 0;
        left = 0;
        height = screenHeight;
        width = screenWidth;
        // NSLog(@"TOP: 0\nLEFT: 0\nHEIGHT: %i\nWIDTH: %i", height, width);
    }
    
    // NSLog(@"MY PARAMS left: %i, top: %i, width: %i, height: %i", left, top, width,height);
    
    return CGRectMake(left, top, width, height);
}

- (void)setLayout:(CDVInvokedUrlCommand *)command {
    // assign arguments
    NSString *viewName    = [command.arguments objectAtIndex:0];
    NSDictionary *options;
    if ([command.arguments count] > 0) {
        // Get options
        options = [command.arguments objectAtIndex:1];
    } else {
        WizLog(@"[WizCanvasPlugin] ******* setLayout - no options given");
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"no options"];
        [self writeJavascript: [pluginResult toErrorCallbackString:command.callbackId]];
        return;
    }

    WizLog(@"[WizCanvasPlugin] ******* resizeView name:  %@ withOptions: %@", viewName, options);
    
    if ([wizViewList objectForKey:viewName]) {

        // SetLayout canvas view
        UIView *targetCanvasView = (UIView *)[wizViewList objectForKey:viewName];
        CGRect newRect = [self frameWithOptions:options];
        if (targetCanvasView.isHidden) {
            // if hidden add padding
            newRect.origin = CGPointMake(newRect.origin.x + viewPadder, newRect.origin.y);
        }

        [targetCanvasView setFrame:newRect];

        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self writeJavascript: [pluginResult toSuccessCallbackString:command.callbackId]];
        
    } else {
        // NSLog(@"view not found!");
        
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"view not found!"];
        [self writeJavascript: [pluginResult toErrorCallbackString:command.callbackId]];
    }
}

- (void)postMessage:(NSString *)targetView withMessage:(NSString *)message andMessageType:(NSString *)type fromView:(NSString *)originView {
    // Send a message to a view
       
    if ([wizViewList objectForKey:targetView]) {
        // Found view send message

        NSString *viewType = [self checkView:[wizViewList objectForKey:targetView]];
        NSLog(@"Sending message: %@ targetView: %@", viewType, targetView);

        NSString *js = [NSString stringWithFormat:@"wizCanvasMessenger.__triggerMessageEvent(\"%@\", \"%@\", %@, \"%@\");",
                        originView,
                        targetView,
                        message,
                        type];
        
        if ([viewType isEqualToString:@"canvas"]) {

            UIView *targetCanvasView = [wizViewList objectForKey:targetView];
            WizCanvasView *canvasController = (WizCanvasView *)targetCanvasView.nextResponder;
            [canvasController evaluateScript:js];

        } else if ([viewType isEqualToString:@"webview"]) {
            // Treat as UIWebView
            UIWebView *targetWebView = [wizViewList objectForKey:targetView];
            [targetWebView stringByEvaluatingJavaScriptFromString:js];
        }

    } else {
        NSLog(@"Error : Message failed! View not found!");
    }
}

- (int)getWeakLinker:(NSString *)myString ofType:(NSString *)type {
    // do tests to get correct int (we read in as string pointer but infact we are unaware of the var type)
    int i;
    
    if (!myString || !type) {
        // got null value in method params
        return i = 0;
    }
    
    // NSLog(@"try link : %@ for type: %@", myString, type);

    // get Device width and height
    CGRect screenRect = [[UIScreen mainScreen] bounds];
    CGFloat screenHeight = screenRect.size.height;
    CGFloat screenWidth = screenRect.size.width;

    // test for percentage
    NSArray *percentTest = [self percentTest:myString];
    
    if (percentTest) {
        // it was a percent do calculation and assign value
        
        int j = [[percentTest objectAtIndex:0] intValue];
        
        if ([type isEqualToString:@"width"] || [type isEqualToString:@"left"] || [type isEqualToString:@"right"]) {
            float k = j*0.01; // use float here or int is rounded to a 0 int
            i = k*screenWidth;
        } else if ([type isEqualToString:@"height"] || [type isEqualToString:@"top"] || [type isEqualToString:@"bottom"]) {
            float k = j*0.01; // use float here or int is rounded to a 0 int
            i = k*screenHeight;
        } else {
            //invalid type - not supported
            i = 0;
        }
        
    } else {
        
        // test - float
        BOOL floatTest= [self floatTest:myString];
        if (floatTest) {
            // we have a float, check our float range and convert to int
            
            float floatValue = [myString floatValue];
            if (floatValue < 1.0) {
                if ([type isEqualToString:@"width"] || [type isEqualToString:@"left"] || [type isEqualToString:@"right"]) {
                    i = (floatValue * screenWidth);
                } else if ([type isEqualToString:@"height"] || [type isEqualToString:@"top"] || [type isEqualToString:@"bottom"]) {
                    i = (floatValue * screenHeight);
                } else {
                    //invalid type - not supported
                    i = 0;
                }
            } else {
                // not good float value - defaults to 0
                i = 0;
            }
            
        } else {
            // Third string test - assume an int?
            i = [myString intValue];
        }
        
    }
    
    // NSLog(@"weak linked : %i for type: %@", i, type);
    return i;
    
}

- (BOOL)validateUrl:(NSString *)candidate {
    NSString* lowerCased = [candidate lowercaseString];
    return [lowerCased hasPrefix:@"http://"] || [lowerCased hasPrefix:@"https://"];
}

- (BOOL)floatTest:(NSString *)myString {
    NSString *realString = [[NSString alloc] initWithString:myString];
    NSArray *floatTest = [realString componentsSeparatedByString:@"."];
    [realString release];
    if (floatTest.count > 1) {
        // found decimal. must be a float
        return TRUE;
    } else {
        // failed test
        return FALSE;
    }
    
}

- (NSArray *)percentTest:(NSString *)myString {
    NSString *realString = [[NSString alloc] initWithString:myString];
    NSArray *percentTest = [realString componentsSeparatedByString:@"%"];
    [realString release];
    
    if (percentTest.count > 1) {
        // found percent mark. must be a percent
        return percentTest;
    } else {
        // failed test
        return NULL;
    }
}



/**
 
 COLOUR CALCULATOR

 **/
- (UIColor *)colorWithHexString: (NSString *)hexString {
    NSString *colorString = [[hexString stringByReplacingOccurrencesOfString: @"#" withString: @""] uppercaseString];
    CGFloat alpha, red, blue, green;
    switch ([colorString length]) {
        case 3: // #RGB
            alpha = 1.0f;
            red   = [self colorComponentFrom: colorString start: 0 length: 1];
            green = [self colorComponentFrom: colorString start: 1 length: 1];
            blue  = [self colorComponentFrom: colorString start: 2 length: 1];
            break;
        case 4: // #ARGB
            alpha = [self colorComponentFrom: colorString start: 0 length: 1];
            red   = [self colorComponentFrom: colorString start: 1 length: 1];
            green = [self colorComponentFrom: colorString start: 2 length: 1];
            blue  = [self colorComponentFrom: colorString start: 3 length: 1];          
            break;
        case 6: // #RRGGBB
            alpha = 1.0f;
            red   = [self colorComponentFrom: colorString start: 0 length: 2];
            green = [self colorComponentFrom: colorString start: 2 length: 2];
            blue  = [self colorComponentFrom: colorString start: 4 length: 2];                      
            break;
        case 8: // #AARRGGBB
            alpha = [self colorComponentFrom: colorString start: 0 length: 2];
            red   = [self colorComponentFrom: colorString start: 2 length: 2];
            green = [self colorComponentFrom: colorString start: 4 length: 2];
            blue  = [self colorComponentFrom: colorString start: 6 length: 2];                      
            break;
        default:
            [NSException raise:@"Invalid color value" format: @"Color value %@ is invalid.  It should be a hex value of the form #RGB, #ARGB, #RRGGBB, or #AARRGGBB", hexString];
            break;
    }
    return [UIColor colorWithRed: red green: green blue: blue alpha: alpha];
}

- (CGFloat)colorComponentFrom:(NSString *)string start:(NSUInteger)start length:(NSUInteger)length
{
    NSString *substring = [string substringWithRange: NSMakeRange(start, length)];
    NSString *fullHex = length == 2 ? substring : [NSString stringWithFormat: @"%@%@", substring, substring];
    unsigned hexComponent;
    [[NSScanner scannerWithString: fullHex] scanHexInt: &hexComponent];
    return hexComponent / 255.0;
}

/**
 
 ANIMATION METHODS
 
 **/
- (void)showViewCallbackMethod:(NSString *)callbackId viewName:(NSString *)viewName {
    
    if (self.showViewCallbackId.length > 0) {
        // we are still animating without iteruption so continue callback
        NSString* callback = self.showViewCallbackId;
        self.showViewCallbackId = nil;
        NSLog(@"[SHOW] callback to %@", callback);
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self writeJavascript: [pluginResult toSuccessCallbackString:callback]];
    }

}

- (void)showWithNoAnimation:(UIView *)view {
    // move view into display       
    [view setFrame:CGRectMake(
                              view.frame.origin.x - viewPadder,
                              view.frame.origin.y,
                              view.frame.size.width,
                              view.frame.size.height
                              )];
    [view setHidden:FALSE];
    view.alpha = 1.0;
    
}

- (void)hideWithNoAnimation:(UIView *)view {
    WizLog(@"CALLING HIDE METHOD");
    view.alpha = 0.0;
    [view setHidden:TRUE];
    // move view out of display
    [view setFrame:CGRectMake(
                              view.frame.origin.x + viewPadder,
                              view.frame.origin.y,
                              view.frame.size.width,
                              view.frame.size.height
                              )];
    self.hideViewCallbackId = nil;
}


- (void)showWithSlideInFromTopAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option showViewCallbackId:(NSString *)callbackId viewName:(NSString *)viewName {
    
    CGFloat screenHeight = [[UIScreen mainScreen] bounds].size.height;
    
    // move view to bottom of visible display      
    [view setFrame:CGRectMake(
                              view.frame.origin.x - viewPadder,
                              view.frame.origin.y - screenHeight,
                              view.frame.size.width,
                              view.frame.size.height
                              )];
    [view setHidden:FALSE];
    view.alpha = 1.0;
    // now return the view to normal dimension, animating this tranformation
    [UIView animateWithDuration:secs delay:0.0 options:option
                     animations:^{
                         view.transform = CGAffineTransformTranslate(view.transform, view.frame.origin.x, screenHeight);
                     }
                     completion:^(BOOL finished) {
                         if (finished) {
                             [self showViewCallbackMethod:callbackId viewName:viewName];
                         }
                     }];
}

- (void)hideWithSlideOutToTopAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option viewName:(NSString *)viewName {
    
    CGFloat screenHeight = [[UIScreen mainScreen] bounds].size.height;
    
    [UIView animateWithDuration:secs delay:0.0 options:option
                     animations:^{
                         view.transform = CGAffineTransformTranslate(view.transform, view.frame.origin.x, -screenHeight);
                     }
                     completion:^(BOOL finished) { 
                         if (finished) {
                             [view setHidden:TRUE];
                             
                             // move view out of display
                             [view setFrame:CGRectMake(
                                                       view.frame.origin.x + viewPadder,
                                                       (view.frame.origin.y + screenHeight),
                                                       view.frame.size.width,
                                                       view.frame.size.height
                                                       )];
                             
                             // no animate so remove from animate store
                             [isAnimating removeObjectForKey:viewName];
                             self.hideViewCallbackId = nil;
                         }
                     }];
}

- (void)showWithSlideInFromBottomAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option showViewCallbackId:(NSString *)callbackId viewName:(NSString *)viewName {
    
    CGFloat screenHeight = [[UIScreen mainScreen] bounds].size.height;
    
    // move view to bottom of visible display      
    [view setFrame:CGRectMake(
                              view.frame.origin.x - viewPadder,
                              view.frame.origin.y + screenHeight,
                              view.frame.size.width,
                              view.frame.size.height
                              )];
    [view setHidden:FALSE];
    view.alpha = 1.0;
    // now return the view to normal dimension, animating this tranformation
    [UIView animateWithDuration:secs delay:0.0 options:option
                     animations:^{
                         view.transform = CGAffineTransformTranslate(view.transform, view.frame.origin.x, -screenHeight);
                     }
                     completion:^(BOOL finished) {
                         if (finished) {
                             [self showViewCallbackMethod:callbackId viewName:viewName];
                         }
                     }];
}

- (void)hideWithSlideOutToBottomAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option viewName:(NSString *)viewName {
    
    CGFloat screenHeight = [[UIScreen mainScreen] bounds].size.height;
    
    [UIView animateWithDuration:secs delay:0.0 options:option
                     animations:^{
                         view.transform = CGAffineTransformTranslate(view.transform, view.frame.origin.x, screenHeight);
                     }
                     completion:^(BOOL finished) { 
                         if (finished) {
                             [view setHidden:TRUE];
                             
                             // move view out of display
                             [view setFrame:CGRectMake(
                                                       view.frame.origin.x + viewPadder,
                                                       (view.frame.origin.y - screenHeight),
                                                       view.frame.size.width,
                                                       view.frame.size.height
                                                       )];
                             
                             // no animate so remove from animate store
                             [isAnimating removeObjectForKey:viewName];
                             self.hideViewCallbackId = nil;
                         }
                     }];
}

- (void)showWithSlideInFromRightAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option showViewCallbackId:(NSString *)callbackId viewName:(NSString *)viewName {
    
    CGFloat screenWidth = [[UIScreen mainScreen] bounds].size.width;
    
    // move view to right of visible display      
    [view setFrame:CGRectMake(
                              (view.frame.origin.x - viewPadder) + screenWidth,
                              view.frame.origin.y,
                              view.frame.size.width,
                              view.frame.size.height
                              )];
    [view setHidden:FALSE];
    view.alpha = 1.0;
    // now return the view to normal dimension, animating this tranformation
    [UIView animateWithDuration:secs delay:0.0 options:option
                     animations:^{
                         view.transform = CGAffineTransformTranslate(view.transform, -screenWidth, view.frame.origin.y);
                     }
                     completion:^(BOOL finished) {
                         if (finished) {
                             [self showViewCallbackMethod:callbackId viewName:viewName];
                         }
                     }];
}

- (void)hideWithSlideOutToRightAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option viewName:(NSString *)viewName {
    
    CGFloat screenWidth = [[UIScreen mainScreen] bounds].size.width;
    
    [UIView animateWithDuration:secs delay:0.0 options:option
                     animations:^{
                         view.transform = CGAffineTransformTranslate(view.transform, screenWidth, view.frame.origin.y);
                     }
                     completion:^(BOOL finished) { 
                         if (finished) {
                             [view setHidden:TRUE];
                             
                             // move view out of display
                             [view setFrame:CGRectMake(
                                                       (view.frame.origin.x - screenWidth) + viewPadder,
                                                       view.frame.origin.y,
                                                       view.frame.size.width,
                                                       view.frame.size.height
                                                       )];
                             
                             // no animate so remove from animate store
                             [isAnimating removeObjectForKey:viewName];
                             self.hideViewCallbackId = nil;
                         }
                     }];
}


- (void)showWithSlideInFromLeftAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option showViewCallbackId:(NSString *)callbackId viewName:(NSString *)viewName {

    CGFloat screenWidth = [[UIScreen mainScreen] bounds].size.width;
    
    // move view to left of visible display      
    [view setFrame:CGRectMake(
                              (view.frame.origin.x - viewPadder) - screenWidth,
                              view.frame.origin.y,
                              view.frame.size.width,
                              view.frame.size.height
                              )];
    [view setHidden:FALSE];
    [view setAlpha:1.0];
    // now return the view to normal dimension, animating this tranformation
    
   
    [UIView animateWithDuration:secs delay:0.0 options:option
                     animations:^{
                         view.transform = CGAffineTransformTranslate(view.transform, screenWidth, view.frame.origin.y);
                     }
                     completion:^(BOOL finished) {
                         if (finished) {
                             [self showViewCallbackMethod:callbackId viewName:viewName];
                         }
                     }];
     
}

- (void)hideWithSlideOutToLeftAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option viewName:(NSString *)viewName {
    
    CGFloat screenWidth = [[UIScreen mainScreen] bounds].size.width;
    
    [UIView animateWithDuration:secs delay:0.0 options:option
                     animations:^{
                         view.transform = CGAffineTransformTranslate(view.transform, -screenWidth, view.frame.origin.y);
                     }
                     completion:^(BOOL finished) { 
                         if (finished) {
                             [view setHidden:TRUE];
                             
                             // move view out of display
                             [view setFrame:CGRectMake(
                                                       (view.frame.origin.x + screenWidth) + viewPadder,
                                                       view.frame.origin.y,
                                                       view.frame.size.width,
                                                       view.frame.size.height
                                                       )];
                             
                             // no animate so remove from animate store
                             [isAnimating removeObjectForKey:viewName];
                             self.hideViewCallbackId = nil;
                         }
                     }];
                
}

- (void)showWithZoomInAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option showViewCallbackId:(NSString *)callbackId viewName:(NSString *)viewName {

    // first reduce the view to 1/100th of its original dimension
    CGAffineTransform trans = CGAffineTransformScale(view.transform, 0.01, 0.01);
    view.transform = trans;	// do it instantly, no animation
    // move view into display       
    [view setFrame:CGRectMake(
               view.frame.origin.x - viewPadder,
               view.frame.origin.y,
               view.frame.size.width,
               view.frame.size.height
               )];
    [view setHidden:FALSE];
    // [self addSubview:view];
    // now return the view to normal dimension, animating this tranformation
    [UIView animateWithDuration:secs delay:0.0 options:option
                     animations:^{
                         view.transform = CGAffineTransformScale(view.transform, 100.0, 100.0);
                     }
                     completion:^(BOOL finished) {
                         if (finished) {
                             [self showViewCallbackMethod:callbackId viewName:viewName];
                         }
                     }];	
}

- (void)hideWithZoomOutAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option viewName:(NSString *)viewName {

    // Save old position and apply it back, after view is hidden
    CGRect oldFrame = view.frame;

	[UIView animateWithDuration:secs delay:0.0 options:option
                     animations:^{
                         view.transform = CGAffineTransformScale(view.transform, 0.01, 0.01);
                     }
                     completion:^(BOOL finished) { 
                         if (finished) {
                             // [self removeFromSuperview]; 
                             [view setHidden:TRUE];
                             // move view out of display
                             [view setFrame:CGRectMake(
                                     oldFrame.origin.x + viewPadder,
                                     oldFrame.origin.y,
                                     oldFrame.size.width,
                                     oldFrame.size.height
                                        )];
                             
                             // no animate so remove from animate store
                             [isAnimating removeObjectForKey:viewName];
                             self.hideViewCallbackId = nil;
                         }
                     }];
}

- (void)showWithFadeAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option showViewCallbackId:(NSString *)callbackId viewName:(NSString *)viewName {
    
    WizLog(@"SHOW FADE view is %@, %@", view, viewName);

    // Check frame x co ordinate is the same (in case of mid animation), if different we need to reset frame

    if (![isAnimating objectForKey:viewName]) {
        WizLog(@"move view ");
        view.alpha = 0.0;
        // Move view into display
        [view setFrame:CGRectMake(
                                  view.frame.origin.x - viewPadder,
                                  view.frame.origin.y,
                                  view.frame.size.width,
                                  view.frame.size.height
                                  )];
    }
    
    // About to animate so add to animate store
    [isAnimating setObject:view forKey:viewName];

    [view setHidden:FALSE];
    WizLog(@"START show animate");
	[UIView animateWithDuration:secs delay:0.0 options:option
                     animations:^{
                         view.alpha = 1.0;
                     }
                     completion:^(BOOL finished) {
                        if (finished) {
                            WizLog(@"FINISHED show animation: %@", view);
                            // Finished animation remove from animate store
                            [isAnimating removeObjectForKey:viewName];
                            [self showViewCallbackMethod:callbackId viewName:viewName];
                        }
                         
                     }];
}

- (void)hideWithFadeAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option viewName:(NSString *)viewName {
    WizLog(@"HIDE FADE view is %@, %@", view, viewName);
    // about to animate so add to animate store
    
    if (![isAnimating objectForKey:viewName]) {
        view.alpha = 1.0;	// make the view transparent
    }
    
    [isAnimating setObject:view forKey:viewName];
    
    CDVPluginResult *pluginResultOK = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self writeJavascript: [pluginResultOK toSuccessCallbackString:self.hideViewCallbackId]];
    
    //[self addSubview:view];	// add it
	[UIView animateWithDuration:secs delay:0.0 options:option
                     animations:^{view.alpha = 0.0;}
                     completion:^(BOOL finished) { 
                         if (finished) {
                             WizLog(@"Finished HIDE animate %i", finished);

                             [view setHidden:TRUE];
                             // move view out of display
                             [view setFrame:CGRectMake(
                                                       view.frame.origin.x + viewPadder,
                                                       view.frame.origin.y,
                                                       view.frame.size.width,
                                                       view.frame.size.height
                                                       )];
                             // no animate so remove from animate store
                             [isAnimating removeObjectForKey:viewName];
                             self.hideViewCallbackId = nil;
                         }
                         
                     }];	// animate the return to visible 
}

/*
 * Extend CordovaView URL request handler
 *
 */
- (void)webViewDidStartLoad:(UIWebView *)theWebView {
    return [self.webviewDelegate webViewDidStartLoad:theWebView];
}

- (void)webViewDidFinishLoad:(UIWebView *)theWebView {
    return [self.webviewDelegate webViewDidFinishLoad:theWebView];
}

- (void)webView:(UIWebView *)theWebView didFailLoadWithError:(NSError*)error {
    return [self.webviewDelegate webView:theWebView didFailLoadWithError:error];
}

- (BOOL)webView:(UIWebView *)theWebView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType {
    

    BOOL superValue = [ self.webviewDelegate webView:theWebView shouldStartLoadWithRequest:request navigationType:navigationType ];

    // If get this request reboot...
    NSString *requestString = [[request URL] absoluteString];
    NSArray* prefixer = [requestString componentsSeparatedByString:@":"];
        
    // do insensitive compare to support SDK >5
    if ([(NSString*)[prefixer objectAtIndex:0] caseInsensitiveCompare:@"rebootapp"] == 0) {
        
        // perform restart a second later
        [self performSelector:@selector(timedRestart:) withObject:theWebView afterDelay:1.0f];
        
        return NO;
		
	} else if ([(NSString *)[prefixer objectAtIndex:0] caseInsensitiveCompare:@"wizPostMessage"] == 0) {

        NSMutableDictionary *viewList = [[NSMutableDictionary alloc] initWithDictionary:[WizCanvasPlugin getViews]];

        NSArray *requestComponents = [requestString componentsSeparatedByString:@"://"];
        NSString *postMessage = [[NSString alloc] initWithString:(NSString*)[requestComponents objectAtIndex:1]];

        NSArray *messageComponents = [postMessage componentsSeparatedByString:@"?"];

        NSString *originView = [[NSString alloc] initWithString:(NSString*)[messageComponents objectAtIndex:0]];
        NSString *targetView = [[NSString alloc] initWithString:(NSString*)[messageComponents objectAtIndex:1]];
        if ([viewList objectForKey:targetView]) {

            NSString *data = [[NSString alloc] initWithString:(NSString*)[messageComponents objectAtIndex:2]];
            NSString *type = [[NSString alloc] initWithString:(NSString*)[messageComponents objectAtIndex:3]];

            WizCanvasView *targetCanvasView = (WizCanvasView *)[viewList objectForKey:targetView];
            NSString *js = [NSString stringWithFormat:@"wizCanvasMessenger.__triggerMessageEvent('%@', '%@', '%@', '%@');", originView, targetView, data, type];
            [targetCanvasView evaluateScript:js];

            [data release];
        }
        
        [postMessage release];
        postMessage = nil;
        [originView release];
        [targetView release];
        [viewList release];
        
        
        return NO;
        
 	} else {
        // let Cordova handle everything else
        return superValue;
    }

}


- (void)timedRestart:(UIWebView *)theWebView {
    // gives time for our JS method to execute splash
    
    
    // remove all views
    NSArray *allKeys = [NSArray arrayWithArray:[wizViewList allKeys]];
    
    for (int i = 0; i<[allKeys count]; i++) {
        
        if (![[allKeys objectAtIndex:i] isEqualToString:@"mainView"]) {
            CDVInvokedUrlCommand *cmd = [[CDVInvokedUrlCommand alloc] initWithArguments:[NSArray arrayWithObjects:[allKeys objectAtIndex:i], nil] callbackId:@"" className:@"WizCanvasPlugin" methodName:@"removeView"];
            [self removeView:cmd];
            [cmd release];
        }
        
    }
    
    // resize mainView to normal
    CDVInvokedUrlCommand *cmd = [[CDVInvokedUrlCommand alloc] initWithArguments:[NSArray arrayWithObjects:@"mainView", nil] callbackId:@"" className:@"WizCanvasPlugin" methodName:@"setLayout"];
    [self setLayout:cmd];
    [cmd release];
    
    [theWebView reload];
}

- (NSString *)checkView:(NSObject *)view {

    if ([view isMemberOfClass:[WizCanvasView class]]) {
        return @"canvas";
    }
    if ([view isMemberOfClass:[UIWebView class]] || [view isMemberOfClass:[UIWebView class]]) {
        return @"webview";
    }

    return @"unknown";
}
@end