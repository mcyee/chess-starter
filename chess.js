// Game configuration contstants
var BOARD_WIDTH = 960;
var BOARD_HEIGHT = 640;

/**
 * Chess class
 *
 * @param {HTMLCanvasElement} canvasElement
 * @constructor
 */
var Chess = function(canvasElement) {
	this.__canvas = canvasElement;

	// https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D
	this.__context = canvasElement.getContext("2d");
};

/**
 * Class definition
 */
Chess.prototype = {

	/**
	 * Initialize the game before running
	 *
	 * @public
	 */
	initialize: function initialize() {

		this.__fps = 0;
		this.__ticks = 0;
		this.__lastTime = 0;

	},

	/**
	 * Start the game
	 *
	 * @public
	 */
	run: function run() {
		this.__startGameLoop();
	},

	/**
	 * Begin a game loop function using requestAnimationFrame
	 *
	 * @private
	 */
	__startGameLoop: function __startGameLoop() {

		if (! window.requestAnimationFrame) {
			alert("Your browser doesn't support request animation frame!");
			throw new Error("Unsupported environment.  RAF not a function");
		}

		var me = this;
		var previousNow = 0;
		function gameLoop() {
			window.requestAnimationFrame(gameLoop);

			var now = Date.now();
			var dt = now - previousNow;
			me.update(now, dt);
			me.draw(now, dt);
			previousNow = now;
		};

		window.requestAnimationFrame(gameLoop);

	},

	/**
	 * Draw callback
	 *
	 * @param {Number} now - Absolute time stamp (ms)
	 * @param {Number} dt - Time since last draw (ms)
	 * @public
	 */
	draw: function draw(now, dt) {
		var ctx = this.__context;

		// Clear everything first
		ctx.clearRect(0, 0, this.__canvas.width, this.__canvas.height);

		this.__updateFPSCounter(now, dt);
		this.__drawFPSCounter(ctx);

	},

	/**
	 * Update callback
	 *
	 * @param {Number} now - Absolute time stamp (ms)
	 * @param {Number} dt - Time since last draw (ms)
	 * @public
	 */
	update: function update(now, dt) {

	},

	/**
	 * Update the FPS counter with another tick
	 *
	 * @param {Number} now - Absolute time stamp (ms)
	 * @param {Number} dt - Time since last draw (ms)
	 * @public
	 */
	__updateFPSCounter: function __updateFPSCounter(absoluteTime, dt) {

		if (this.__lastTime === 0) {
			this.__lastTime = absoluteTime;
			return;
		}

		// Reset each ~second
		if (absoluteTime - 1000 > this.__lastTime) {
			this.__ticks = 1;
			this.__lastTime = absoluteTime;
		}

		var frameTime = dt;
		var frameTimeSeconds = dt / 1000;
		var hz = 1 / frameTimeSeconds;

		this.__fps = ((this.__fps * this.__ticks) + hz) / (this.__ticks + 1);
		++this.__ticks;

	},

	/**
	 * Draw the FPS counter
	 *
	 * @param {Number} now - Absolute time stamp (ms)
	 * @param {Number} dt - Time since last draw (ms)
	 * @public
	 */
	__drawFPSCounter: function __drawFPSCounter(ctx) {

		ctx.font = "15px calibri";
		ctx.fillStyle = "#FF0000";
		ctx.fillText("FPS: " + ~~this.__fps, 5, 17);

	}

};

/**
 * Notification that the window has loaded and it's not safe to start the game.
 */
function onWindowLoad() {
	var canvas = document.querySelector("#board");
	canvas.width = BOARD_WIDTH;
	canvas.height = BOARD_HEIGHT;

	var chess = new Chess(canvas);
	chess.initialize();
	chess.run();
};

// Register our load callback on the load function
window.onload = onWindowLoad;