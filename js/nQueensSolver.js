var solveNQueens = function(n, solveDelay, displayDelay, solveQueens){
  var chessBoard = new ChessboardModel({n: n});
  var allSolutions = [];
  var workingBoard;

  var findWorkingSolutions = function (workingArray, remainingArray, returnArray) {
    var tempWorkingArray;
    var tempRemainingArray;
    var l = remainingArray.length;
    if (l > 0) {
      for (var i = 0; i < l; i += 1) {
        tempWorkingArray = workingArray.slice(0);
        tempRemainingArray = remainingArray.slice(0);
        tempWorkingArray.push(tempRemainingArray.splice(i, 1)[0]);
        findWorkingSolutions(tempWorkingArray, tempRemainingArray, returnArray);
      }
    } else {
      returnArray.push(workingArray);
    }
    return returnArray;
  };

// 
  var setupBoard = function(startingSetup) {
    chessBoard.clearPieces();
    _.each(startingSetup, function(value, key) {
      chessBoard.togglePiece(key, startingSetup[key]);
    });
  }

  var convertBoardtoArray = function(startingBoard) {
    return _.map(startingBoard, function(value) {
      return _.pluck(value, "piece");
    });
  }

  var showSolutions = function() {
    alert("Are you ready to see the solutions?");
    window.showSolutions = setInterval(function() {
      chessboardView.model.setSimpleBoard(allSolutions[0]);
      allSolutions.unshift(allSolutions.pop());
    }, displayDelay || 500);
  }

  var solutionWorkingList = findWorkingSolutions([], _.range(n), []);

  window.findSolutions = setInterval(function() {
    setupBoard(solutionWorkingList[0]);
    workingBoard = convertBoardtoArray(chessBoard.get('board'));
    solveDelay && window.chessboardView.model.setSimpleBoard(workingBoard);
    solveQueens && chessBoard.hasQueensConflict() || allSolutions.push(workingBoard);
    solutionWorkingList.shift();
    if (solutionWorkingList.length === 0) {
      clearInterval(findSolutions);
      allSolutions.length === 0 ? alert("Your board has no solutions.") : showSolutions();
    };
  }, solveDelay || 0);
}