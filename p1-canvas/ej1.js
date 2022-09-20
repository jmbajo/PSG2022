	var canvas = document.getElementById("myCanvas");
	
	var ctx = canvas.getContext("2d");

	// Dibujar rectangulo
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(0, 0, 150, 75);

	// Dibujar segmento de recta
	ctx.moveTo(200, 100);
	ctx.lineTo(400, 0);
	ctx.stroke();	

	// Dibujar circulo
	ctx.beginPath();
	ctx.arc(600, 50, 40, 0, 1.5*Math.PI);
	ctx.stroke();
	
	// Gradientes
	var grd = ctx.createLinearGradient(50, 200, 200, 280);
	grd.addColorStop(0, "red");
	grd.addColorStop(0.5, "green");
	grd.addColorStop(1, "white");
	
	ctx.fillStyle = grd;
	ctx.fillRect(50, 200, 150, 80);


	ctx.font = "50px Arial";
	ctx.fillStyle = "black"
	ctx.fillText("Hola CG", 400, 200);