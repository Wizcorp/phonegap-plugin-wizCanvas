/* WizCanvasPlugin - Create a native canvas view.
 *
 * @author Ally Ogilvie
 * @copyright Wizcorp Inc. [ Incorporated Wizards ] 2013
 * @file WizCanvasPlugin.h for PhoneGap
 *
 */ 

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

@interface WizCanvasPlugin : CDVPlugin <UIWebViewDelegate> {
    
    CGRect originalWebViewBounds;

}

@property (nonatomic, retain) NSString *showViewCallbackId;
@property (nonatomic, retain) NSString *hideViewCallbackId;
@property (nonatomic, readwrite, assign) id<UIWebViewDelegate> webviewDelegate;

+ (NSMutableDictionary *)getViews;
+ (NSMutableDictionary *)getViewLoadedCallbackId;
+ (WizCanvasPlugin *)instance;

// PhoneGap APIs
- (void)createView:(CDVInvokedUrlCommand *)command;
- (void)hideView:(CDVInvokedUrlCommand *)command;
- (void)showView:(CDVInvokedUrlCommand *)command;
- (void)load:(CDVInvokedUrlCommand *)command;;
- (void)removeView:(CDVInvokedUrlCommand *)command;
- (void)setLayout:(CDVInvokedUrlCommand *)command;

// Post Message
- (void)postMessage:(NSString *)targetView withMessage:(NSString *)message andMessageType:(NSString *)type fromView:(NSString *)originView;

// Animations
- (void)hideWithNoAnimation:(UIView *)view;
- (void)showWithNoAnimation:(UIView *)view;

- (void)showWithZoomInAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option showViewCallbackId:(NSString *)callbackId viewName:(NSString *)viewName;
- (void)hideWithZoomOutAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option viewName:(NSString *)viewName;
- (void)showWithFadeAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option showViewCallbackId:(NSString *)callbackId viewName:(NSString *)viewName;
- (void)hideWithFadeAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option viewName:(NSString *)viewName;
- (void)showWithSlideInFromLeftAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option showViewCallbackId:(NSString *)callbackId viewName:(NSString *)viewName;
- (void)hideWithSlideOutToLeftAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option viewName:(NSString*)viewName;
- (void)showWithSlideInFromRightAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option showViewCallbackId:(NSString *)callbackId viewName:(NSString *)viewName;
- (void)hideWithSlideOutToRightAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option viewName:(NSString *)viewName;
- (void)showWithSlideInFromTopAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option showViewCallbackId:(NSString *)callbackId viewName:(NSString *)viewName;
- (void)hideWithSlideOutToTopAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option viewName:(NSString *)viewName;
- (void)showWithSlideInFromBottomAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option showViewCallbackId:(NSString *)callbackId viewName:(NSString *)viewName;
- (void)hideWithSlideOutToBottomAnimation:(UIView *)view duration:(float)secs option:(UIViewAnimationOptions)option viewName:(NSString *)viewName;

@end