import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
            this.cpuOptimumMove();
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
    cpuOptimumMove()
    {
        let bestMove;
        let bestScore = -Infinity;

        for (let i = 0; i < this.board.length; i++)
        {
            if (this.board[i] === null) // Check each possible next move
            {
                this.board[i] = this.nextPlayer;
                let currScore = this.minimax(false, 1); // Next turn will be opponent's
                this.board[i] = null;
                if (currScore > bestScore)
                { // If this move is the best so far, remember it
                    bestScore = currScore;
                    bestMove = i;
                }
            }
        }

        this.makeMove(bestMove);
    }

    private minimax(maximising: boolean, depth: number)
    {
        const currentPlayer = maximising ? this.nextPlayer : this.waitingPlayer;
        let score = maximising ? -Infinity : Infinity;
        // Return the score if the game has ended
        switch(this.checkWinner())
        {
            case this.nextPlayer:
                return 100;
            case "TIE":
                return 0;
            case null:
                break;
            default:
                return -100;
        }

        //Otherwise, recursively call minimax until the game does end
        let bestScore = maximising ? -Infinity : Infinity;
        for (let i = 0; i < this.board.length; i++) 
        {
            if (this.board[i] === null) // Check each possible next move
            {
                this.board[i] = currentPlayer;
                const currScore = this.minimax(!maximising, depth + 1);
                // Keep highest score if maximising (my turn), lowest score if minimising (opponent turn)
                // Depth is added to the score to prefer shorter game if outcome is the same
                bestScore = maximising ? Math.max(bestScore, currScore - depth) : Math.min(bestScore, currScore + depth);
                this.board[i] = null;
            }
        }
        return bestScore;
    }
}
