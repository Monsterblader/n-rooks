$(function(){
  window.chessboardView = new ChessboardView();
  $("body").append(chessboardView.render());
});

// var solveforRooks = function() {
// 	if (window.showSolutions) {
// 		clearInterval(window.findSolutions);
// 		clearInterval(window.showSolutions);
// 	}
// 	solveNRooks($("#boardSize").val(), $("#solveDelay").val(), $("#displayDelay").val());
// }

var solveforQueens = function(solveQueens) {
	if (window.showSolutions) {
		clearInterval(window.findSolutions);
		clearInterval(window.showSolutions);
	}
	solveNQueens($("#boardSize").val(), $("#solveDelay").val(), $("#displayDelay").val(), solveQueens);
}

// give people the ability to choose between showing first solution and showing all solutions.