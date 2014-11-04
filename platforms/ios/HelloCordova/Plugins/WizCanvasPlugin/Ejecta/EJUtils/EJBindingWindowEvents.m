#import "EJBindingWindowEvents.h"
#import "WizCanvasView.h"

@implementation EJBindingWindowEvents

- (void)createWithJSObject:(JSObjectRef)obj scriptView:(WizCanvasView *)view {
	[super createWithJSObject:obj scriptView:view];
	scriptView.windowEventsDelegate = self;
}

- (void)pause {
	[self triggerEvent:@"pagehide"];
}

- (void)resume {
	[self triggerEvent:@"pageshow"];
}

- (void)resize {
	[self triggerEvent:@"resize"];
}

EJ_BIND_EVENT(pagehide);
EJ_BIND_EVENT(pageshow);
EJ_BIND_EVENT(resize);

@end
