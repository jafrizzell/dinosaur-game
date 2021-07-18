(function(namespace) {
	function Cactus(options) {
		this.scale = options.scale;
		this.x = options.left;
		this.y = options.bottom;
		this.colour = options.colour;
		this.leftSize = options.leftSize;
		this.centerSize = options.centerSize;
		this.rightSize = options.rightSize;
		this.emoteGroup = options.emoteGroup;
	}

	Cactus.prototype = Object.create(GameObject.prototype);
	Cactus.prototype.constructor = Cactus;

	Cactus.prototype.draw = function(context, offset) {
		var x = this.x - offset,
			y = this.y,
			scale = this.scale;

		const emote = this.emoteGroup.emotes[0];
		context.fillStyle = this.colour;
		context.fillRect(x-1, y-55, 1, 50*scale);
		context.fillRect(x-1, y-55, 50*scale, 1);
		context.drawImage(emote.gif.canvas, x, y-56, 50*scale, 50*scale);

	};

	Cactus.prototype.colliders = function(offset) {
		return [{
			x: this.x,
			y: this.y,
			width: 17 * this.scale,
			height: (20 + (15 * Math.max(this.centerSize, this.leftSize, this.rightSize))) * this.scale
		}];
	};

	namespace.Cactus = Cactus;
})(window);
