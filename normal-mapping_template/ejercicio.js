
// <============================================ EJERCICIOS ============================================>
// a) Implementar la función:
//
//      GetModelViewMatrix( translationX, translationY, translationZ, rotationX, rotationY )
//
//    Si la implementación es correcta, podrán hacer rotar la caja correctamente (como en el video). Notar 
//    que esta función no es exactamente la misma que implementaron en el TP4, ya que no recibe por parámetro
//    la matriz de proyección. Es decir, deberá retornar solo la transformación antes de la proyección model-view (MV)
//    Es necesario completar esta implementación para que funcione el control de la luz en la interfaz. 
//    IMPORTANTE: No es recomendable avanzar con los ejercicios b) y c) si este no funciona correctamente. 
//
// b) Implementar los métodos:
//
//      setMesh( vertPos, texCoords, normals )
//      swapYZ( swap )
//      draw( matrixMVP, matrixMV, matrixNormal )
//
//    Si la implementación es correcta, podrán visualizar el objeto 3D que hayan cargado, asi como también intercambiar 
//    sus coordenadas yz. Notar que es necesario pasar las normales como atributo al VertexShader. 
//    La función draw recibe ahora 3 matrices en column-major: 
//
//       * model-view-projection (MVP de 4x4)
//       * model-view (MV de 4x4)
//       * normal transformation (MV_3x3)
//
//    Estas últimas dos matrices adicionales deben ser utilizadas para transformar las posiciones y las normales del 
//    espacio objeto al esapcio cámara. 
//
// c) Implementar los métodos:
//
//      setTexture( img )
//      showTexture( show )
//
//    Si la implementación es correcta, podrán visualizar el objeto 3D que hayan cargado y su textura.
//    Notar que los shaders deberán ser modificados entre el ejercicio b) y el c) para incorporar las texturas.
//  
// d) Implementar los métodos:
//
//      setLightDir(x,y,z)
//      setShininess(alpha)
//    
//    Estas funciones se llaman cada vez que se modifican los parámetros del modelo de iluminación en la 
//    interface. No es necesario transformar la dirección de la luz (x,y,z), ya viene en espacio cámara.
//
// Otras aclaraciones: 
//
//      * Utilizaremos una sola fuente de luz direccional en toda la escena
//      * La intensidad I para el modelo de iluminación debe ser seteada como blanca (1.0,1.0,1.0,1.0) en RGB
//      * Es opcional incorporar la componente ambiental (Ka) del modelo de iluminación
//      * Los coeficientes Kd y Ks correspondientes a las componentes difusa y especular del modelo 
//        deben ser seteados con el color blanco. En caso de que se active el uso de texturas, la 
//        componente difusa (Kd) será reemplazada por el valor de textura. 
//        
// <=====================================================================================================>

// Esta función recibe la matriz de proyección (ya calculada), una 
// traslación y dos ángulos de rotación (en radianes). Cada una de 
// las rotaciones se aplican sobre el eje x e y, respectivamente. 
// La función debe retornar la combinación de las transformaciones 
// 3D (rotación, traslación y proyección) en una matriz de 4x4, 
// representada por un arreglo en formato column-major. 

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
		this.light_dir = gl.getUniformLocation(this.prog, "light_dir")
		this.shininess = gl.getUniformLocation(this.prog, "shininess");
		this.tex_sampler = gl.getUniformLocation(this.prog, "tex_sampler");
		this.with_tex = gl.getUniformLocation(this.prog, "with_tex");
		// [Agregar los uniforms necesarios]

		// 3. Obtenemos los IDs de los atributos de los vértices en los shaders
		this.pos_loc = gl.getAttribLocation( this.prog, 'pos' );
		this.normal_loc = gl.getAttribLocation( this.prog, 'normal' );
		this.tex_coord_loc = gl.getAttribLocation( this.prog, 'tex_coord' );
		// [Agregar los atributos necesarios]


		// 4. Creamos los buffers
		this.pos_buffer = gl.createBuffer();
		this.normal_buffer = gl.createBuffer();
		// [Agregar los buffers necesarios]

		this.tex_coord_buffer = gl.createBuffer();

		this.textura = gl.createTexture()
		this.normal_map = gl.createTexture()

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

		gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_coord_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);


		gl.useProgram(this.prog)
		gl.uniform1i(this.with_tex, 0)

		// Generación de los vectores tangentes
		this.tangents = [] 
		for ( var t=0; t<this.numTriangles; t++) {
			var i = t * 9
			var V0 = [vertPos[i], vertPos[i+1], vertPos[i+2]] 
			var V1 = [vertPos[i+3], vertPos[i+4], vertPos[i+5]] 
			var V2 = [vertPos[i+6], vertPos[i+7], vertPos[i+8]] 

			var E1 = [V1[0] - V0[0], V1[1] - V0[1], V1[2] - V0[2]]
			var E2 = [V2[0] - V0[0], V2[1] - V0[1], V2[2] - V0[2]]

			var ti = t * 6
			var UV0 = [texCoords[ti], texCoords[ti+1]] 
			var UV1 = [texCoords[ti+2], texCoords[ti+3]] 
			var UV2 = [texCoords[ti+4], texCoords[ti+5]] 
			 
			var deltaUV1 = [UV1[0] - UV0[0], UV1[1] - UV0[1]]
			var deltaUV2 = [UV2[0] - UV0[0], UV2[1] - UV0[1]]
	
			var C = 1 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1])

			var T = [ 
				C * (deltaUV2[1] * E1[0] - deltaUV1[1] * E2[0]),
				C * (deltaUV2[1] * E1[1] - deltaUV1[1] * E2[1]),
				C * (deltaUV2[1] * E1[2] - deltaUV1[1] * E2[2])
			]

			this.tangents.push(T[0], T[1], T[2]) // lo pongo 3 veces repetido
			this.tangents.push(T[0], T[1], T[2])
			this.tangents.push(T[0], T[1], T[2])
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, this.tangent_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangents), gl.STATIC_DRAW);

	}
		
	// Esta función se llama para dibujar la malla de triángulos
	// El argumento es la matriz model-view-projection (matrixMVP),
	// la matriz model-view (matrixMV) que es retornada por 
	// GetModelViewProjection y la matriz de transformación de las 
	// normales (matrixNormal) que es la inversa transpuesta de matrixMV
	draw( matrixMVP, matrixMV, matrixNormal )
	{		
		// 1. Seleccionamos el shader
		gl.useProgram(this.prog)
	
		// 2. Setear uniformes con las matrices de transformaciones
		gl.uniformMatrix4fv( this.mvp_loc, false, matrixMVP );
		gl.uniformMatrix4fv( this.mv_loc, false, matrixMV );
		// gl.uniformMatrix4fv( this.m_inv_t_loc, false, matrixNormal );

   		// 3. Habilitar atributos: vértices, normales, texturas
		gl.bindBuffer( gl.ARRAY_BUFFER, this.pos_buffer );

		gl.vertexAttribPointer( this.pos_loc, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.pos_loc );

		// 4 Binding del buffer de color
		gl.bindBuffer( gl.ARRAY_BUFFER, this.normal_buffer );
		
		gl.vertexAttribPointer( this.normal_loc, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.normal_loc );

		// 5 Binding del buffer de coordenadas de textura
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_coord_buffer);
		gl.vertexAttribPointer(this.tex_coord_loc, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.tex_coord_loc);

		// 5 Binding del buffer de tangentes
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tangent_buffer);
		gl.vertexAttribPointer(this.tangent_loc, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.tangent_loc);

		// 6 [COMPLETAR] Habilitar las 2 texturas y bindear las texturas correspondientes
		

		gl.drawArrays( gl.TRIANGLES, 0, this.numTriangles * 3 );
	}
	
	// Esta función se llama para setear una textura sobre la malla
	// El argumento es un componente <img> de html que contiene la textura. 
	setTexture( img )
	{
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

	setNormalMap( img )
	{
		// [COMPLETAR] los pasos necesarios para setear la textura
		// de normales
		
	}
		
    // Esta función se llama cada vez que el usuario cambia el estado del checkbox 'Mostrar textura'
	// El argumento es un boleano que indica si el checkbox está tildado
	showTexture( show )
	{
		// [COMPLETAR] Setear variables uniformes en el fragment shader para indicar si debe o no usar la textura

		gl.useProgram(this.prog)
		if (show)
			gl.uniform1i(this.with_tex, 1)
		else 
			gl.uniform1i(this.with_tex, 0)
		
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
		gl.uniform1f(this.shininess, shininess);
	}
}


// Recordar que: 
// Si declarás las variables pero no las usás, es como que no las declaraste
// y va a tirar error. Siempre va punto y coma al finalizar la sentencia. 
// Las constantes en punto flotante necesitan ser expresadas como x.y, 
// incluso si son enteros: ejemplo, para 4 escribimos 4.0.

// Vertex Shader
var meshVS = `
	attribute vec3 pos;
	attribute vec3 normal;
	attribute vec2 tex_coord;

	uniform mat4 mvp;
	uniform mat4 mv;

	varying vec3 normal2fs_eye;
	varying vec3 pos2fs_eye;
	varying vec2 tex_coord2fs;


	void main()
	{ 
		normal2fs_eye = (mv * vec4(normal, 0.0)).xyz;
		pos2fs_eye = (mv * vec4(pos, 1.0)).xyz;
		tex_coord2fs = tex_coord;
		

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

	uniform vec3 light_dir;
	uniform float shininess;
	uniform sampler2D tex_sampler;

	uniform bool with_tex;

	varying vec3 normal2fs_eye;
	varying vec3 pos2fs_eye;
	varying vec2 tex_coord2fs;


	void main()
	{		
		vec3 N = normalize(normal2fs_eye);
		vec3 T = ...
		vec3 B = ...

		mat3 TBN = mat3(T, B, N);

		// [COMPLETAR] transformar la matriz de la textura

		vec3 L = normalize(light_dir);
		vec3 R = normalize(reflect(-L, N));
		vec3 V = normalize(-pos2fs_eye);

		vec3 light_color = vec3(1, 1, 1);

		vec3 obj_color = with_tex ? texture2D(tex_sampler, tex_coord2fs).rgb : vec3(0.8, 0.4, 0.9);
		
		vec3 surface_color = obj_color  * vec3( max(dot(L, N), 0.0) ) + vec3( pow( max(0.0, dot(R, V)), shininess));

		gl_FragColor = vec4( surface_color, 1 );
	}
`;














