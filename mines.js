/**
 * @author Vojtech Sebo
 * @class Mines
 */

class Mines {
  /**
   * Creates an instance of Mines.
   * @param {element} target
   * @param {number} [cols=15]
   * @param {number} [rows=15]
   * @param {number} [mines=35]
   * @memberof Mines
   */
  constructor(target, cols = 15, rows = 15, mines = 35) {
    this.target = target;
    this._cols = cols;
    this._rows = rows;
    this._mines = mines;

    this.start();
  }

  /**
   * Start new game
   * @memberof Mines
   */
  start = () => {
    this.target.innerHTML = '';
    this._createGame();
  };

  /**
   * Make mines
   * @memberof Mines
   */
  _makeMines = () => {
    let minesPos = [];

    while (minesPos.length < this._mines) {
      let x = Math.floor(Math.random() * this._rows);
      let y = Math.floor(Math.random() * this._cols);

      if (!minesPos.filter(a => a.x === x && a.y === y).length > 0) {
        minesPos.push({ x, y });
      }
    }

    return minesPos;
  };

  /**
   * Create game
   * @memberof Mines
   */
  _createGame = () => {
    this._fields = [];
    let mines = this._makeMines();

    for (let r = 0; r < this._rows; r++) {
      let row = [];

      for (let c = 0; c < this._cols; c++) {
        let isMine = false;
        let hint = false;

        if (mines.filter(mine => mine.x === r && mine.y === c).length > 0) {
          isMine = true;
        } else {
          hint = this._countHints(mines, r, c);
        }

        row.push(new Field(this, r, c, isMine, hint));
      }

      this._fields.push(row);
    }

    this.target.style.gridTemplate = `repeat(${this._rows}, 1fr) / repeat(${this._cols}, 1fr)`;
  };

  /**
   * Calculate hint number
   * @memberof Mines
   * @param {array} mines
   * @param {number} x
   * @param {number} y
   */
  _countHints = (mines, x, y) => {
    return mines.filter(
      mine =>
        (mine.x === x - 1 && mine.y === y) ||
        (mine.x === x + 1 && mine.y === y) ||
        (mine.x === x && mine.y === y - 1) ||
        (mine.x === x && mine.y === y + 1) ||
        (mine.x === x + 1 && mine.y === y + 1) ||
        (mine.x === x - 1 && mine.y === y - 1) ||
        (mine.x === x + 1 && mine.y === y - 1) ||
        (mine.x === x - 1 && mine.y === y + 1)
    ).length;
  };

  /**
   * Show surround fields
   * @memberof Mines
   * @param {number} x
   * @param {number} y
   */
  checkSurround = (x, y) => {
    let fields = [
      { x: x - 1, y },
      { x, y: y + 1 },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x: x + 1, y: y - 1 },
      { x: x + 1, y: y + 1 },
      { x: x - 1, y: y - 1 },
      { x: x - 1, y: y + 1 }
    ];

    fields = fields.filter(field => {
      if (field.x >= 0 && field.y >= 0 && field.x < this._rows && field.y < this._cols) {
        if (!this._fields[field.x][field.y].isShow && !this._fields[field.x][field.y].isMine) {
          this._fields[field.x][field.y].show();
          if (this._fields[field.x][field.y].hint === 0) {
            this.checkSurround(field.x, field.y);
          }
        }
      }
    });
  };

  /**
   * Check if the game is over
   * @memberof Mines
   */
  checkStatus = () => {
    if (
      this._fields.filter(row => row.filter(field => !field.isMine && !field.isShow).length)
        .length === 0
    ) {
      this._win();
    }
  };

  /**
   * Show all mines
   * @memberof Mines
   */
  _showMines = () => {
    this._fields.forEach(row =>
      row.forEach(field => {
        if (field.isMine) field.show();
      })
    );
  };

  /**
   * User win the game
   * @memberof Mines
   */
  _win = () => {
    setTimeout(() => {
      if (confirm('Vyhrál jsi? Chceš hrát znovu?')) this.start();
    }, 100);
  };

  /**
   * User lost the game
   * @memberof Mines
   */
  loss = () => {
    setTimeout(() => {
      if (confirm('Prohral jsi? Chceš hrát znovu?')) this.start();
    }, 100);

    this._showMines();
  };
}
