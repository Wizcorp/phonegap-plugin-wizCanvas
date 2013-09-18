#import <JavaScriptCore/JSTypedArray.h>
#import "EJBindingWindowEvents.h"
#import "WizCanvasView.h"

@implementation EJBindingWindowEvents

- (id)initWithContext:(JSContextRef)ctx argc:(size_t)argc argv:(const JSValueRef [])argv {
    if (self = [super initWithContext:ctx argc:argc argv:argv]) {
        jsDataObject = JSObjectMake(ctx, NULL, NULL);
        JSValueProtect(ctx, jsObject);
        // Create the name of the object we will send back in the message event
        jsDataName = JSStringCreateWithUTF8CString("data");
    }
    return self;
}

- (void)createWithJSObject:(JSObjectRef)obj scriptView:(WizCanvasView *)view {
	[super createWithJSObject:obj scriptView:view];
	scriptView.windowEventsDelegate = self;
}

- (void)pause {
	[self triggerEvent:@"pagehide" argc:0 argv:NULL];
}

- (void)resume {
	[self triggerEvent:@"pageshow" argc:0 argv:NULL];
}

- (void)resize {
	[self triggerEvent:@"resize" argc:0 argv:NULL];
}

- (void)message:(id)message {
    NSLog(@"message me: %@", message);

    // A fake post message event
    JSValueRef jsMessage = NULL;
    JSContextRef ctx = scriptView.jsGlobalContext;

    // String?
    if ( [message isKindOfClass:[NSString class]] ) {
        NSLog(@"jsDataObject: %@", jsDataObject);
        jsMessage = NSStringToJSValue(ctx, message);
    } else if ( [message isKindOfClass:[NSData class]] ) {
        // TypedArray
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

EJ_BIND_EVENT(pagehide);
EJ_BIND_EVENT(pageshow);
EJ_BIND_EVENT(resize);
EJ_BIND_EVENT(message);

@end
