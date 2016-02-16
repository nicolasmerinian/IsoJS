var Level = function (data) {
	this.game = data.game;
	this.mapData = data.mapData;
	this.mapWidth = data.mapHeight;
	this.mapHeight = data.mapWidth;
	this.init();
};

Level.prototype.clearGraphics = function() {
	this.context.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
};

Level.prototype.getContext = function () {
	return this.context;
};

Level.prototype.getCanvasSize = function () {
	return this.canvasSize;
};

Level.prototype.init = function () {
	this.canvasSize = this.game.getCanvasSize();
	this.context = this.game.getContext();
	this.currentLayer = 0;
	this.layerGaugeWidth = 20;
	this.layerGaugeHeight = this.canvasSize.height - (2 * this.layerGaugeWidth);
	this.layerGaugeMax = this.layerGaugeHeight / this.layerGaugeWidth;
	this.mouseX = null;
	this.mouseY = null;
	this.selectedTile = null;
	this.mouseLeftPressed = false;
	this.zoom = 1;
	this.initMap();
};

Level.prototype.initMap = function() {
	for (var i = 0; i < this.mapWidth; i++) {
		var subArray = [];
		for (var j = 0; j < this.mapHeight; j++) {
			var subArray2 = [ [11] ];
			subArray.push(subArray2);
		}
		this.mapData.push(subArray);
	}
};

Level.prototype.update = function () {
	this.draw();
};

/**
Modifie la valeur d'un tile de coordonnées (x, y, z) en lui attribuant la valeur v.
Si le tableaux de couches n'est pas suffisamment grand, des tiles vides sont ajoutés. 
**/
Level.prototype.setTile = function(x, y, z, v) {
	// var a = this.mapData[x];
	// var b = a[y];
	// var c = b[z];
	// aff('c : ' + c);
	// [y][z] = v;
	// aff('this.mapData[x][y].length : ' + this.mapData[x][y].length);
	// aff('z : ' + z);
	while (this.mapData[x][y].length < z) {
		this.mapData[x][y].push(0);
	}
	this.mapData[x][y][z] = v;
};

Level.prototype.draw = function() {
	this.clearGraphics();
	
	// Map base
	// var mapBaseColors = ['#eee', '#bbb', '#888'];			
	// for (var i = 0; i < this.mapWidth; i++) {
		// var w2 = h2 * w / h;
		// var ty = row * w2;
		// for (var col in currentRow) {
			// var w1 = h1 * w / h;
			// var tx = (col * w1);
			// tx -= row * w1 / 1;
			// ty += w1 / 2;
			// this.drawTile(tileX, tileY , h1, h2, 2, mapBaseColors);
		// }	
	// }
	
	for (var row in this.mapData) {
		var currentRow = this.mapData[row];
		if (typeof currentRow != 'undefined') {
			var w2 = h2 * this.zoom * w / h;
			var ty = row * w2;
			for (var col in currentRow) {
				var currentCol = currentRow[col];
				var value = currentCol;
				var w1 = h1 * this.zoom * w / h;
				var tx = (col * w1);
				tx -= row * w1 / 1;
				ty += w1 / 2;
				if (typeof value != 'undefined') {
					var currentTileLayers = value;
					for (var i in currentTileLayers) {
						var tileX = tx + DATA_ORIGIN_X;
						var tileY = ty - (row * h1 * this.zoom) - (i * z * this.zoom) + DATA_ORIGIN_Y;
						var tileColors = DATA_COLORS[currentTileLayers[i]];
						if (tileColors.length == 0) {
							continue;
						}					
						// Ajout de tile
						var w1 = h1 * this.zoom * w / h;
						var w2 = h2 * this.zoom * w / h;
						this.context.beginPath();
						this.context.moveTo(tileX, tileY + h1 * this.zoom);
						this.context.lineTo(tileX + w1, tileY);
						this.context.lineTo(tileX + w1 + w2, tileY + h2 * this.zoom);
						this.context.lineTo(tileX + w2, tileY + h1 + h2 * this.zoom);
						this.context.closePath();
						if (this.context.isPointInPath(this.mouseX, this.mouseY)) {
							tileColors = ['#F9D9D1', '#C8816C', '#944224'];
							// if (this.mapData[currentCol][currentRow][this.currentLayer]) {
								// aff(this.mapData[currentCol][currentRow][this.currentLayer]);
								// this.mapData[currentCol][currentRow][this.currentLayer] = [2];
							// }
							// this.mouseLeftPressed = false;
						}
						// Minimap
						var max = Math.max(this.mapWidth, this.mapHeight);
						var size = Math.max(DATA_MINIMAP_WIDTH, DATA_MINIMAP_HEIGHT) / max;
						this.context.globalAlpha = 0.5;
						this.context.fillStyle = tileColors[1];
						this.context.strokeStyle = tileColors[2];
						this.context.fillRect(col * size, row * size, size, size);
						this.context.strokeRect(col * size, row * size, size, size);	
						// Map
						this.context.globalAlpha = 1;
						this.drawTile(tileX, tileY + (z * this.currentLayer), h1 * this.zoom, h2 * this.zoom, z * this.zoom, tileColors);

					}
				}
			}
		}
	};
	// LayerGauge
	this.context.globalAlpha = 0.5;
	this.context.fillStyle = '#ddd';
	this.context.strokeStyle = '#aaa';
	this.context.fillRect(this.layerGaugeWidth, this.layerGaugeWidth, this.layerGaugeWidth, this.layerGaugeHeight);
	this.context.strokeRect(this.layerGaugeWidth, this.layerGaugeWidth, this.layerGaugeWidth, this.layerGaugeHeight);
	for (var i = 0; i < this.layerGaugeMax; i++) {
		if (i == this.layerGaugeMax - this.currentLayer - 1) {
			// this.context.fillStyle = '#5af';
			var percent = 100 * i / this.layerGaugeMax;
			this.context.globalAlpha = 0.5;
			this.context.fillStyle = pusher.color("#FF0000").hue(percent).hex6();
			this.context.globalAlpha = 0.8;
			this.context.fillRect(this.layerGaugeWidth, this.layerGaugeWidth * (i + 1), this.layerGaugeWidth, this.layerGaugeWidth);
		}
		this.context.strokeRect(this.layerGaugeWidth, this.layerGaugeWidth * (i + 1), this.layerGaugeWidth, this.layerGaugeWidth);
		this.context.fillStyle = '#000';
		this.context.textAlign = 'center';
		this.context.textBaseline = 'middle';
		this.context.font = '12px Arial';
		this.context.fillText(this.layerGaugeMax - i - 1, this.layerGaugeWidth * 1.5, this.layerGaugeWidth * (i + 1.5));
	}
	
	// Moving selected tile
	this.context.globalAlpha = 0.8;
	if (this.selectedTile != null) {
		var cursorColors = DATA_COLORS[this.selectedTile];
		this.drawTile(this.mouseX - h1 * this.zoom - h1 * this.zoom, this.mouseY - z * this.zoom , h1 * this.zoom, h2 * this.zoom, z * this.zoom, cursorColors);
	}
	
	// Zoom
	this.context.fillStyle = '#000';
	this.context.textAlign = 'left';
	this.context.fillText('x' + this.zoom, 48, this.canvasSize.height - 32);
};

Level.prototype.drawTile = function(x,  y,  h1 /*largeur1*/,  h2 /*largeur2*/,  z /*hauteur*/,  colors) {
	// ctx.globalAlpha = 0.5;
	var w1 = h1 * w / h;
	var w2 = h2 * w / h;
	var color1 = colors[0];
	var color2 = colors[1];
	var color3 = colors[2];
	
	this.context.strokeStyle = '#000';
	
	this.context.beginPath();
	this.context.moveTo(x, y + h1);
	this.context.lineTo(x + w2, y + h1);
	this.context.lineTo(x + w2, y + h1 + h2 + z);
	this.context.lineTo(x, y + h1 + z);
	this.context.closePath();
	this.context.fillStyle = color2;
	this.context.strokeStyle = color2;
	this.context.fill();
	// this.context.stroke();

	this.context.beginPath();
	this.context.moveTo(x + w2, y + h2);
	this.context.lineTo(x + w2 + w1, y + h2);
	this.context.lineTo(x + w2 + w1, y + h2 + z);
	this.context.lineTo(x + w2, y + h2 + h1 + z);
	this.context.closePath();
	this.context.fillStyle = color3;
	this.context.strokeStyle = color3;
	this.context.fill();
	// this.context.stroke();
	
	this.context.beginPath();
	this.context.moveTo(x, y + h1);
	this.context.lineTo(x + w1, y);
	this.context.lineTo(x + w1 + w2, y + h2);
	this.context.lineTo(x + w2, y + h1 + h2);
	this.context.closePath();
	this.context.fillStyle = color1;
	this.context.strokeStyle = color2;
	this.context.fill();	
	// this.context.stroke();
	
	this.context.fillStyle = '#FF0';
	this.context.font = '20px solid arial';
	// ctx.fillText(i, x + w1 - 10, y + w2 - 10);
}

Level.prototype.setMousePosition = function(mx, my) {
	this.mouseX = mx;
	this.mouseY = my;
};


Level.prototype.fill = function() {
	for (var row in this.mapData) {
		var currentRow = this.mapData[row];
		if (typeof currentRow != 'undefined') {
			for (var col in currentRow) {
				var currentCol = currentRow[col];
				if (typeof currentCol != 'undefined') {
					if (this.selectedTile != null) {
						this.setTile(row, col, this.currentLayer, [parseInt(this.selectedTile)]);
					}
					else {
						alert('Veuillez sélectionner un terrain en bas.');
						return;
					}
				}
			}
		}
	}
};






















