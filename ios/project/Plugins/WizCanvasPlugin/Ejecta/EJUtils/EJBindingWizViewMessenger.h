//
// Created by Ally on 9/18/13.
//
// To change the template use AppCode | Preferences | File Templates.
//


#import <Foundation/Foundation.h>
#import "WizCanvasView.h"
#import "EJBindingEventedBase.h"



@interface EJBindingWizViewMessenger : EJBindingEventedBase <EJWindowEventsDelegate> {
    EJWizViewMessengerType binaryType;
    JSObjectRef jsDataObject;
    JSStringRef jsDataName;
}

- (void)message:(id)message;

@end





