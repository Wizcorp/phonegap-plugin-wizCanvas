#import <Foundation/Foundation.h>
#import "EJTexture.h"

@interface EJImageData : NSObject {
	int width, height;
	NSMutableData *pixels;
}

- (id)initWithWidth:(int)width height:(int)height pixels:(NSMutableData *)pixels;

@property (nonatomic, retain) EJTexture *texture;
@property (readonly, nonatomic) int width;
@property (readonly, nonatomic) int height;
@property (nonatomic, retain) NSMutableData *pixels;

@end
