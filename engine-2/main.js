
// Traigo al "namespace" global las declaraciones de la lib glMatrix
m4_mult = glMatrix.mat4.multiply
mat4 = glMatrix.mat4

vec2 = glMatrix.vec2
vec2_add = glMatrix.vec2.add
vec2_normalize = glMatrix.vec2.normalize


vec3 = glMatrix.vec3
vec3_add = glMatrix.vec3.add
vec3_normalize = glMatrix.vec3.normalize

vec4 = glMatrix.vec4

to_rad = glMatrix.glMatrix.toRadian
to_deg = function(rad) {return rad * 180 / Math.PI}

button_clicked = null;

function InitWebGL()
{
	// Inicializamos el canvas WebGL
	canvas = document.getElementById("canvas");
	// canvas.oncontextmenu = function() {return false;};
	gl = canvas.getContext("webgl", {antialias: false, depth: true});	
	if (!gl) 
	{
		alert("Imposible inicializar WebGL. Tu navegador quizás no lo soporte.");
		return;
	}
	
	// Inicializar color clear
	gl.clearColor(0.8, 0.9, 0.9, 1);
	gl.enable(gl.DEPTH_TEST); // habilitar test de profundidad 

	camera = new PerspectiveCamera()
	// camera.look_at(vec3.fromValues(0, -1, 3), vec3.fromValues(0, 0, 0))
	camera.look_at(vec3.fromValues(2, 0, 0), vec3.fromValues(0, 0, 0))

	// [COMPLETAR] Instanciar el objeto
		
	DrawScene()

	// Setear el tamaño del viewport
	UpdateCanvasSize();
}


function WindowResize()
{
	UpdateCanvasSize();
	DrawScene();
}


function DrawScene()
{
	
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	// [COMPLETAR] Invocar a la actulización y dibujado del grafo
	

	
}

function UpdateCanvasSize()
{

	const pixelRatio = window.devicePixelRatio || 1;
	canvas.width     = pixelRatio * canvas.clientWidth;
	canvas.height    = pixelRatio * canvas.clientHeight;

	const width  = (canvas.width  / pixelRatio);
	const height = (canvas.height / pixelRatio);

	canvas.style.width  = width  + 'px';
	canvas.style.height = height + 'px';

	// 2. Lo seteamos en el contexto WebGL
	gl.viewport( 0, 0, canvas.width, canvas.height );

}

var timer;
var t = 0;
window.onload = function() {
	
	InitWebGL();

	// Dibujo la escena
	DrawScene();

	// timer = setInterval( function() 
	// {
	// 	t += 0.02;	
		
	// 	// [COMPLETAR] actulizar la rotación de los astros...

		
	// 	DrawScene();
	// }, 30);

	canvas.onwheel = function() { 
		camera.translateW(-0.0003 * event.deltaY)
		DrawScene()
	}


	// Evento de click 
	canvas.onmousedown = function(e) 
	{
		button_clicked = event.which
		// 1 izquierdo
		// 2 scroll
		// 3 derecho
		
		var down_x = event.clientX;
		var down_y = event.clientY;

		canvas.onmousemove = function() 
			{
				const cam_delta_x =  (event.clientX - down_x)   
				const cam_delta_y =  (event.clientY - down_y) 

				if (button_clicked == 2) {
					camera.set_delta_pitch(cam_delta_y* 0.005);
        			camera.set_delta_yaw(cam_delta_x* 0.005);
				} else {
					camera.translateU(-cam_delta_x * 0.005);
        			camera.translateV(cam_delta_y * 0.005);
				}

				down_x = event.clientX;
				down_y = event.clientY;

				DrawScene();
			}
	}

	// Evento soltar el mouse
	canvas.onmouseup = canvas.onmouseleave = function()
	{
		canvas.onmousemove = null;
	}
	


};


