import { isLoweredSymbol } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AIService {

  constructor() { }

  makeRandomMove(board: string[]) {
    let emptySpots = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] == null) emptySpots.push(i)
    }

    return emptySpots[Math.floor(Math.random() * emptySpots.length)]
  }

  makeOptimumMove(board: string[]) {
    // Check each possible next move
    let bestMove;
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = "O";
        let currScore = this.minimax(board, false); // Check how optimal this move is
        board[i] = null;
        if (currScore > bestScore) { // If this move is the best so far, remember it
          bestScore = currScore;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }

  minimax(board: string[], isMyMove: boolean) {
    // Check if the game is already over
    let score = this.checkWinner(board);
    if (score) return score;

    // If not, recursively minimax till it is over
    let bestMove;
    let bestScore = isMyMove ? -Infinity : Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = isMyMove ? "O" : "X";
        let currScore = this.minimax(board, !isMyMove);
        board[i] = null;
        // Make the best move depending on whose turn it is
        if (isMyMove ? currScore > bestScore : currScore < bestScore) {
          bestScore = currScore;
        }
      }
    }
    return bestScore;
  }

  checkWinner(board: string[]) {
    if (!board.includes(null)) return 0;
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return board[a] === 'X' ? -1 : 1;
      }
    }
    return null;
  }
}
