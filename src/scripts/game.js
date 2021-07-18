import Chat from "twitch-chat-emotes";

(function(namespace) {
	var DEFAULT_COLOUR = "#444";
	var BACKGROUND_COLOUR = "#EEE";
	var OFFSET_SPEED = 0.4;
	var MAX_TIME_TICK = 1000 / 60;
	var SCREEN_BUFFER = 50;
	var GROUND_BUFFER = 10;
	var SPACE_BAR_CODE = 32;
	var MIN_CACTUS_DISTANCE = 400;
	var MAX_CACTUS_DISTANCE = 700;
	const emoteArray = [];
	let channels = ['moonmoon'];


	// the following few lines of code will allow you to add ?channels=channel1,channel2,channel3 to the URL in order to override the default array of channels
	const query_vars = {};
	const query_parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		query_vars[key] = value;
	});
	if (query_vars.channels) {
		channels = query_vars.channels.split(',');
	}

	var spacePressed = false;
	function keydown(e) {
        if (e.keyCode === SPACE_BAR_CODE) {
			spacePressed = true;
        }
    }

    function keyup(e) {
        if (e.keyCode === SPACE_BAR_CODE) {
			spacePressed = false;
        }
    }

	function auto_jump() {
		spacePressed = true;
	}

	document.addEventListener('keydown', keydown, false);
	document.addEventListener('keyup', keyup, false);

	function Game(options) {
		const ChatInstance = new Chat({
			channels,
			duplicateEmoteLimit: 5,
			maximumEmoteLimit: 1,
		})

		ChatInstance.on('emotes', (emotes) => {
			if (emoteArray.length > 20) {
				emoteArray.shift();
			}
			emoteArray.push({
				emotes
			});
		})

		this.canvas = options.el;
		this.context = this.canvas.getContext("2d");

		this.cacti = [];
		this.nextCactus = 0;
		this.offset = 0;
		this.lastTick = null;
		this.running = false;
		this.finished = false;
		this.initObjects();
		this.draw();
		requestAnimationFrame(this.step.bind(this));
	}

	Game.prototype.initObjects = function() {
		this.player = new Dinosaur({
			context: this.context, 
			left: 10, 
			bottom: this.canvas.height - GROUND_BUFFER,
			colour: DEFAULT_COLOUR
		});

		this.background = new Background({
			context: this.context, 
			width: this.canvas.width, 
			height: this.canvas.height,
			colour: DEFAULT_COLOUR
		});

		this.score = new ScoreBoard({
			context: this.context, 
			left: this.canvas.width - 10, 
			bottom: 26,
			colour: DEFAULT_COLOUR
		});
	};

	Game.prototype.updateCacti = function() {
		if (emoteArray.length > 1) {
			while (this.offset > this.nextCactus) {
				var count = Math.floor(rand(1, 4.9)),
					scale = rand(0.8, 1.5),
					x = this.canvas.width + this.offset + SCREEN_BUFFER;
	
				while (count--) {
					const emoteGroup = emoteArray[emoteArray.length-1];
					this.cacti.push(new Cactus({
						emoteGroup, 
						left: x + (count * 20 * scale), 
						bottom: this.canvas.height - GROUND_BUFFER,
						scale: scale,
						leftSize: rand(0.5, 1.5), 
						rightSize: rand(0.5, 1.5), 
						centerSize: rand(0.5, 1.5),
						colour: DEFAULT_COLOUR
					}));
				}
	
				this.nextCactus = this.offset + rand(MIN_CACTUS_DISTANCE, MAX_CACTUS_DISTANCE);
			}
		}
	};

	Game.prototype.removeOldCacti = function() {
		var count = 0; // used to force cacti off the screen

		while (this.cacti.length > count && this.cacti[count].x < this.offset - SCREEN_BUFFER) { 
			count++; 
		}

		this.cacti.splice(0, count);
	};

	Game.prototype.draw = function() {
		this.clear();

		this.background.draw(this.context, this.offset);

		for (var i = 0; i < this.cacti.length; i++) {
			this.cacti[i].drawColliders(this.context, this.offset);
			this.cacti[i].draw(this.context, this.offset);
		}

		this.player.drawColliders(this.context, this.offset);
		this.player.draw(this.context, this.offset);
		this.score.draw(this.context, this.offset);
	};

	Game.prototype.checkCactusHit = function() {
		for (var i = 0; i < this.cacti.length; i++) {
			if (this.player.collidesWith(this.cacti[i], this.offset)) {
				this.running = false;
				this.finished = true;
				this.player.wideEyed = true;
				return;
			}
		}
	};

	Game.prototype.clear = function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	};

	Game.prototype.step = function(timestamp) {
		if (this.running && this.lastTick) {
			this.offset += Math.min((timestamp - this.lastTick), MAX_TIME_TICK) * OFFSET_SPEED;

			this.removeOldCacti();
			this.updateCacti();

			for (var i = 0; i < this.cacti.length; i++) { 
				if ((this.cacti[i].x - this.offset) < 90 && this.cacti[i].x > 0) {
					console.log(Math.abs(this.cacti[i].x - this.offset));
					auto_jump();

				}
			}

			if (!this.player.isJumping(this.offset) && spacePressed) {
				this.player.startJump(this.offset);
			}
			
			this.checkCactusHit();
			this.draw();
		} else if (spacePressed) {
			this.running = true;
		}
		spacePressed = false;

		if (!this.finished) {
			this.lastTick = timestamp;
			requestAnimationFrame(this.step.bind(this));
		}
	};

	namespace.Game = Game;
})(window);
