function GetModelViewMatrix( translationX, translationY, translationZ, rotationX, rotationY )
{
	// [COMPLETAR] Modificar el código para formar la matriz de transformación.
	var rx = [
			1,               0,              0,  0,
			0,  Math.cos(rotationX), Math.sin(rotationX),  0,
			0, -Math.sin(rotationX), Math.cos(rotationX),  0,
			0,               0,              0,  1,

		]

	var ry = [
			Math.cos(rotationY),  0,  -Math.sin(rotationY),  0,
			0,               1,                0,  0,
			Math.sin(rotationY),  0,   Math.cos(rotationY),  0,
			0,               0,              0,    1,
		]

	// Matriz de traslación
	var trans = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];


	var mv = MatrixMult(trans, MatrixMult(ry, rx))
	return mv;
}

// [COMPLETAR] Completar la implementación de esta clase.
class MeshDrawer
{
	// El constructor es donde nos encargamos de realizar las inicializaciones necesarias. 
	constructor()
	{
		// [COMPLETAR] inicializaciones

		// 1. Compilamos el programa de shaders
		this.prog = InitShaderProgram( meshVS, meshFS );
		
		// 2. Obtenemos los IDs de las variables uniformes en los shaders
		this.mvp_loc = gl.getUniformLocation( this.prog, 'mvp' );
		this.mv_loc = gl.getUniformLocation( this.prog, 'mv' );
		
		// COMPLETAR Obtener ids del sampler
		

		// 3. Obtenemos los IDs de los atributos de los vértices en los shaders
		this.pos_loc = gl.getAttribLocation( this.prog, 'pos' );
		this.normal_loc = gl.getAttribLocation( this.prog, 'normal' );

		// 4. Creamos los buffers
		this.pos_buffer = gl.createBuffer();
		this.normal_buffer = gl.createBuffer();
		this.tangent_buffer = gl.createBuffer();

		this.tex_coord_buffer = gl.createBuffer();

		// this.textura = gl.createTexture()
		this.normal_map = gl.createTexture()
		this.env_map = gl.createTexture();

	}

	
	// Esta función se llama cada vez que el usuario carga un nuevo
	// archivo OBJ. En los argumentos de esta función llegan un areglo
	// con las posiciones 3D de los vértices, un arreglo 2D con las
	// coordenadas de textura y las normales correspondientes a cada 
	// vértice. Todos los items en estos arreglos son del tipo float. 
	// Los vértices y normales se componen de a tres elementos 
	// consecutivos en el arreglo vertPos [x0,y0,z0,x1,y1,z1,..] y 
	// normals [n0,n0,n0,n1,n1,n1,...]. De manera similar, las 
	// cooredenadas de textura se componen de a 2 elementos 
	// consecutivos y se  asocian a cada vértice en orden. 
	setMesh( vertPos, texCoords, normals )
	{
		// [COMPLETAR] Actualizar el contenido del buffer de vértices y otros atributos..
		this.numTriangles = vertPos.length / 3 / 3;
		console.log(this.numTriangles)

		// 1. Binding y seteo del buffer de posiciones
		gl.bindBuffer(gl.ARRAY_BUFFER, this.pos_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

		// 2. Binding y seteo del buffer de normales	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

	}
	

	
	// Esta función se llama para dibujar la malla de triángulos
	// El argumento es la matriz model-view-projection (matrixMVP),
	// la matriz model-view (matrixMV) que es retornada por 
	// GetModelViewProjection y la matriz de transformación de las 
	// normales (matrixNormal) que es la inversa transpuesta de matrixMV
	draw( matrixMVP, matrixMV, matrixNormal )
	{
		// [COMPLETAR] Completar con lo necesario para dibujar la colección de triángulos en WebGL
		
		// 1. Seleccionamos el shader
		gl.useProgram(this.prog)
	
		// 2. Setear uniformes con las matrices de transformaciones
		var ident = [ 1, 0, 0, 0,
					  0, 1, 0, 0,
					  0, 0, 1, 0,
					  0, 0, 0, 1]

		gl.uniformMatrix4fv( this.mvp_loc, false, matrixMVP );
		gl.uniformMatrix4fv( this.mv_loc, false, matrixMV );
		// gl.uniformMatrix4fv( this.m_loc, false, ident );
		// gl.uniformMatrix4fv( this.m_inv_t_loc, false, matrixNormal );

   		// 3. Habilitar atributos: vértices, normales, texturas
		gl.bindBuffer( gl.ARRAY_BUFFER, this.pos_buffer );

		gl.vertexAttribPointer( this.pos_loc, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.pos_loc );

		// 4 Binding del buffer de color
		gl.bindBuffer( gl.ARRAY_BUFFER, this.normal_buffer );
		
		gl.vertexAttribPointer( this.normal_loc, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.normal_loc );

		// COMPLETAR Activar la texturas y asignar el texture unit

		gl.drawArrays( gl.TRIANGLES, 0, this.numTriangles * 3 );
	}
	
	// Esta función se llama para setear una textura sobre la malla
	// El argumento es un componente <img> de html que contiene la textura. 
	setTexture( img )
	{
		return;
		console.log(img)
		// [COMPLETAR] Binding de la textura
		gl.bindTexture(gl.TEXTURE_2D, this.textura)

		// Pueden setear la textura utilizando esta función:
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img );
		gl.generateMipmap(gl.TEXTURE_2D)

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
       
		gl.useProgram(this.prog)
		gl.uniform1i(this.tex_sampler, 0)
		
	}

	setEnvMap(img, code) 
	{
		
		// COMPLETAR

	}

	setNormalMap( img )
	{
		return;
		console.log(img)
		// [COMPLETAR] Binding de la textura
		gl.bindTexture(gl.TEXTURE_2D, this.normal_map)

		// Pueden setear la textura utilizando esta función:
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img );
		gl.generateMipmap(gl.TEXTURE_2D)

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

		gl.useProgram(this.prog)
		gl.uniform1i(this.normal_map_sampler, 1)
		
	}
		
        // Esta función se llama cada vez que el usuario cambia el estado del checkbox 'Mostrar textura'
	// El argumento es un boleano que indica si el checkbox está tildado
	showTexture( show )
	{
		// [COMPLETAR] Setear variables uniformes en el fragment shader para indicar si debe o no usar la textura

		// gl.useProgram(this.prog)
		// if (show)
		// 	gl.uniform1i(this.with_tex, 1)
		// else 
		// 	gl.uniform1i(this.with_tex, 0)

		
		
	}
	
	// Este método se llama al actualizar la dirección de la luz desde la interfaz
	setLightDir( x, y, z )
	{		
		// [COMPLETAR] Setear variables uniformes en el fragment shader para especificar la dirección de la luz
		gl.useProgram(this.prog)
		gl.uniform3f(this.light_dir, x, y, z)
	}
		
	// Este método se llama al actualizar el brillo del material 
	setShininess( shininess )
	{		
		// [COMPLETAR] Setear variables uniformes en el fragment shader para especificar el brillo.
		gl.useProgram(this.prog);
		gl.uniform1f(this.alpha, shininess);
	}
}



// [COMPLETAR] Calcular iluminación utilizando Blinn-Phong.

// Recordar que: 
// Si declarás las variables pero no las usás, es como que no las declaraste
// y va a tirar error. Siempre va punto y coma al finalizar la sentencia. 
// Las constantes en punto flotante necesitan ser expresadas como x.y, 
// incluso si son enteros: ejemplo, para 4 escribimos 4.0.

// Vertex Shader
var meshVS = `
	attribute vec3 pos;
	attribute vec3 normal;

	uniform mat4 mvp;
	uniform mat4 mv;

	varying vec3 normal2fs_eye;
	varying vec3 pos2fs_eye;
		

	void main()
	{ 
		normal2fs_eye = (mv * vec4(normal, 0.0)).xyz;
		pos2fs_eye = (mv * vec4(pos, 1.0)).xyz;

		gl_Position = mvp * vec4(pos,1);
	}
`;

// Fragment Shader
// Algunas funciones útiles para escribir este shader:
// Dot product: https://thebookofshaders.com/glossary/?search=dot
// Normalize:   https://thebookofshaders.com/glossary/?search=normalize
// Pow:         https://thebookofshaders.com/glossary/?search=pow
var meshFS = `
	precision mediump float;


	varying vec3 normal2fs_eye;
	varying vec3 pos2fs_eye;

	void main()
	{		
		vec3 N_eye = normalize(normal2fs_eye);
		vec3 V_eye = normalize(pos2fs_eye);
		vec3 R_eye = normalize(reflect(V_eye, N_eye));
		
		vec3 final_color =
		
		gl_FragColor = vec4(final_color, 1.0);
	}
`;














