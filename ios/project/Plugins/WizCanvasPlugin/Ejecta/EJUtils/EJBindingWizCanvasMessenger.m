#import <JavaScriptCore/JSTypedArray.h>
#import "EJBindingWizCanvasMessenger.h"
#import "WizCanvasPlugin.h"
#import "NSString+URLEncoding.h"

@implementation EJBindingWizCanvasMessenger {

}

- (id)initWithContext:(JSContextRef)ctxp argc:(size_t)argc argv:(const JSValueRef [])argv {
    NSLog(@"Creating WizViewMessenger for Ejecta");
    if (self = [super initWithContext:ctxp argc:argc argv:argv]) {
        if( argc > 0 ) {
            // Get viewName from constructor
            viewName = [JSValueToNSString(ctxp, argv[0]) retain];
        } else {

        }
    }
    return self;
}

- (void)dealloc {
	[viewName release];
    viewName = nil;
	[super dealloc];
}

// For sending messages into Ejecta and dispatching 'message' event
EJ_BIND_FUNCTION(__triggerMessageEvent, ctx, argc, argv) {
    NSString *origin;
    NSString *targetView;
    NSString *data;
    NSString *type;
    if( argc > 3 ) {
        // Get args
        // 0: originView, 1: targetView, 2: postDataEscaped, 3:type

        origin = JSValueToNSString(ctx, argv[0]);
        targetView = JSValueToNSString(ctx, argv[1]);
        data = JSValueToNSString(ctx, argv[2]);
        data = [data urlDecodeUsingEncoding:NSUTF8StringEncoding];
        type = JSValueToNSString(ctx, argv[3]);
        NSLog(@"type: %@", type);
    } else {
        NSLog(@"WizViewMessenger for Ejecta - Error missing arguments in postMessage");
        return NULL;
    }

    NSLog(@"Sending message into Ejecta");

    if([type isEqualToString:@"Array"]) {
        NSLog(@"Message as Array");
        JSValueRef arrayData = JSValueMakeFromJSONString(ctx, JSStringCreateWithCFString((__bridge CFStringRef)data));
        [self triggerEvent:@"message" properties:(JSEventProperty[]) {
                {"data", arrayData},
                {"origin", NSStringToJSValue(ctx, origin)},
                {"source", JSValueMakeBoolean(ctx, targetView)},
                {NULL, NULL},
        }];

    } else if( [type isEqualToString:@"String"] ) {
        NSLog(@"Message as String");
        [self triggerEvent:@"message" properties:(JSEventProperty[]) {
                {"data", NSStringToJSValue(ctx, data)},
                {"origin", NSStringToJSValue(ctx, origin)},
                {"source", JSValueMakeBoolean(ctx, targetView)},
                {NULL, NULL},
        }];

    } else if( [type isEqualToString:@"Number"] ) {
        NSLog(@"Message as Number");
        [self triggerEvent:@"message" properties:(JSEventProperty[]) {
                {"data", JSValueMakeNumber(ctx, [data doubleValue])},
                {"origin", NSStringToJSValue(ctx, origin)},
                {"source", JSValueMakeBoolean(ctx, targetView)},
                {NULL, NULL},
        }];


    } else if( [type isEqualToString:@"Boolean"] ) {
        NSLog(@"Message as Boolean");
        [self triggerEvent:@"message" properties:(JSEventProperty[]) {
                {"data", JSValueMakeBoolean(ctx, data)},
                {"origin", NSStringToJSValue(ctx, origin)},
                {"source", JSValueMakeBoolean(ctx, targetView)},
                {NULL, NULL},
        }];

    } else if( [type isEqualToString:@"Function"] ) {
        NSLog(@"Message as Function");
        // W3C says nothing about functions, will be returned as String type.
        [self triggerEvent:@"message" properties:(JSEventProperty[]) {
                {"data", NSStringToJSValue(ctx, data)},
                {"origin", NSStringToJSValue(ctx, origin)},
                {"source", JSValueMakeBoolean(ctx, targetView)},
                {NULL, NULL},
        }];

    } else if( [type isEqualToString:@"Object"] ) {
        NSLog(@"Message as Object");
        JSValueRef objData = JSValueMakeFromJSONString(ctx, JSStringCreateWithCFString((__bridge CFStringRef) data));
        [self triggerEvent:@"message" properties:(JSEventProperty[]) {
                {"data", objData},
                {"origin", NSStringToJSValue(ctx, origin)},
                {"source", JSValueMakeBoolean(ctx, targetView)},
                {NULL, NULL},
        }];
    }

    return NULL;
}

// For sending out messages
EJ_BIND_FUNCTION(postMessage, ctx, argc, argv ) {

    NSLog(@"postMessage from Ejecta");
    if( argc < 2 ) {
        NSLog(@"WizViewMessenger Error : Not enough params supplied to wizViewMessenger.postMessage(<target>, <data>)");
        return NULL;
    }

    JSType *js_type = JSValueGetType(ctx, argv[0]);

    // Check raw data type
    NSString *type;
    if (js_type == kJSTypeBoolean) {
        type = @"Boolean";
    } else if (js_type == kJSTypeNumber) {
        type = @"Number";
    } else if (js_type == kJSTypeString) {
        type = @"String";
    } else if (js_type == kJSTypeObject) {
        type = @"Object";
    }

    // Stringify our data using JavaScriptCore
    JSStringRef scriptJS = JSStringCreateWithUTF8CString("return JSON.stringify( arguments[0] )");
    JSObjectRef fn = JSObjectMakeFunction(ctx, NULL, 0, NULL, scriptJS, NULL, 1, NULL);
    JSValueRef result = JSObjectCallAsFunction(ctx, fn, NULL, 1, argv, NULL);
    NSString *message = JSValueToNSString(ctx, result);
    NSString *targetName = JSValueToNSString( ctx, argv[1] );

    // Send our message to the target view
    WizCanvasPlugin *wizCanvasView = [WizCanvasPlugin instance];
    [wizCanvasView postMessage:targetName withMessage:message andMessageType:type fromView:viewName];
    return NULL;
}

EJ_BIND_EVENT(message);

@end