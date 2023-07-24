import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=5, ncols=5, chanceLightStartsOn=0.25 }) {
  // Each element of the board array represents a cell, and it contains 
  // a boolean value indicating whether the cell is "lit" (true) or "unlit" (false).
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  /** chanceLightStartsOn represents the probability that a cell should be considered "lit." It is a value between 0 and 1. **/
  function createBoard() {
    return Array.from({ length: nrows }).map(
          row => Array.from({ length: ncols}).map(
            cell => Math.random() < chanceLightStartsOn
          )
    )
  }

  // check the board in state to determine whether the player has won.

  // The every method is called twice in a nested manner. The outer every method is called on the board array, 
  // and it checks each row (an element of board) to see if every cell in that row meets the condition specified 
  // by the inner every method.
  // cell => !cell:
  // The inner every method is called on each row (representing a row of cells in the board). It checks each cell 
  // (an element of row) to see if it is "unlit" (i.e., has the value false). The condition !cell evaluates to true when
  //  the cell is false, and false when the cell is true.
  function hasWon() {
    return board.every(row => row.every(cell => !cell));
  }

  // The flipCellsAround function is used to update the state of the game board by flipping the cell at a specified coordinate
  // and its adjacent cells if they exist on the board. It creates a copy of the board, updates the copy with the flipped cells,
  // and returns the updated board copy to update the state.
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        
        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // make copy of the old board. This is done to avoid directly modifying the original
      // oldBoard array, as it is not recommended to directly mutate the state in React.
      const boardCopy = oldBoard.map(row => [...row])
      
      // it represents a cell and its adjacent cells
      flipCell(y, x, boardCopy);
      flipCell(y, x - 1, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y + 1, x, boardCopy);

      return boardCopy;

    });
  }

  // make table board

  let tblBoard = [];

  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let coord = `${y}-${x}`;
      row.push(
          <Cell
              key={coord}
              isLit={board[y][x]}
              flipCellsAroundMe={evt => flipCellsAround(coord)}
          />,
      );
    }
    tblBoard.push(<tr key={y}>{row}</tr>);
  }

  return (
    <table className="Board">
    <tbody> {tblBoard} </tbody>
    </table>
  )

  
}

export default Board;
