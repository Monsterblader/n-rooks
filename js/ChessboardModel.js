(function(){

  var ChessboardModel = Backbone.Model.extend({
    initialize: function(params){
      if (params.n) {
        this.clearPieces();
      } else {
        this.setSimpleBoard(params.board);
      }
    },

    clearPieces: function(){
      this.set('board', this.makeEmptyBoard());
    },

    setSimpleBoard: function(simpleBoard){
      this.set('board', this.makeBoardFromSimpleBoard(simpleBoard));
      this.set('n', this.get('board').length);
    },

    makeBoardFromSimpleBoard: function(simpleBoard){
      var that = this;
      return _.map(simpleBoard, function(cols, r){
        return _.map(cols, function(hasPiece, c){
          return {
            row: r,
            col: c,
            piece: hasPiece,
            sign: ((r+c)%2),
            inConflict: function(){
              // todo: how expensive is this inConflict() to compute?
              return (
                that.hasRowConflictAt(r) ||
                that.hasColConflictAt(c) ||
                that.hasUpLeftConflictAt(that._getUpLeftIndex(r, c)) ||
                that.hasUpRightConflictAt(that._getUpRightIndex(r, c))
              );
            }
          };
        }, this);
      }, this);
    },

    makeEmptyBoard: function(){
      var board = [];
      _.times(this.get('n'), function(){
        var row = [];
        _.times(this.get('n'), function(){
          row.push(false);
        }, this);
        board.push(row);
      }, this);
      return this.makeBoardFromSimpleBoard(board);
    },

    // we want to see the first row at the bottom, but html renders things from top down
    // So we provide a reversing function to visualize better
    reversedRows: function(){
      return _.extend([], this.get('board')).reverse();
    },

    togglePiece: function(r, c){
      this.get('board')[r][c].piece = !this.get('board')[r][c].piece;
      this.trigger('change');
    },

    _getUpLeftIndex: function(r, c){
      return r + c;
    },

    _getUpRightIndex: function(r, c){
      return this.get('n') - c + r - 1;
    },


    hasRooksConflict: function(){
      return /*this.hasAnyRowConflict() ||*/ this.hasAnyColConflict();
    },

    hasQueensConflict: function(){
      return /*this.hasRooksConflict() ||*/ this.hasAnyUpLeftConflict() || this.hasAnyUpRightConflict();
    },

    _isInBounds: function(r, c){
      return 0 <= r && r < this.get('n') && 0 <= c && c < this.get('n');
    },


    // todo: fill in all these functions - they'll help you!

    hasAnyRowConflict: function(){
      return _.some(this.get('board'), function(val, i) { return this.hasRowConflictAt(i); }, this);
    },

    hasRowConflictAt: function(r){
      var occupiedEmptySquareCount = _.pluck(this.get('board')[r], "piece");
      return _.countBy(occupiedEmptySquareCount, function(val) { return val; }).true > 1;
    },

    hasAnyColConflict: function(){
      return _.some(this.get('board'), function(val, i) { return this.hasColConflictAt(i); }, this);
    },

    // Completed.  Could rewrite as one line, but written as three for readability.
    hasColConflictAt: function(c){
      var board = this.get('board');
      var mapResults = _.map(board, function(val, key) { return board[key][c].piece; });
      return _.countBy(mapResults, function(val) { return val }).true > 1;
    },

    hasAnyUpLeftConflict: function(){
      var boardDimension = this.get('n');
      for (var i = 0; i < boardDimension; i += 1) {
        if (this.upLeftTraverse(boardDimension - 1, i)) { return true; };
      }
      for (var i = boardDimension - 2; i >= 0; i -= 1) {
        return this.upLeftTraverse(i, 0);
      }
    },

    upLeftTraverse: function(a, b) {
      var upLeftIndex = {r: a, c: b};
      return this.hasUpLeftConflictAt(upLeftIndex);
    },

    //The direction of testing is down to the left, despite the name of the test.  The test name reflects the way chess squares are counted which is a mirror of the way arrays are counted.
    hasUpLeftConflictAt: function(upLeftIndex){
      var numofPieces = 0;
      while (upLeftIndex.r >= 0 && upLeftIndex.c < this.get('board').length && numofPieces < 2) {
        if (this.get('board')[upLeftIndex.r--][upLeftIndex.c++].piece) { numofPieces += 1; }
      }
      return numofPieces > 1;
    },

    hasAnyUpRightConflict: function(){
      var boardDimension = this.get('n');
      for (var i = 0; i < boardDimension; i += 1) {
        if (this.upRightTraverse(boardDimension - 1, i)) { return true; };
      }
      for (var i = boardDimension - 2; i >= 0; i -= 1) {
        return this.upRightTraverse(i, boardDimension - 1);
      }
    },

    hasUpRightConflictAt: function(upRightIndex){
      var numofPieces = 0;
      while (upRightIndex.r >= 0 && upRightIndex.c >= 0 && numofPieces < 2) {
        if (this.get('board')[upRightIndex.r--][upRightIndex.c--].piece) { numofPieces += 1; }
      }
      return numofPieces > 1;
    },

    upRightTraverse: function(a, b) {
      var upRightIndex = {r: a, c: b};
      return this.hasUpRightConflictAt(upRightIndex);
    }
  });

  this.ChessboardModel = ChessboardModel;

}());
