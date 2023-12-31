#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359;

uniform float u_time;
uniform vec2 u_mouse;
uniform float u_pixelRatio;
uniform vec2 u_resolution;
uniform float u_speed;
uniform float u_scale;
uniform float u_curlFreq;
uniform float u_curlAmp;
uniform float u_maxDist;
uniform float u_power;
uniform float u_noiseAmp;
uniform float u_noiseFreq;
varying vec3 v_position;
varying vec3 v_normal;

#pragma glslify: curlNoise = require('./chunks/glsl-curl-noise.glsl') 
#pragma glslify: simplex = require('glsl-noise/simplex/3d.glsl')

void main () {
    v_position = position;
    v_normal = normal;

    vec3 pos = position;
    float time = u_time * u_speed;

    // Curl
    vec3 c = curlNoise(position * u_curlFreq + time) * u_curlAmp;
    float d = length(position - c) / (u_maxDist - abs(u_mouse.y));
    pos = mix(position, c, pow(d, u_power));

    // Noise
    float n = simplex((pos + u_time * 0.1 + u_mouse.y * 0.1) * u_noiseFreq) * u_noiseAmp;
    pos += n;

    // Scale
    pos *= u_scale;

    vec4 modelPosition = modelMatrix * vec4(pos, 1.);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    gl_PointSize = 15. / - viewPosition.z;

}