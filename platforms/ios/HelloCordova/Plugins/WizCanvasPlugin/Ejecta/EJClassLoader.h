#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

@class WizCanvasView;
@interface EJClassLoader : NSObject {
	JSClassRef jsConstructorClass;
	NSMutableDictionary *classCache;
}

- (JSClassRef)getJSClass:(id)class;
- (JSClassRef)createJSClass:(id)class;

- (id)initWithScriptView:(WizCanvasView *)scriptView name:(NSString *)name;

@property (nonatomic, readonly) JSClassRef jsConstructorClass;

@end
