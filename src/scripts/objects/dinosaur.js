(function(namespace) {
	var STEP_SPEED = 0.02;
	var JUMP_DISTANCE = 350;
	var JUMP_HEIGHT = 150;

	function Dinosaur(options) {
		this.scale = options.scale;
		this.x = options.left;
		this.y = options.bottom;
		this.colour = options.colour;
		this.jumpStart = null;
		this.jumpStartTime = 0;
		this.gravity = 1600;
		this.initYVel = 700;
		this.gunching = options.gunching;
	}

	Dinosaur.prototype = Object.create(GameObject.prototype);
	Dinosaur.prototype.constructor = Dinosaur;

	Dinosaur.prototype.isJumping = function(offset) {
		return this.jumpStart !== null && this.jumpDistanceRemaining(offset) > 0;
	};

	Dinosaur.prototype.jumpDistanceRemaining = function(offset) {
		if (this.jumpStart === null) return 0;
		return this.jumpStart + JUMP_DISTANCE - offset;
	};

	Dinosaur.prototype.startJump = function(offset) {
		this.jumpStart = offset;
		this.jumpStartTime = Date.now();
	};

	Dinosaur.prototype.jumpHeight = function (offset) {
		var distanceRemaining = this.jumpDistanceRemaining(offset);
		var timeDiff = (Date.now() - this.jumpStartTime)/1000;
		if (distanceRemaining > 0) {
			y_pos =  -1 * this.gravity / 2 * Math.pow(timeDiff, 2) + this.initYVel * timeDiff;
			return y_pos;
		}
		return 0;
	};

	Dinosaur.prototype.hasBackLegUp = function(offset) {
		return offset > 0 && Math.floor(offset * STEP_SPEED) % 2 === 0;
	};

	Dinosaur.prototype.hasFrontLegUp = function(offset) {
		return offset > 0 && Math.floor(offset * STEP_SPEED) % 2 === 1;
	};

	Dinosaur.prototype.draw = function(context, offset) {
		var x = this.x,
			offsetY = this.y - this.jumpHeight(offset),
			y = offsetY;

		context.fillStyle = "#514f59";
		
		// front arm
		var xscale = 3
		var yscale = 3 

		context.fillRect(x + 0, y - 8*yscale, 1*xscale, 3*yscale);
		context.fillRect(x + 1*xscale, y - 9*yscale, 1*xscale, 5*yscale);
		context.fillRect(x + 2*xscale, y - 9*yscale, 1*xscale, 6*yscale);
		context.fillRect(x + 3*xscale, y - 8*yscale, 1*xscale, 1*yscale);
		context.fillRect(x + 3*xscale, y - 6*yscale, 1*xscale, 1*yscale);
		
		// back arm
		context.fillRect(x + 4*xscale, y - 9*yscale, 3*xscale, 1*yscale);
		context.fillRect(x + 6*xscale, y - 8*yscale, 2*xscale, 1*yscale);

		// chest / stomach

		context.fillStyle = "#141021"
		context.fillRect(x, y - 5*yscale, 1*xscale, 1*yscale);
		context.fillRect(x + 1*xscale, y - 4*yscale, 1*xscale, 1*yscale);
		context.fillRect(x + 2*xscale, y - 3*yscale, 3*xscale, 1*yscale);
		context.fillRect(x + 5*xscale, y - 4*yscale, 1*xscale, 1*yscale);
		context.fillRect(x + 6*xscale, y - 7*yscale, 2*xscale, 4*yscale);
		context.fillRect(x + 8*xscale, y - 6*yscale, 1*xscale, 2*yscale);
		context.fillRect(x + 4*xscale, y - 8*yscale, 2*xscale, 3*yscale);
		context.fillRect(x + 3*xscale, y - 9*yscale, 1*xscale, 1*yscale);
		context.fillRect(x + 3*xscale, y - 7*yscale, 1*xscale, 1*yscale);

		// Hands
		context.fillStyle = "#cfc7e8";
		context.fillRect(x + 3*xscale, y - 4*yscale, 2*xscale, 1*yscale);
		context.fillRect(x + 3*xscale, y - 5*yscale, 3*xscale, 1*yscale);
		context.fillRect(x + 5*xscale, y - 7*yscale, 1*xscale, 1*yscale);
		context.fillRect(x + 8*xscale, y - 7*yscale, 1*xscale, 1*yscale);

		var xgunch = 0;
		var ygunch = 0;

		if (this.gunching) {
			xgunch = 5;
			ygunch = 8;
		}

		if (this.wideEyed) {
			// head & hair
			context.fillStyle = "#cca951";
			context.fillRect(x + 2*xscale + xgunch, y - 16*yscale + ygunch, 6*xscale, 7*yscale);
			context.fillRect(x + 1*xscale + xgunch, y - 13*yscale + ygunch, 1*xscale, 2*yscale);
			context.fillRect(x + 7*xscale + xgunch, y - 16*yscale + ygunch, 1*xscale, 6*yscale);
			context.fillRect(x + 8*xscale + xgunch, y - 13*yscale + ygunch, 1*xscale, 4*yscale);
			context.fillRect(x + 9*xscale + xgunch, y - 13*yscale + ygunch, 1*xscale, 3*yscale);
			context.fillRect(x + 8*xscale + xgunch, y - 14*yscale + ygunch, 1*xscale, 1*yscale);
			context.fillStyle = "#231d10";
			context.fillRect(x + xgunch, y - 14*yscale + ygunch, 1*xscale, 4*yscale);
			context.fillRect(x + 1*xscale + xgunch, y - 15*yscale + ygunch, 1*xscale, 2*yscale);
			context.fillRect(x + 2*xscale + xgunch, y - 16*yscale + ygunch, 1*xscale, 5*yscale);
			context.fillRect(x + 2*xscale + xgunch, y - 16*yscale + ygunch, 1*xscale, 5*yscale);
			context.fillRect(x + 3*xscale + xgunch, y - 16*yscale + ygunch, 2*xscale, 1*yscale);
			context.fillRect(x + 3*xscale + xgunch, y - 14*yscale + ygunch, 1*xscale, 1*yscale);
			context.fillRect(x + 3*xscale + xgunch, y - 12*yscale + ygunch, 1*xscale, 1*yscale);
			context.fillRect(x + 1*xscale + xgunch, y - 11*yscale + ygunch, 1*xscale, 1*yscale);
			context.fillRect(x + 6*xscale + xgunch, y - 11*yscale + ygunch, 4*xscale, 1*yscale);
			context.fillRect(x + 7*xscale + xgunch, y - 12*yscale + ygunch, 1*xscale, 1*yscale);
			context.fillStyle = "#000000"
			context.fillRect(x + 6*xscale + xgunch, y - 14*yscale, 1*xscale, 2*yscale);

		} else {
			// head & hair
			context.fillStyle = "#cca951";
			context.fillRect(x + 2*xscale + xgunch, y - 16*yscale + ygunch, 6*xscale, 7*yscale);
			context.fillRect(x + 1*xscale + xgunch, y - 13*yscale + ygunch, 1*xscale, 2*yscale);
			context.fillRect(x + 7*xscale + xgunch, y - 16*yscale + ygunch, 1*xscale, 6*yscale);
			context.fillRect(x + 8*xscale + xgunch, y - 13*yscale + ygunch, 1*xscale, 4*yscale);
			context.fillRect(x + 9*xscale + xgunch, y - 13*yscale + ygunch, 1*xscale, 3*yscale);
			context.fillRect(x + 8*xscale + xgunch, y - 14*yscale + ygunch, 1*xscale, 1*yscale);
			context.fillStyle = "#231d10";
			context.fillRect(x + xgunch, y - 14*yscale + ygunch, 1*xscale, 4*yscale);
			context.fillRect(x + 1*xscale + xgunch, y - 15*yscale + ygunch, 1*xscale, 2*yscale);
			context.fillRect(x + 2*xscale + xgunch, y - 16*yscale + ygunch, 1*xscale, 5*yscale);
			context.fillRect(x + 2*xscale + xgunch, y - 16*yscale + ygunch, 1*xscale, 5*yscale);
			context.fillRect(x + 3*xscale + xgunch, y - 16*yscale + ygunch, 2*xscale, 1*yscale);
			context.fillRect(x + 3*xscale + xgunch, y - 14*yscale + ygunch, 1*xscale, 1*yscale);
			context.fillRect(x + 3*xscale + xgunch, y - 12*yscale + ygunch, 1*xscale, 1*yscale);
			context.fillRect(x + 1*xscale + xgunch, y - 11*yscale + ygunch, 1*xscale, 1*yscale);
			context.fillRect(x + 6*xscale + xgunch, y - 11*yscale + ygunch, 4*xscale, 1*yscale);
			context.fillRect(x + 7*xscale + xgunch, y - 12*yscale + ygunch, 1*xscale, 1*yscale);
			context.fillStyle = "#000000"
			context.fillRect(x + 6*xscale + xgunch, y - 14*yscale, 1*xscale, 2*yscale);
		}

		if (this.wideEyed) {
			// context.fillRect(x + 38, y - 34, 8, 2);
		} else {
			// context.fillRect(x + 40, y - 36, 8, 2);
		}


		y = offsetY;
		if (this.hasBackLegUp(offset)) {
			y -= 4;
		}
		// back leg
		context.fillStyle = "#00000f"
		context.fillRect(x + 5*xscale, y - 3*yscale, 3*xscale, 2*yscale);
		context.fillRect(x + 8*xscale, y - 2*yscale, 1*xscale, 1*yscale);


		y = offsetY;
		if (this.hasFrontLegUp(offset)) {
			y -= 6;
		}

		// front leg
		context.fillRect(x + 2*xscale, y - 2*yscale, 3*xscale, 2*yscale);
		context.fillRect(x + 5*xscale, y - 1*yscale, 1*xscale, 1*yscale);

		// context.fillStyle = 'white';
		// context.fillRect(this.x, y - 45 - ygunch, 26, 48-ygunch);
	};

	Dinosaur.prototype.colliders = function(offset) {
		var y = this.y - this.jumpHeight(offset);
		if (this.gunching) {
			var ygunch = 8;
		}
		else {var ygunch = 0;}
		return [{
			x: this.x,
			y: y - 45 + ygunch,
			width: 26,
			height: 48 - ygunch
		}, 
	];
	};


	namespace.Dinosaur = Dinosaur;
})(window);
