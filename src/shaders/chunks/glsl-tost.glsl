/*  
*   Converts pixels to normalize scale -1 <> 1
*   Use in Fragment Shader only
*   Params: 
        > _res : canva.width, canvas.height
        > pixelRatio : renderer devicePixelRatio
*/

vec2 tost (vec2 _res, float _pixelRatio)
{
    vec2 viewport = (gl_FragCoord.xy / _res) / _pixelRatio * 2. - 1.;
    float aspect = _res.x / _res.y;
    vec2 st = viewport / vec2(1., aspect);
    
    return st;
}

#pragma glslify: export(tost) 