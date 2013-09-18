#import "EJBindingEventedBase.h"
#import "WizCanvasView.h"

typedef enum {
    kEJWebSocketBinaryTypeBlob,
    kEJWebSocketBinaryTypeArrayBuffer
} EJWizViewMessengerType;

@interface EJBindingWindowEvents : EJBindingEventedBase <EJWindowEventsDelegate> {
    EJWizViewMessengerType binaryType;
    JSObjectRef jsDataObject;
    JSStringRef jsDataName;
}

- (void)pause;
- (void)resume;
- (void)resize;
- (void)message:(id)message;

@end
