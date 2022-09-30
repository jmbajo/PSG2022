// Completar la implementación de esta clase y el correspondiente vertex shader. 
// En principio no es necesario modificar el fragment shader, salvo que quieren modificar el color de la curva
class CurveDrawer 
{
	// Inicialización de los shaders y buffers
	constructor()
	{
		// Creamos el programa webgl con los shaders para los segmentos de recta
		this.prog   = InitShaderProgram( curvesVS, curvesFS );

		// Muestreo del parámetro t: Genero una secuencia de 100 valores reales entre 0 y 1
		this.steps = 100;
		var tv = [];
		for ( var i=0; i<this.steps; ++i ) {
			tv.push( i / (this.steps-1) );
		}
		
		// [Completar] Creacion del vertex buffer y seteo de contenido


		// [Completar] Incialización y obtención de las ubicaciones de los atributos y variables uniformes de los shaders	
		
	}

	// Actualización del viewport (se llama al inicializar la web o al cambiar el tamaño de la pantalla)
	setViewport( width, height )
	{
		const pixelRatio = window.devicePixelRatio || 1;
		canvas.width     = pixelRatio * canvas.clientWidth;
		canvas.height    = pixelRatio * canvas.clientHeight;
		gl.viewport(0, 0, canvas.width, canvas.height);

		// [Completar] Matriz de transformación los puntos están en coordenadas de pantalla. .

		// [Completar] Binding del programa y seteo de la variable uniforme para la matriz. 

	}

	updatePoints( pt )
	{
		// [Completar] Actualización de las variables uniformes para los puntos de control
		// [Completar] No se olviden de hacer el binding del programa antes de setear las variables 
		// [Completar] Pueden acceder a las coordenadas de los puntos de control consultando el arreglo pt[]:
		// var x = pt[i].getAttribute("cx");
		// var y = pt[i].getAttribute("cy");

	}

	draw()
	{

		
		// [Completar] Dibujamos la curva como una LINE_STRIP
		// [Completar] No se olviden de hacer el binding del programa y de habilitar los atributos de los vértices
		// [Completar] Setear los valores uniformes del Vertex shader.
	}
}

// Vertex Shader
//[Completar] El vertex shader se ejecuta una vez por cada punto en mi curva (parámetro step). No confundir punto con punto de control.
// Deberán completar con la definición de una Bezier Cúbica para un punto t. Algunas consideraciones generales respecto a GLSL: si
// declarás las variables pero no las usás, no se les asigna espacio. Siempre poner ; al finalizar las sentencias. Las constantes
// en punto flotante necesitan ser expresadas como X.Y, incluso si son enteros: ejemplo, para 4 escribimos 4.0
var curvesVS = `
	attribute float t;

	uniform mat4 mvp;
	
	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;

	void main()
	{ 
		[completar]

		gl_Position = mvp * vec4(..., 1);

	}
`;

// Fragment Shader
var curvesFS = `
	precision mediump float;

	void main()
	{
		[ Salvo que te moleste que se vea azul, no deberías tocarlo :P ]
		gl_FragColor = vec4(0,0,1,1);
	}
`;
