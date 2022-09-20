function drawPixel(context, x, y, color) {
		var roundedX = Math.round(x);
	    var roundedY = Math.round(y);
	    context.fillStyle = "#000000";
	  	context.fillRect(roundedX, roundedY, 1, 1);
	}





function linea(context, x0, y0, x1, y1) {
	var dx = x1 - x0;
	var dy = y1 - y0;

	var ix = 2*dx;
	var iy = 2*dy;

	var y = y0;	
	var e = iy - dx;

    for (var x = x0; x <= x1; x++) {
    	drawPixel(context, x, y, ""); 
    	if (e>0) {
    		y = y+1;
       		e = e-ix;
    	}
       	e = e+iy;
   	}
}
         

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

linea(ctx, 0, 0, 150, 60)

	