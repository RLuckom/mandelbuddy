function ComplexEnoughNumber(real, imag) {
	this.real = real;
	this.imag = imag;
}

ComplexEnoughNumber.prototype = {
	plus: function(other) {
		return new ComplexEnoughNumber(
			this.real + other.real,
			this.imag + other.imag
		);
	},
	
	times: function(other) {
		var real_part = (this.real * other.real) - (this.imag * other.imag);
		var imag_part = (this.real * other.imag) + (this.imag * other.real);
		return new ComplexEnoughNumber(real_part, imag_part);
	},
	
	squared: function() {
		return this.times(this);
	}
};

function MandelBuddy(height, width, iterations) {
	this.height = height;
	this.width = width;
	this.iterations = iterations;
	this.realMin = -2.0;
	this.realRange = 3.0;
	this.imagMax = 1.0;
	this.imagRange = 2.0;
}

MandelBuddy.prototype = {
	
	bailOut: function(complexEnough) {
		if (complexEnough.imag > 2 || complexEnough.real > 2) {
			return true;
		}
		return false;
	},
	
	escapeTime: function(x, y) {
		/*if (x < 0) {
			console.log(x, y);
		}*/
		var c = new ComplexEnoughNumber(x, y);
		var z = new ComplexEnoughNumber(0, 0);
		for (var n = 0; n < this.iterations; n++) {
			z = z.squared().plus(c);
			//console.log(z.toSource());
			if (this.bailOut(z)) {
				return n;
			}
		}
		return false;
	},
	
	makePixels: function() {
		var pixels = [];
		var yStep = this.imagRange / this.height;
		var xStep = this.realRange / this.width;
		for (var y = 0; y < this.height; y++) {
			var yVal = this.imagMax - (y * yStep);
			for (var x = 0; x < this.width; x++ ) {
				var xVal = this.realMin + (x * xStep);
				pixels.push(this.escapeTime(xVal, yVal));
			} 
		}
		return pixels;
	},
	
	makeMandelCanvas: function() {
		var canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		var ctx = canvas.getContext('2d');
		var canvasData = ctx.getImageData(0, 0, this.width, this.height);
		var pixels = this.makePixels();
		for (var q = 0; q < this.width * this.height * 4; q += 4) {
			//hconsole.log(q / 4);
			if (!pixels[q / 4]) {
				canvasData.data[q] = 0;
				canvasData.data[q + 1] = 0;
				canvasData.data[q + 2] = 0;
				canvasData.data[q + 3] = 255;
			}
			else {
				var color = this.getColor(pixels[q / 4]);
				canvasData.data[q] = color[0];
				canvasData.data[q + 1] = color[1];
				canvasData.data[q + 2] = color[2];
				canvasData.data[q + 3] = 255;				
			}
		}
		ctx.putImageData(canvasData, 0, 0);
		return canvas;
	},
	
	testMandel: function() {
		var pixels = this.makePixels();
		var row = [];
		for (var d = 0; d < pixels.length; d++){
			row.push(pixels[d]);
			if (d % this.width == 0) {
				console.log(row.toSource());
				row = [];
			}
		}
	},
	
	getColor: function(n) {
		var rgb = [255, 255, 255];
		var idx = Math.floor(this.iterations / n);
		var hue = this.iterations % n;
		rgb[idx] = hue;
		return rgb;
	}
};

function runMandelBuddy() {
	m = new MandelBuddy(600, 900, 1200);
	//m.escapeTime(-1.5, 0);
	//m.testMandel();
	document.body.appendChild(m.makeMandelCanvas());
}
