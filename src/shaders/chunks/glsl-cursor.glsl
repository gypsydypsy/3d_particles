/* 
*   Transform the mouse position into a circle
    Use in fragment Shader only
    Use with glFragCoord scale -1 <> 1 (./glsl-tost.glsl)

    Params :
        > _mousePos : normalized mouse Position on screen, scale -1 <> 1
        > _st -1 <> 1 fragCoords
        > _res : canvas.width, canvas.height
        > _radius : desired circle width
*/

float cursor (vec2 _mousePos, vec2 _st ,vec2 _res, float _radius)
{
    float aspect = _res.x / _res.y;
    vec2 mouse = _mousePos / vec2(1., aspect);

    float dist = distance(mouse, _st);
    float c = 1. - step(_radius, dist);

    return c;
}
#pragma glslify: export(cursor) 