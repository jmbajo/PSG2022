// Clase que dibuja la caja alrededor de la escena
class BoxDrawer 
{
	constructor(mode)
	{
		this.mode = mode // "lines" o "polygon"

		// 1. Compilamos el programa de shaders
		this.prog = InitShaderProgram( boxVS, boxFS );
		
		// 2. Obtenemos los IDs de las variables uniformes en los shaders
		this.mvp = gl.getUniformLocation( this.prog, 'mvp' );
		
		// 3. Obtenemos los IDs de los atributos de los vértices en los shaders
		this.vertPos = gl.getAttribLocation( this.prog, 'pos' );
		
		// 4. Creamos el buffer para los vertices				
		this.posbuffer = gl.createBuffer();

		// 8 caras del cubo unitario
		this.pos = [
			-1, -1, -1,
			-1, -1,  1,
			-1,  1, -1,
			-1,  1,  1,
			 1, -1, -1,
			 1, -1,  1,
			 1,  1, -1,
			 1,  1,  1 ];
		gl.bindBuffer(gl.ARRAY_BUFFER, this.posbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.pos), gl.STATIC_DRAW);

		// Conectividad de las lineas
		this.indicesbuffer = gl.createBuffer();

		if (this.mode == "lines") 
			this.indices = [
				0,1,   1,3,   3,2,   2,0,
				4,5,   5,7,   7,6,   6,4,
				0,4,   1,5,   3,7,   2,6 
			];
		else 
			this.indices = [
				1,0,4,  1,4,5,
				3,6,2,  3,7,6,
				3,2,0,  3,0,1,
				4,6,7,  5,4,7,
				0,2,4,  4,2,6,
				1,5,7,  7,3,1
			];	
				

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesbuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(this.indices), gl.STATIC_DRAW);
	}

	// Esta función se llama para dibujar la caja
	draw( trans )
	{
		// 1. Seleccionamos el shader
		gl.useProgram( this.prog );
		

		// 2. Setear matriz de transformacion
		gl.uniformMatrix4fv( this.mvp, false, trans );

		 // 3.Binding del buffer de posiciones
		gl.bindBuffer( gl.ARRAY_BUFFER, this.posbuffer );

		// 4. Habilitamos el atributo 
		gl.vertexAttribPointer( this.vertPos, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.vertPos );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indicesbuffer );

		// 5. Dibujamos
		// gl.disable(gl.CULL_FACE);
		if (this.mode == "lines") 
			gl.drawElements( gl.LINES, 24, gl.UNSIGNED_BYTE, 0 );
		else 
			gl.drawElements( gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0 );	
		
		// gl.enable(gl.CULL_FACE);
	}
}

// Vertex shader 
var boxVS = `
	attribute vec3 pos;
	uniform mat4 mvp;
	void main()
	{
		gl_Position = mvp * vec4(pos,1);
	}
`;

// Fragment shader 
var boxFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(1,1,1,1);
	}
`;
