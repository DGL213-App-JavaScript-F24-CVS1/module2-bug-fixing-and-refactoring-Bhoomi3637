const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const CELL_WIDTH = canvas.width / 3; // 3x3 grid, each cell width
const CELL_HEIGHT = canvas.height / 3; // Each cell height
const CELLS_PER_AXIS = 3; // 3x3 grid for Tic-Tac-Toe

let currentPlayer = "X"; // Track current player
let grid = Array(CELLS_PER_AXIS * CELLS_PER_AXIS).fill(null); // Empty grid
let grids = []; // History of moves
let lastGridState = null; // To store the last move state


function render(grid) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before rendering

  for (let i = 0; i < grid.length; i++) {
    ctx.fillStyle = grid[i] === "X" ? "blue" : grid[i] === "O" ? "red" : "white";
    ctx.fillRect((i % CELLS_PER_AXIS) * CELL_WIDTH, Math.floor(i / CELLS_PER_AXIS) * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    ctx.strokeRect((i % CELLS_PER_AXIS) * CELL_WIDTH, Math.floor(i / CELLS_PER_AXIS) * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (grid[i]) {
      ctx.fillText(grid[i], (i % CELLS_PER_AXIS) * CELL_WIDTH + CELL_WIDTH / 2, Math.floor(i / CELLS_PER_AXIS) * CELL_HEIGHT + CELL_HEIGHT / 2);
    }
  }
}

function updateGridAt(mousePositionX, mousePositionY) {
  const gridCoordinates = convertCartesiansToGrid(mousePositionX, mousePositionY);
  const index = gridCoordinates.row * CELLS_PER_AXIS + gridCoordinates.column;

  if (grid[index] === null) { // Only update if the cell is empty
    lastGridState = grid.slice();
    grid[index] = currentPlayer;
    currentPlayer = currentPlayer === "X" ? "O" : "X"; // Toggle player
    grids.push(grid.slice());
    render(grid);

    const winner = checkForWinner(grid);
    if (winner) {
      document.getElementById("winner").textContent = `${winner} wins!`;
    }
  }
}

function checkForWinner(grid) {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal wins
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical wins
    [0, 4, 8], [2, 4, 6]  // Diagonal wins
  ];

  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
      return grid[a]; // Return "X" or "O" as winner
    }
  }

  return null; // No winner yet
}

function convertCartesiansToGrid(xPos, yPos) {
  return {
    column: Math.floor(xPos / CELL_WIDTH),
    row: Math.floor(yPos / CELL_HEIGHT)
  };
}

// Reset Game
document.getElementById("reset").addEventListener("click", () => {
  grid = Array(CELLS_PER_AXIS * CELLS_PER_AXIS).fill(null);
  currentPlayer = "X";
  grids = [];
  document.getElementById("winner").textContent = '';
  render(grid);
});

// undo functinality
    // Undo Last Move (only last move)
    document.getElementById("undo").addEventListener("click", () => {
        if (lastGridState) {
            grid = lastGridState; // Revert to the previous grid state
            currentPlayer = currentPlayer === "X" ? "O" : "X"; // Revert player
            lastGridState = null; // Reset lastGridState
            render(grid);
            document.getElementById("winner").textContent = ''; // Clear winner text on undo
        }
    });

// Handle mouse click on canvas
canvas.addEventListener("mousedown", function(event) {
  updateGridAt(event.offsetX, event.offsetY);
});

// Initial rendering
render(grid);
