// Rev - v2018.12.20

const piBy180=Math.PI/180

// Add leading zeros until size
//   Usage: n.pad(5)
Number.prototype.pad=function(size){
	let s=String(this)
	while(s.length<size)s='0'+s
	return s
}

let isInFullscreen=false
const openFullscreen=(ele=document.body)=>{
	isInFullscreen=true
	if(ele.requestFullscreen)ele.requestFullscreen()
	else if(ele.mozRequestFullScreen)ele.mozRequestFullScreen()
	else if(ele.webkitRequestFullscreen)ele.webkitRequestFullscreen()
	else if(ele.msRequestFullscreen)ele.msRequestFullscreen()
}
const closeFullscreen=()=>{
	isInFullscreen=false
	if(document.exitFullscreen)document.exitFullscreen()
	else if(document.mozCancelFullScreen)document.mozCancelFullScreen()
	else if(document.webkitExitFullscreen)document.webkitExitFullscreen()
	else if(document.msExitFullscreen)document.msExitFullscreen()
}

// Synchronous HTTP Request to get contents
const httpGetText=(url)=>{
	const request=new XMLHttpRequest()
	request.open('GET',url,false)
	request.send()
	return request.responseText
}

// GLSL like clamp()implementation
const clamp=(min,max,p)=>{
	return Math.max(min,Math.min(max,p))
}

const getUrlParam=(param)=>{
	return new URLSearchParams(window.location.search).get(param)
}

// Return points on surface of sphere through Fibonacci Algorithm
const fibonacciSpherePoints=(samples=1,radius=1,randomize=false)=>{
	// Translated from Python from https:// stackoverflow.com/a/26127012
	let random=1
	if(randomize){
		random=Math.random()*samples
	}
	let points=new Float32Array(samples*3)
	let offset=2/samples
	let increment=Math.PI*(3-Math.sqrt(5))
	for(let i=0,j=0;i<samples;i++){
		let y=((i*offset)-1)+(offset/2)
		let distance=Math.sqrt(1-Math.pow(y,2))
		let phi=((i+random)%samples)*increment
		let x=Math.cos(phi)*distance
		let z=Math.sin(phi)*distance
		points[j++]=x*radius
		points[j++]=y*radius
		points[j++]=z*radius
	}
	return points
}

const canvasToImg=(c)=>{
	// For screenshots to work with WebGL renderer,
	// preserveDrawingBuffer in the constructor should be set to true.
	// Open in new window like this.
	let w=window.open('','')
	let img=new Image()
	img.src=c.toDataURL()
	w.document.body.appendChild(img)

	// Download file like this.
	// let a=document.createElement('a')
	// a.href=c.toDataURL().replace('image/png','image/octet-stream')
	// a.download='canvas.png'
	// a.click()
}
