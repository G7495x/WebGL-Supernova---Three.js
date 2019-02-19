uniform float uCurliness;
uniform float uReactiveness;
uniform float uTime;

// Internal constants
#define PI_2 1.5707963267948966

// Hash without Sine
// Creative Commons Attribution-ShareAlike 4.0 International Public License
// Created by David Hoskins.
// https://www.shadertoy.com/view/4djSRW
#define HASHSCALE4 vec4(.1031,.1030,.0973,.1099)

// vec4 hash44(vec4 p4){
// 	p4=fract(p4*HASHSCALE4);
// 	p4+=dot(p4,p4.wzxy+19.19);
// 	return fract((p4.xxyz+p4.yzzw)*p4.zywx);
// }

vec3 hash34(vec4 p4){
	p4=fract(p4*HASHSCALE4);
	p4+=dot(p4,p4.wzxy+19.19);
	return fract((p4.xxy+p4.yzz)*p4.zyw);
}

vec3 noise(vec4 p){
	vec4 q=floor(p);
	vec4 s=fract(p);
	float t=s.w;
	s=s*s*(3.-2.*s);
	// s=sin(PI_2*s);
	// s*=s;
	return
	mix(
		mix(
			mix(
				mix(hash34(q)              ,hash34(q+vec4(1,0,0,0)),s.x),
				mix(hash34(q+vec4(0,1,0,0)),hash34(q+vec4(1,1,0,0)),s.x),
				s.y),
			mix(
				mix(hash34(q+vec4(0,0,1,0)),hash34(q+vec4(1,0,1,0)),s.x),
				mix(hash34(q+vec4(0,1,1,0)),hash34(q+vec4(1,1,1,0)),s.x),
				s.y),
			s.z),
		mix(
			mix(
				mix(hash34(q+vec4(0,0,0,1)),hash34(q+vec4(1,0,0,1)),s.x),
				mix(hash34(q+vec4(0,1,0,1)),hash34(q+vec4(1,1,0,1)),s.x),
				s.y),
			mix(
				mix(hash34(q+vec4(0,0,1,1)),hash34(q+vec4(1,0,1,1)),s.x),
				mix(hash34(q+vec4(0,1,1,1)),hash34(q+vec4(1,1,1,1)),s.x),
				s.y),
			s.z),
		// s.w);
		t);
}

vec3 curlNoise(vec4 p){
	const float e=.1;

	vec4 dx=vec4(e,0.,0.,0.);
	vec4 dy=vec4(0.,e,0.,0.);
	vec4 dz=vec4(0.,0.,e,0.);

	vec3 p_x0=noise(p-dx);
	vec3 p_x1=noise(p+dx);
	vec3 p_y0=noise(p-dy);
	vec3 p_y1=noise(p+dy);
	vec3 p_z0=noise(p-dz);
	vec3 p_z1=noise(p+dz);

	float x=p_y1.z-p_y0.z-p_z1.y+p_z0.y;
	float y=p_z1.x-p_z0.x-p_x1.z+p_x0.z;
	float z=p_x1.y-p_x0.y-p_y1.x+p_y0.x;

	const float divisor=1./(2.*e);
	return normalize(vec3(x,y,z)*divisor);
}

void main(){
	vec2 uv=gl_FragCoord.xy/resolution.xy;
	vec3 pos=curlNoise(vec4(texture2D(offset,uv).xyz*uCurliness,uTime*uReactiveness));
	gl_FragColor=vec4(pos,1);
}
