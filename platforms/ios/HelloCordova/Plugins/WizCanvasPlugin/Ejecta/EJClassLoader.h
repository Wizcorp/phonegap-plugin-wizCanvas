#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

@class WizCanvasView;
@class EJLoadedJSClass;
@interface EJClassLoader : NSObject {
	JSClassRef jsConstructorClass;
	NSMutableDictionary *classCache;
}

- (EJLoadedJSClass *)getJSClass:(id)class;
- (EJLoadedJSClass *)loadJSClass:(id)class;

- (id)initWithScriptView:(WizCanvasView *)scriptView name:(NSString *)name;

@property (nonatomic, readonly) JSClassRef jsConstructorClass;

@end


@interface EJLoadedJSClass : NSObject {
	JSClassRef jsClass;
	NSDictionary *constantValues;
}

- (id)initWithJSClass:(JSClassRef)jsClassp constantValues:(NSDictionary *)constantValuesp;
@property (readonly) JSClassRef jsClass;
@property (readonly) NSDictionary *constantValues;
@end
