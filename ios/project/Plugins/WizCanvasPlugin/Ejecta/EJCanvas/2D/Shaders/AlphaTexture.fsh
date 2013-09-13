varying lowp vec4 vColor;
varying mediump vec2 vUv;

uniform sampler2D texture;

void main() {
	gl_FragColor = texture2D(texture, vUv).aaaa * vColor;
}
