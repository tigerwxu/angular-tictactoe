import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AIService } from '../services/ai.service';

enum GameMode
{
    pvp,
    pvc
}

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit
{

    board: ('X' | 'O')[];
    xIsNext: boolean;
    winner: 'X' | 'O' | 'TIE';

    gameMode: GameMode;

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void
    {
        this.newGame();
        this.gameMode = GameMode[this.route.snapshot.url[0].path as keyof typeof GameMode];
    }

    newGame()
    {
        this.board = new Array(9).fill(null);
        this.winner = null;
        this.xIsNext = true;
    }

    makeMove(i: number)
    {
        // Stop game if winner already found
        if (this.winner) return;

        // Check if square has been clicked, insert piece if not
        if (!this.board[i])
        {
            this.board[i] = this.nextPlayer;
            this.xIsNext = !this.xIsNext;
        }

        this.winner = this.checkWinner();
    }

    aiMove()
    {
        if (this.gameMode === GameMode.pvc)
        {
            this.cpuRandomMove();
        }
    }

    /**
     * Check if there are three same letters in a line anywhere
     * @returns The winner's letter, or null if there is no winner
     */
    checkWinner()
    {
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
        for (let i = 0; i < lines.length; i++)
        {
            const [a, b, c] = lines[i];
            if (
                this.board[a] &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]
            )
            {
                return this.board[a];
            }
        }
        if (!this.board.includes(null)) return "TIE";
        return null;
    }

    get nextPlayer()
    {
        return this.xIsNext ? 'X' : 'O';
    }

    get waitingPlayer()
    {
        return this.xIsNext? 'O' : 'X';
    }

    get result()
    {
        if (this.winner === "TIE") return "The game was a tie!";
        if (this.winner) return `Player ${this.winner} won the game!`;
        return "";
    }

    /**
     * Makes move on a randomly chosen vacant square for the current player
     */
    cpuRandomMove()
    {
        let emptySpots = [];
        for (let i = 0; i < this.board.length; i++)
        {
            if (this.board[i] === null)
            {
                emptySpots.push(i);
            }
        }
        const myMove = emptySpots[Math.floor(Math.random() * emptySpots.length)];
        this.makeMove(myMove);
    }

    /**
     * Makes the optimal move using the minimax algorithm for the current player
     */
    // cpuOptimumMove()
    // {
    //     let bestMove;
    //     let bestScore = -Infinity;

    //     const minimax = (maximising: boolean) =>
    //     {
    //         const currentPlayer = maximising ? this.nextPlayer : 
    //         let score = maximising ? -Infinity : Infinity;
    //         // Return the score if the game has ended
    //         switch(this.checkWinner())
    //         {
    //             case this.nextPlayer:
    //                 return 1;
    //             case "TIE":
    //                 return 0;
    //             case null:
    //                 break;
    //             default:
    //                 return -1;
    //         }

    //         for (let i = 0; i < this.board.length; i++) 
    //         {
    //             if (this.board[i] === null) // Check each possible next move
    //             {
    //                 this.board[i] = 
    //             }
    //         }
    //     }
    // }

    //     for (let i = 0; i < this.board.length; i++)
    //     {
    //         if (this.board[i] === null) // Check each possible next move
    //         {
    //             this.board[i] = this.player;
    //             let currScore = minimax(false); // Check how optimal this move is
    //             this.board[i] = null;
    //             if (currScore > bestScore)
    //             { // If this move is the best so far, remember it
    //                 bestScore = currScore;
    //                 bestMove = i;
    //             }
    //         }
    //     }



    // function minimax(board: string[], isMyMove: boolean)
    // {
    //     // Check if the game is already over
    //     let score = this.checkWinner(board);
    //     if (score != null) return score;

    //     // If not, recursively minimax till it is over
    //     let bestMove;
    //     let bestScore = isMyMove ? -Infinity : Infinity;
    //     for (let i = 0; i < board.length; i++)
    //     {
    //         if (!board[i])
    //         {
    //             board[i] = isMyMove ? "O" : "X";
    //             let currScore = this.minimax(board, !isMyMove);
    //             board[i] = null;
    //             // If it's my move i'll maximise score, opponent will minimise it
    //             if (isMyMove)
    //             {
    //                 if (currScore > bestScore)
    //                 {
    //                     bestScore = currScore;
    //                 }
    //             } else
    //             {
    //                 if (currScore < bestScore)
    //                 {
    //                     bestScore = currScore;
    //                 }
    //             }
    //         }
    //     }
    //     return bestScore;
    // }
}
