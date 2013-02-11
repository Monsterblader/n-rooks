var solveNRooks = function(n, solveDelay, displayDelay){
	var chessBoard = new ChessboardModel({n: n});
	var solution = chessBoard.get('board');
	var allSolutions = [];

// Initialize chess board for number counting algorithm.
	for (var i = 0; i < n; chessBoard.togglePiece(i++, 0)) {};

// 
	var convertBoardtoArray = function(startingBoard) {
		return _.map(startingBoard, function(value) {
			return _.pluck(value, "piece");
		});
	}

	var nextConfiguration = function(r) {
		r < n - 1 && solution[r][n - 1].piece && nextConfiguration(r + 1);
		solution[r].unshift(solution[r].pop());
	}

	var showSolutions = function() {
		window.showSolutions = setInterval(function() {
			if(allSolutions.length === 0) {
				alert("Your board has no solutions.");
				clearInterval(window.showSolutions);
			} else {
				chessboardView.model.setSimpleBoard(allSolutions[0]);
				allSolutions.unshift(allSolutions.pop());
			}
		}, displayDelay || 500);
	}

	window.findSolutions = setInterval(function() {
		solveDelay && window.chessboardView.model.setSimpleBoard(convertBoardtoArray(solution));
		chessBoard.hasRooksConflict() || allSolutions.push(convertBoardtoArray(solution));
		nextConfiguration(0);
	  if (_.every(convertBoardtoArray(solution), function(value) { return value[0] })) {
	  	clearInterval(findSolutions);
	  	alert("Are you ready to see the solutions?");
	  	showSolutions();
	  };
	}, solveDelay || 0);
}