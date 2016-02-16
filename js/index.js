var shiftKey = false;
var ctrlKey = false;

$(window).ready(function() {
	canvasElement = document.getElementById('canvasElement');
	if (!canvasElement || !canvasElement.getContext) {
		return;
	}
	game = new Game(canvasElement, DATA_INTERVAL);
	
	var body = document.getElementsByTagName('body')[0];
	body.addEventListener('keydown', keyDownHandler, false);
	body.addEventListener('keyup', keyUpHandler, false);
	body.addEventListener('keypress', keyPressHandler, false);
	window.addEventListener('mousemove', mouseMoveHandler, false);
	
	$('#canvasElement').bind("mousewheel DOMMouseScroll", function(event) {
		event.preventDefault();
		if (event.originalEvent.wheelDelta >= 0) {
			if (shiftKey) {
				game.level.zoom = ((game.level.zoom * 10) + 1) / 10;
				if (game.level.zoom > DATA_ZOOM_MAX) {
					game.level.zoom = DATA_ZOOM_MAX;
				}
			}
			else {
				game.level.currentLayer += 1;
				if (game.level.currentLayer >= game.level.layerGaugeMax) {
					game.level.currentLayer = game.level.layerGaugeMax - 1;
				}
			}
		}
		else {
			if (shiftKey) {
				game.level.zoom = ((game.level.zoom * 10) - 1) / 10;
				if (game.level.zoom < DATA_ZOOM_MIN) {
					game.level.zoom = DATA_ZOOM_MIN;
				}
			}
			else {
				game.level.currentLayer -= 1;
				if (game.level.currentLayer < 0) {
					game.level.currentLayer = 0;
				}
			}
		}
	});
	
	$('#canvasElement').on('mousedown', function(event) {
		game.level.mouseLeftPressed = true;
	});
	
	$('#canvasElement').on('mouseup', function(event) {
		game.level.mouseLeftPressed = false;
	});
	
	$('#canvasElement').on('click', function(event) {
		var lvl = game.level;
		var zoom = game.level.zoom;
		for (var row in lvl.mapData) {
			var currentRow = lvl.mapData[row];
			if (typeof currentRow != 'undefined') {
				var w2 = h2 * zoom * w / h;
				var ty = row * w2;
				for (var col in currentRow) {
					var currentCol = currentRow[col];
					var value = currentCol;
					var w1 = h1 * zoom * w / h;
					var tx = (col * w1);
					tx -= row * w1 / 1;
					ty += w1 / 2;
					if (typeof value != 'undefined') {
						var currentTileLayers = value;
						for (var i in currentTileLayers) {
							var tileX = tx + DATA_ORIGIN_X;
							var tileY = ty - (row * h1 * zoom) - (i * z * zoom) + DATA_ORIGIN_Y;
							var tileColors = DATA_COLORS[currentTileLayers[i]];
							if (tileColors.length == 0) {
								continue;
							}
							// Ajout de tile
							var w1 = h1 * zoom * w / h;
							var w2 = h2 * zoom * w / h;
							lvl.context.beginPath();
							lvl.context.moveTo(tileX, tileY + h1 * zoom);
							lvl.context.lineTo(tileX + w1, tileY);
							lvl.context.lineTo(tileX + w1 + w2, tileY + h2 * zoom);
							lvl.context.lineTo(tileX + w2, tileY + h1 * zoom + h2 * zoom);
							lvl.context.closePath();
							if (lvl.context.isPointInPath(lvl.mouseX, lvl.mouseY)) {
								if (parseInt(lvl.selectedTile) >= 0 && parseInt(lvl.selectedTile) < DATA_COLORS.length) {
									lvl.setTile(row, col, lvl.currentLayer, [parseInt(lvl.selectedTile)]);
								}
								else {
									alert('Veuillez sélectionner un terrain en bas.');
								}
							}
						}
					}
				}
			}
		};
	});
	
	
	// Tileset
	var $tileset = $('#tileset').find('tr').eq(0);
	for (var i in DATA_COLORS) {
		var $td = $('<td>').attr('id', i).css('width', '32px').css('height', '32px').css('background-color', DATA_COLORS[i][1]).css('border', '1px solid black');
		$tileset.append($td);
	}
	
	$tileset.find('td').click(function() {
		game.level.selectedTile = $(this).attr('id');
	});
	
	$('#buttonFill').click(function() {
		game.level.fill();
	});

	
});

function aff(s) {
	console.info('Test : ' + s);
};

function mouseMoveHandler(event) {
	var mx = event.pageX - canvasElement.offsetLeft;
	var my = event.pageY - canvasElement.offsetTop;
	var sx = mx;
	var sy = my;
	if (sx < 0) {
		sx = 0;
	}
	else if (sx > canvasElement.width) {
		sx = canvasElement.width;
	}
	if (sy < 0) {
		sy = 0;
	}
	if (sy > canvasElement.height) {
		sy = canvasElement.height;
	}
	game.level.setMousePosition(sx, sy);
}

function keyDownHandler (event) {
	// aff(event.keyCode);
	switch (event.keyCode) {
		case DATA_KEYBOARD.SHIFT :
			shiftKey = true;
			break;
		case 17 : // Ctrl
			ctrlKey = true;
			break;
	}				
};

function keyUpHandler (event) {
	// aff(event.keyCode);
	switch (event.keyCode) {
		case DATA_KEYBOARD.SHIFT :
			shiftKey = false;
			break;
		case 17 : // Ctrl
			ctrlKey = false;
			break;
	}	
};


function keyPressHandler (event) {
	// aff(event.keyCode);
	switch (event.keyCode) {
		case DATA_COMMANDS.FILL:
			game.level.fill();
			break;
	}	
};
