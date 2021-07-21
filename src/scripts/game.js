import Chat from "twitch-chat-emotes";

(function(namespace) {
	var DEFAULT_COLOUR = "#697580";
	var BACKGROUND_COLOUR = "#1D2E3E";
	var OFFSET_SPEED = 0.4;
	var MAX_TIME_TICK = 1000 / 60;
	var SCREEN_BUFFER = 50;
	var GROUND_BUFFER = 100;
	var SPACE_BAR_CODE = 32;
	var MIN_CACTUS_DISTANCE = 450;
	var MAX_CACTUS_DISTANCE = 850;
	const emoteArray = [];
	let channels = ['moonmoon', 'anny', 'kyle', 'xqcow'];


	// the following few lines of code will allow you to add ?channels=channel1,channel2,channel3 to the URL in order to override the default array of channels
	const query_vars = {};
	const query_parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		query_vars[key] = value;
	});
	if (query_vars.channels) {
		channels = query_vars.channels.split(',');
	}

	var spacePressed = false;
	var ctrlPressed = false;
	function keydown(e) {
        if (e.keyCode === SPACE_BAR_CODE) {
			spacePressed = true;
        }
		if (e.keyCode === 17) {
			ctrlPressed = true;
		}
    }

    function keyup(e) {
        if (e.keyCode === SPACE_BAR_CODE) {
			spacePressed = false;
        }
		if (e.keyCode === 17) {
			ctrlPressed = false;
		}
    }

	function auto_jump() {
		spacePressed = true;
	}

	function auto_gunch() {
		ctrlPressed = true;
	}

	const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
	const deathTimer = async () => {
		await sleep(1500)
		console.log('zzz')
		document.getElementById('game').style.background = 'none';
				
		new Game({
			el: document.getElementById("game")
		});
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
		this.running = true;
		this.finished = false;
		this.initObjects();
		this.draw();
		requestAnimationFrame(this.step.bind(this));
	}

	Game.prototype.initObjects = function() {
		this.player = new Dinosaur({
			context: this.context, 
			left: 175, 
			bottom: this.canvas.height - GROUND_BUFFER,
			colour: DEFAULT_COLOUR
		});

		this.background = new Background({
			context: this.context, 
			width: this.canvas.width, 
			height: this.canvas.height - GROUND_BUFFER,
			dead: false,
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
				var count = Math.floor(rand(1, 1.9)),
					scale = rand(0.7, 1.2),
					x = this.canvas.width + this.offset + SCREEN_BUFFER;
				var scale_num = 1;
				var speed_mult = 0;
				const spawn = Date.now();

				// type of 0 = cactus, type of 1 == low bird, type of 2 = high bird
				var type = Math.floor(rand(0, 2.9));

				if (scale < 1.1) {
					scale_num = Math.floor(rand(1, 2.9));
				}
				if (scale < 0.85) {
					scale_num = Math.floor(rand(1, 3.9));
				}

				if (type == 1 || type == 2) {
					scale_num = 1;
					scale = 0.7;
					speed_mult = 0.075;
				}
	
				while (count--) {
					const emoteGroup = emoteArray.slice(-scale_num);
					this.cacti.push(new Cactus({
						emoteGroup, 
						type: type,
						spawn: spawn,
						speed_mult: speed_mult,
						left: x + (count * 20 * scale),
						bottom: this.canvas.height - GROUND_BUFFER - type*42,
						buffer: GROUND_BUFFER,
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
			this.cacti[i].drawColliders(this.context, this.offset+this.cacti[i].speed_mult);
			this.cacti[i].draw(this.context, this.offset);
		}

		this.player.drawColliders(this.context, this.offset);
		this.player.draw(this.context, this.offset);
		this.score.draw(this.context, this.offset);
	};

	Game.prototype.checkCactusHit = function() {
		for (var i = 0; i < this.cacti.length; i++) {
			if (this.player.collidesWith(this.cacti[i], this.offset)) {
				const start_death = Date.now();
				var end_death = Date.now();
				this.running = false;
				this.finished = true;
				this.player.wideEyed = true;
				this.background.dead = true; 
				document.getElementById('game').style.background = 'url("https://github.com/jafrizzell/dinosaur-game/blob/main/src/scripts/Deadlole.gif?raw=true") no-repeat center';
				// this.background.draw(this.context, this.offset);
				deathTimer();
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
				
				// Fake_offset keeps track of where the hitbox actually is, since birds stray from the offset they were spawned at
				var linear = 0;
				var speed_val = 0.06;
				if (this.cacti[i].type != 0) {linear = 200; speed_val = 0.075;}
				const fake_offset = this.cacti[i].x - speed_val * (Date.now() - this.cacti[i].spawn) - linear;
				if (Math.abs(fake_offset - this.offset) < 120 && this.offset < fake_offset) {
					if (this.cacti[i].type == 0) {
						auto_jump();
					}
					if (this.cacti[i].type == 1) {
						
						const pick = Math.random();
						if (pick < 0.3) {
								auto_jump();
						}
						else {
							auto_gunch();
						}
					}
				}
			}

			if (!this.player.isJumping(this.offset) && !this.player.isGunching(this.offset) && spacePressed) {
				this.player.startJump(this.offset);
			}
			if (!this.player.isGunching(this.offset) && !this.player.isJumping(this.offset) && ctrlPressed){
				this.player.startGunch(this.offset);
			}

			this.checkCactusHit();
			this.draw();
		} else if (spacePressed) {
			this.running = true;
		} else if (ctrlPressed) {
			this.running = true;
		}
		
		spacePressed = false;
		ctrlPressed = false;

		if (!this.finished) {
			this.lastTick = timestamp;
			requestAnimationFrame(this.step.bind(this));
		}
	};

	namespace.Game = Game;
})(window);
