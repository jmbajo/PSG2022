// Vertex shader 
var cubeVS = `
	attribute vec3 pos;
	attribute vec3 color;

	uniform mat4 mvp;

	varying vec3 color2fs;
	
	void main()
	{
		color2fs = color;
		gl_Position = mvp * vec4(pos,1);
	}
`;
// Fragment shader 
var cubeFS = `
	precision mediump float;

	varying vec3 color2fs;

	void main()
	{
		gl_FragColor = vec4(color2fs,1);
	}
`;


// Clase que dibuja la caja alrededor de la escena
class Pyramid {
	constructor()
	{

		this.model = glMatrix.mat4.create()

		// 1. Compilamos el programa de shaders
		this.prog = InitShaderProgram( cubeVS, cubeFS );

		// 2. Obtenemos los IDs de las variables uniformes en los shaders
		this.mvp_loc = gl.getUniformLocation( this.prog, 'mvp' );
		
		// 3. Obtenemos los IDs de los atributos de los vértices en los shaders
		this.pos_loc = gl.getAttribLocation( this.prog, 'pos' );
		this.color_loc = gl.getAttribLocation( this.prog, 'color' );


		// 4.  Creamos el buffer para los vertices y subimos data
		let pos = [
			 0,  0,  1, // base
			-1,  0,  0,
			 1,  0,  0,

			 1,  0,  0,	// xz		 
			 0,  1,  0,
			 0,  0,  1,

			 0,  1,  0, // -xz
			-1,  0,  0,
			 0,  0,  1,

			 1,  0,  0, // xy
			-1,  0,  0,
			 0,  1,  0,
		];
		this.vertex_count  = pos.length / 3

		let color = [
			 1,  0,  0,
			 1,  0,  0,
			 1,  0,  0,

			 1,  1,  0,			 
			 1,  1,  0,
			 1,  1,  0,

			 0,  1,  1,
			 0,  1,  1,
			 0,  1,  1,

			 1,  0,  1,
			 1,  0,  1,
			 1,  0,  1,
		];

		
		this.pos_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.pos_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

		
		this.color_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);        
	}

	update() {

	}

    // Esta función se llama para dibujar la caja
	draw( camera )
	{
        // 1. Seleccionamos el shader
		gl.useProgram( this.prog );

		// 1.5 Actualizar la matriz de mvp
		let mvp = mat4.create()
		m4_mult(mvp, m4_mult(mvp, camera.get_proj_mat(), camera.get_view_mat()), this.model);
		console.log("draw", this.model)
		
        // 2. Setear matriz de transformacion
		gl.uniformMatrix4fv( this.mvp_loc, false, mvp );

        // 3.Binding del buffer de posiciones
		gl.bindBuffer( gl.ARRAY_BUFFER, this.pos_buffer );

		gl.vertexAttribPointer( this.pos_loc, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.pos_loc );

		// 4 Binding del buffer de color
		gl.bindBuffer( gl.ARRAY_BUFFER, this.color_buffer );
		
		gl.vertexAttribPointer( this.color_loc, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.color_loc );
		

        // 5. Dibujamos
		gl.drawArrays( gl.TRIANGLES, 0, this.vertex_count);
		
	}
}


