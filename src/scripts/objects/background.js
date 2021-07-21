(function(namespace) {
	function generateBits(width, height) {
		var bits = [], x, y;
		for (y = height - 10; y <= height; y += 8) {
			for (x = 0 + rand(0, 100); x <= width; x += rand(100, 200)) {
				bits.push({
					x: x, 
					y: y, 
					width: rand(2, 4)
				});
			}
		}
		return bits;
	}

	function Background(options) {
		this.width = options.width;
		this.height = options.height;
		this.colour = options.colour;
		this.bits = generateBits(this.width, this.height);
		this.dead = options.dead;
		this.screens = 1;
	}

	Background.prototype = Object.create(GameObject.prototype);
	Background.prototype.constructor = Background;

	Background.prototype.draw = function(context, offset) {
		context.fillStyle = "#697580";
		context.fillRect(0, this.height-20, this.width, this.height+20);
		context.fillStyle = '#000000';
		context.fillRect(0, this.height - 20, this.width, 1);
		if (this.screens*this.width - offset/10 < -1000) {
			this.screens += 2;
		}
		var moon_pos = this.screens*this.width-offset/10;

		var moonLogo = new Image();
		moonLogo.src = 'https://github.com/jafrizzell/dinosaur-game/blob/main/src/scripts/chromaLogo.png?raw=true';
		context.drawImage(moonLogo, moon_pos, 0, 400, 200);
		var deadLoleText = new Image();
		deadLoleText.src = 'https://github.com/jafrizzell/dinosaur-game/blob/main/src/scripts/deadlole.JPG?raw=true';
		deadLoleText.onload = function() {}
		if (this.dead) {
			context.drawImage(deadLoleText, this.width/2-65, this.height/2+90, 130, 27);
		}

		for (let i = this.bits.length - 1; i >= 0; i--) {
			context.fillRect(this.width - ((this.bits[i].x + offset) % this.width), this.bits[i].y, this.bits[i].width, 1);
		}
	};

	namespace.Background = Background;
})(window);