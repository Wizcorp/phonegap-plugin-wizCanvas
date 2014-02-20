#import <Foundation/Foundation.h>
#import "EJBindingEventedBase.h"
#import "WizCanvasView.h"

@interface EJBindingWindowEvents : EJBindingEventedBase <EJWindowEventsDelegate> {
    JSObjectRef jsDataObject;
    JSStringRef jsDataName;
}

- (void)pause;
- (void)resume;
- (void)resize;

@end
