
// Esta función recibe la matriz de proyección (ya calculada), una traslación y dos ángulos de rotación
// (en radianes). Cada una de las rotaciones se aplican sobre el eje x e y, respectivamente. La función
// debe retornar la combinación de las transformaciones 3D (rotación, traslación y proyección) en una matriz
// de 4x4, representada por un arreglo en formato column-major. El parámetro projectionMatrix también es 
// una matriz de 4x4 alamcenada como un arreglo en orden column-major. En el archivo project4.html ya está
// implementada la función MatrixMult, pueden reutilizarla. 

function GetModelViewProjection( projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY )
{
	// [COMPLETAR] Modificar el código para formar la matriz de transformación.

	// Matriz de traslación
	var trans = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];

	var model = // [COMPLETAR]

	var mvp = MatrixMult( projectionMatrix, model );

	return mvp;
}




















// [COMPLETAR] Completar la implementación de esta clase.
// class MeshDrawer
// {
// 	// El constructor es donde nos encargamos de realizar las inicializaciones necesarias. 
// 	constructor()
// 	{
// 		// [COMPLETAR] inicializaciones

// 		// 1. Compilamos el programa de shaders
		
// 		// 2. Obtenemos los IDs de las variables uniformes en los shaders

// 		// 3. Obtenemos los IDs de los atributos de los vértices en los shaders

// 		// 4. Obtenemos los IDs de los atributos de los vértices en los shaders

// 		// ...
// 	}
	
// 	// Esta función se llama cada vez que el usuario carga un nuevo archivo OBJ.
// 	// En los argumentos de esta función llegan un areglo con las posiciones 3D de los vértices
// 	// y un arreglo 2D con las coordenadas de textura. Todos los items en estos arreglos son del tipo float. 
// 	// Los vértices se componen de a tres elementos consecutivos en el arreglo vertexPos [x0,y0,z0,x1,y1,z1,..,xn,yn,zn]
// 	// De manera similar, las cooredenadas de textura se componen de a 2 elementos consecutivos y se 
// 	// asocian a cada vértice en orden. 
// 	setMesh( vertPos, texCoords )
// 	{
// 		// [COMPLETAR] Actualizar el contenido del buffer de vértices
// 		this.numTriangles = vertPos.length / 3 / 3;
// 	}
	
// 	// Esta función se llama cada vez que el usuario cambia el estado del checkbox 'Intercambiar Y-Z'
// 	// El argumento es un boleano que indica si el checkbox está tildado
// 	swapYZ( swap )
// 	{
// 		// [COMPLETAR] Setear variables uniformes en el vertex shader
// 	}
	
// 	// Esta función se llama para dibujar la malla de triángulos
// 	// El argumento es la matriz de transformación, la misma matriz que retorna GetModelViewProjection
// 	draw( trans )
// 	{
// 		// [COMPLETAR] Completar con lo necesario para dibujar la colección de triángulos en WebGL
		
// 		// 1. Seleccionamos el shader
	
// 		// 2. Setear matriz de transformacion
		
// 	    // 3.Binding de los buffers
		
// 		// ...
// 		// Dibujamos
// 		// gl.drawArrays( gl.TRIANGLES, 0, this.numTriangles * 3 );
// 	}
	
// 	// Esta función se llama para setear una textura sobre la malla
// 	// El argumento es un componente <img> de html que contiene la textura. 
// 	setTexture( img )
// 	{
// 		// [COMPLETAR] Binding de la textura
// 	}
	
// 	// Esta función se llama cada vez que el usuario cambia el estado del checkbox 'Mostrar textura'
// 	// El argumento es un boleano que indica si el checkbox está tildado
// 	showTexture( show )
// 	{
// 		// [COMPLETAR] Setear variables uniformes en el fragment shader
// 	}
// }

// Vertex Shader
// Si declaras las variables pero no las usas es como que no las declaraste y va a tirar error. Siempre va punto y coma al finalizar la sentencia. 
// Las constantes en punto flotante necesitan ser expresadas como x.y, incluso si son enteros: ejemplo, para 4 escribimos 4.0
// var meshVS = `
// 	attribute vec3 pos;
// 	uniform mat4 mvp;
// 	void main()
// 	{ 
// 		gl_Position = mvp * vec4(pos,1);
// 	}
// `;

// // Fragment Shader
// var meshFS = `
// 	precision mediump float;
// 	void main()
// 	{		
// 		gl_FragColor = vec4( 1, 0, 0, 1 );
// 	}
// `;
