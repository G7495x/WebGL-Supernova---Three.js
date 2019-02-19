uniform float     uParticleSpeed;
uniform float     uSphereRadius;
uniform float     uTexBatchHeight;
uniform sampler2D uSphere;

void main(){
	vec2 uv=gl_FragCoord.xy/resolution.xy;

	if(gl_FragCoord.y<=uTexBatchHeight){
		uv.y=gl_FragCoord.y/uTexBatchHeight;
		gl_FragColor=vec4(texture2D(uSphere,uv).xyz*uSphereRadius,1.);
	}
	else{
		uv.y=(gl_FragCoord.y-uTexBatchHeight)/resolution.y;
		gl_FragColor=texture2D(offset,uv)+vec4(texture2D(direction,uv).xyz*uParticleSpeed,1.);
	}
}
