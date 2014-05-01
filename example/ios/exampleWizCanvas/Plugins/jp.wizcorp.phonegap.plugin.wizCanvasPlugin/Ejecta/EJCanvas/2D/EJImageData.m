#import "EJImageData.h"

@implementation EJImageData

@synthesize width, height, pixels, texture;

- (id)initWithWidth:(int)widthp height:(int)heightp pixels:(NSMutableData *)pixelsp {
	if( self = [super init] ) {
		width = widthp;
		height = heightp;
		pixels = [[NSMutableData alloc] initWithData:pixelsp];
	}
	return self;
}

- (void)dealloc {
    [pixels setLength:0];
	[pixels release];
    pixels = nil;
    [texture release];
    texture = nil;
	[super dealloc];
}

- (EJTexture *)texture {
    // Texture has to be created in case pixels has changed
    // TODO: Flag when pixels changes in order to avoid creation at each texture access
    if (texture) {
        [texture release];
        texture = nil;
    }
    texture = [[EJTexture alloc] initWithWidth:width height:height pixels:pixels];
	return texture;
}

@end
