function Game(canvas, interval) {
	this.canvas = canvas;
	this.interval = interval;
	this.context = canvas.getContext('2d');
	if (!this.context) {
		throw new Error('Game.contructor : context undefined.');
	}
	this.init();
};

Game.prototype.getCanvas = function() {
	return this.canvas;
};

Game.prototype.getContext = function() {
	return this.context;
};

Game.prototype.getCanvasSize = function() {
	return {
		width : this.canvas.width,
		height : this.canvas.height
	};
};

// Game.prototype.getLevel = function() {
	// return this.level;
// };

Game.prototype.update = function() {
	if (!this.level || !this.level.update) {
		throw new Error('Game.runLevel : undefined level or level\'s update method.');		
	}
	this.level.update();
	var self = this;
	this.timer = setTimeout(
		function() {
			self.update();
		}, 
	self.interval);
};

Game.prototype.init = function() {
	// var mapData = DATA_MAP.river01;
	// var mapData = DATA_MAP.castle01;
	var mapData = DATA_MAP.test01;
	this.level = new Level({ 
		game: this, 
		mapData: mapData,
		mapWidth: 20,
		mapHeight: 15
	});
	this.run();
};

// Game.prototype.initControlManager = function(type, element, timerKey, player) {
	// aff('Game.initControlManager');
	// this.controlManager = new ControlManager(type, element, timerKey, player);
	// aff(this.controlManager);
// };

Game.prototype.run = function() {
	this.stop();
	this.update();

};

Game.prototype.stop = function() {
	// aff('Game.stop');
	clearTimeout(this.timer);
};

Game.prototype.reset = function() {
	this.stop();
	// this.level = null;
	this.init();
};



