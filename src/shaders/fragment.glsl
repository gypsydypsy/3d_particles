#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359;

#pragma glslify: cursor = require('./chunks/glsl-cursor.glsl') 
#pragma glslify: tost = require('./chunks/glsl-tost.glsl') 
#pragma glslify: lambert = require(glsl-diffuse-lambert) 

uniform float u_time;
uniform vec2 u_mouse;
uniform float u_curtain;
uniform float u_pixelRatio;
uniform vec2 u_resolution;
uniform vec3 u_lightPosition;
uniform float u_ambientStrength;

varying vec3 v_position;
varying vec3 v_normal;

void main (){
    vec2 st = tost(u_resolution, u_pixelRatio);
    float aspect = u_resolution.x / u_resolution.y;

    // Turn squares into circles
    float dist = distance(gl_PointCoord, vec2(0.5));
    float a = 1. - step(0.5, dist);

    // Black / white color 
    float stcurtain = u_curtain / aspect;
    vec3 black = vec3(0., 0., 0.);
    vec3 white = vec3(1., 1., 1.);

    vec3 lightColor = mix(black, white, step(0., st.y - stcurtain));
   
    // Mouse intersection
    float c = cursor(u_mouse, st, u_resolution, 0.2);

    // Final color

    // Diffuse lightening
    vec3 lightDirection = normalize(u_lightPosition - v_position);
    vec3 norm = normalize(v_normal);
    float diffuseStrength = lambert(lightDirection, norm);
    vec3 diffuse = diffuseStrength * lightColor;
    vec3 ambient = u_ambientStrength * lightColor;

    //color *= diff;
    vec3 color = ambient + diffuse;
    
    gl_FragColor = vec4(color, a);
}