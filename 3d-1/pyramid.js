// Vertex shader 
var cubeVS = `
	attribute vec3 pos;
	attribute vec3 color;

	uniform mat4 mvp;

	// [COMPLETAR] Pasar color a FS
	
	void main()
	{
		gl_Position = mvp * vec4(pos,1);
	}
`;
// Fragment shader 
var cubeFS = `
	precision mediump float;

	void main()
	{
		gl_FragColor = vec4(color2fs,1);
	}
`;


// Clase que dibuja la caja alrededor de la escena
class Pyramid {
	constructor()
	{
		// 1.  [COMPLETAR] Compilamos el programa de shaders
		
		
		// 2.  [COMPLETAR] Obtenemos los IDs de las variables uniformes en los shaders
		
		
		// 3.  [COMPLETAR] Obtenemos los IDs de los atributos de los vértices en los shaders
		
		
		// 4.  [COMPLETAR] Creamos el buffer para los vertices		
		

        // 4 caras pirámide
		var pos = [
			 // [COMPLETAR] Especificar posiciones de los vértices
		];


		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

		this.colorbuffer = gl.createBuffer();

		var color = [
			 // [COMPLETAR]  Especificar colores
		];


		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
        
	}

    // Esta función se llama para dibujar la caja
	draw( trans )
	{
        // 1. Seleccionamos el shader
		gl.useProgram( this.prog );

        // 2. Setear matriz de transformacion
		gl.uniformMatrix4fv( this.mvp, false, trans );

        //  [COMPLETAR] 3.Binding del buffer de posiciones
		

        //  [COMPLETAR] 4. Habilitamos el atributo 

        //  [COMPLETAR] 5. Lo mismo pero para color
		
		

		// 5.  [COMPLETAR] Dibujamos
		
	}
}


