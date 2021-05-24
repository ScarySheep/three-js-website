uniform vec2 uvScale;
varying vec2 vUv;
varying vec4 worldPosition;
void main()
{

vUv = uvScale * uv;
vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
worldPosition = modelMatrix * vec4(position, 1.0);
gl_Position = projectionMatrix * mvPosition;
}