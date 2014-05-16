#import "EJCanvasContext.h"

@class WizCanvasView;
@interface EJCanvasContextWebGL : EJCanvasContext {
	GLuint viewFrameBuffer, viewRenderBuffer;
	GLuint depthStencilBuffer;
	
	GLuint boundFramebuffer;
	GLuint boundRenderbuffer;
	
	GLint bufferWidth, bufferHeight;
	WizCanvasView *scriptView;
	
	float backingStoreRatio;
	BOOL useRetinaResolution;
}

- (id)initWithScriptView:(WizCanvasView *)scriptView width:(short)width height:(short)height;
- (void)bindRenderbuffer;
- (void)bindFramebuffer;
- (void)create;
- (void)prepare;
- (void)clear;

@property (nonatomic) BOOL needsPresenting;
@property (nonatomic) BOOL useRetinaResolution;
@property (nonatomic,readonly) float backingStoreRatio;

@property (nonatomic) GLuint boundFramebuffer;
@property (nonatomic) GLuint boundRenderbuffer;

@end
