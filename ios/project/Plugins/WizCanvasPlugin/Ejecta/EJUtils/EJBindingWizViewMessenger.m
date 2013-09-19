//
// Created by Ally on 9/18/13.
//
// To change the template use AppCode | Preferences | File Templates.
//


#import <JavaScriptCore/JSTypedArray.h>
#import "EJBindingWizViewMessenger.h"


@implementation EJBindingWizViewMessenger {

}

- (id)initWithContext:(JSContextRef)ctx argc:(size_t)argc argv:(const JSValueRef [])argv {
    if (self = [super initWithContext:ctx argc:argc argv:argv]) {
        if( argc > 0 ) {
            // Get args
            // example = [JSValueToNSString(ctx, argv[0]) retain];
        } else {

        }

        jsDataObject = JSObjectMake(ctx, NULL, NULL);
        JSValueProtect(ctx, jsObject);
        // Create the name of the object we will send back
        jsDataName = JSStringCreateWithUTF8CString("data");
    }
    return self;
}

- (void)createWithJSObject:(JSObjectRef)obj scriptView:(WizCanvasView *)view {
    [super createWithJSObject:obj scriptView:view];
    scriptView.windowEventsDelegate = self;
}

- (void)message:(id)message {

    JSValueRef jsMessage = NULL;
    JSContextRef ctx = scriptView.jsGlobalContext;

    // String?
    if( [message isKindOfClass:[NSString class]] ){
        jsMessage = NSStringToJSValue(ctx, message);
    }

    // TypedArray
    else if( [message isKindOfClass:[NSData class]] ) {
        NSData *data = (NSData *)message;


        if ( binaryType == kJSTypedArrayTypeArrayBuffer ) {
            jsMessage = JSTypedArrayMake(ctx, kJSTypedArrayTypeArrayBuffer, data.length);
            memcpy(JSTypedArrayGetDataPtr(ctx, jsMessage, NULL), data.bytes, data.length);
        } else {
            NSLog(@"WizViewMessenger Error: unsupported or unknown arrayType. Use 'arraybuffer' instead?");
            return;
        }
    }

    JSObjectSetProperty(ctx, jsDataObject, jsDataName, jsMessage, kJSPropertyAttributeNone, NULL);
    [self triggerEvent:@"message" argc:1 argv:(JSValueRef[]){ jsDataObject }];

}

EJ_BIND_EVENT(message);

@end