import { Component, OnInit } from '@angular/core';
import { AIService } from '../services/ai.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  
  squares: any[];
  xIsNext: boolean;
  winner: string;
  turns: number;

  constructor(private ai: AIService) { }

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.squares = new Array(9).fill(null);
    this.winner = null;
    this.xIsNext = true;
    this.turns = 0;
  }

  makeMove(i: number) {
    // Stop game if winner already found
    if (this.winner) return;

    // Check if square has been clicked, insert piece if not
    if (!this.squares[i]) {
      console.log(this.squares[i])
      this.squares[i] = this.player;
      this.xIsNext = !this.xIsNext;
      this.turns++;
    }
    
    this.winner = this.calculateWinner();

    if (!this.xIsNext && this.turns < 9) {
      debugger
      this.makeMove(this.ai.makeOptimumMove(this.squares))
    }
  }

  /**
   * Check if there are three same letters in a line anywhere
   * @returns The winner's letter, or null if there is no winner
   */
  calculateWinner() {
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
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        return this.squares[a];
      }
    }
    return null;
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  get result() {
    if (this.winner) return `Player ${this.winner} won the game!`;
    if (this.turns >= 9) return "The game was a tie!";
    return "";
  }


}
