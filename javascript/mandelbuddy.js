/**
 * partial complex number class, implementing only plus, times, and squared.
 * Those are all I need for this
 *
 * @param {Number} real : real part of the complex number.
 * @param {Number} imag : imaginary part of the complex number.
 */
function ComplexEnoughNumber(real, imag) {
	this.real = real;
	this.imag = imag;
}

ComplexEnoughNumber.prototype = {

	/**
	 * Implements addition of complex numbers. Returns a new
	 * ComplexEnoughNumber; does not modify this one.
	 *
	 * @param {ComplexEnoughNumber} other : complex number to add to this
	 *                                      one.
	 * @return {ComplexEnoughNumber} : sum
	 */
	plus: function(other) {
		return new ComplexEnoughNumber(
			this.real + other.real,
			this.imag + other.imag
		);
	},
	
	/**
	 * Implements multiplication of complex numbers. Returns a new
	 * ComplexEnoughNumber; does not modify this one.
	 *
	 * @param {ComplexEnoughNumber} other : complex number to multiply by
	 *                                      this one.
	 * @return {ComplexEnoughNumber} : product
	 */
	times: function(other) {
		var real_part = (this.real * other.real) - (this.imag * other.imag);
		var imag_part = (this.real * other.imag) + (this.imag * other.real);
		return new ComplexEnoughNumber(real_part, imag_part);
	},
	
	/**
	 * Convenience method to square a number. Returns a new
	 * ComplexEnoughNumber; does not modify this one.
	 *
	 * @return {ComplexEnoughNumber} : this * this
	 */
	squared: function() {
		return this.times(this);
	}
};

/**
 * Calculates the escape time of numbers in the complex plane and makes an array
 * of pixel data based on the provided height and width.
 *
 * @param {Number} height : height in pixels of desired image data
 * @param {Number} width : width in pixels of desired image data
 * @param {Number} iterations : number of iterations before declaring a number
 *                              part of the Mandelbrot Set.
 */
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
	
	/**
	 * Checks whether a number is definitely not in the Mandelbrot Set.
	 *
	 * @param {ComplexEnoughNumber} : number to test
	 * @return {Bool} : true if the number is definitely not in the set.
	 */
	bailOut: function(complexEnough) {
		if (complexEnough.imag > 2 || complexEnough.real > 2) {
			return true;
		}
		return false;
	},
	
	/**
	 * Returns the number of iterations before escape, or false if escape
	 * doesn't occur.
	 *
	 * @param {Number} x : x-coordinate of point; real component of number
	 * @param {Number} y : y-coordinate of point; imag component of number
	 * @return {Number or Bool} : number of iterations to escape or false
	 */
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
	
	/**
	 * Makes an array of width * height length of the escape times of
	 * numbers.
	 *
	 * @return {Array}
	 */
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

	/**
	 * Makes a canvas showing the Mandelbrot Set
	 */
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
			if (d % this.width === 0) {
				console.log(row.toSource());
				row = [];
			}
		}
	},
	
	getColor: function(n) {
		var rgb = [0, 0, 0];
		var idx = Math.floor((n / this.iterations) * 4);
		var hue = Math.floor(255 - ((n / this.iterations) * 255));
		rgb[idx] = hue;
		return rgb;
	}
};

function runMandelBuddy() {
	m = new MandelBuddy(600, 900, 30);
	//m.escapeTime(-1.5, 0);
	//m.testMandel();
	document.body.appendChild(m.makeMandelCanvas());
}
