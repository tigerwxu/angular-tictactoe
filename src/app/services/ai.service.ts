import { isLoweredSymbol } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AIService {

  constructor() { }

  nextMove(board: string[]) {
    let emptySpots = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] == null) emptySpots.push(i)
    }

    return emptySpots[Math.floor(Math.random() * emptySpots.length)]
  }
}
