(function(namespace) {
	function Cactus(options) {
		this.scale = options.scale;
		this.x = options.left;
		this.y = options.bottom;
		this.buffer = options.buffer;
		this.spawn = options.spawn;
		this.colour = options.colour;
		this.leftSize = options.leftSize;
		this.centerSize = options.centerSize;
		this.rightSize = options.rightSize;
		this.emoteGroup = options.emoteGroup;
		this.type = options.type;
		this.speed_mult = options.speed_mult;
	}

	Cactus.prototype = Object.create(GameObject.prototype);
	Cactus.prototype.constructor = Cactus;
	Cactus.prototype.draw = function(context, offset) {
		var x = this.x - offset,
			y = this.y,
			scale = this.scale;
			// y is always 580
		for (var i = this.emoteGroup.length - 1; i >= 0; i--) {
			const emote = this.emoteGroup[i].emotes[0];
			context.drawImage(emote.gif.canvas, x+(50*scale*i) - (Date.now()- this.spawn) * this.speed_mult, y-50*scale, 50*scale, 50*scale);
		}
		context.fillStyle = 'white';
		context.fillRect(this.x-offset - (Date.now() - this.spawn) * this.speed_mult, this.y-50*this.scale, 
							50 * this.scale * this.emoteGroup.length, 50 * this.scale);
	}; 

	Cactus.prototype.colliders = function(offset) {
		return [{
			x: this.x-offset - (Date.now()- this.spawn) * this.speed_mult,
			y: this.y-50*this.scale,
			width: 50 * this.scale * this.emoteGroup.length,
			height: 50 * this.scale,
		}];
	};

	namespace.Cactus = Cactus;
})(window);
