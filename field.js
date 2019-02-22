/**
 * @author Vojtech Sebo
 * @class Field
 */

class Field {
  /**
   * Creates an instance of Field.
   * @param {element} game
   * @param {number} x
   * @param {number} y
   * @param {boolean} isMine
   * @param {number} hint
   * @memberof Field
   */
  constructor(game, x, y, isMine, hint) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.hint = hint;
    this.isMine = isMine;
    this.isMark = false;
    this.isShow = false;

    this._render();
  }

  /**
   * Render field to the DOM
   * @memberof Field
   */
  _render = () => {
    this._field = document.createElement('div');
    this.game.target.appendChild(this._field);

    this._field.addEventListener('click', this._actionClick);
    this._field.addEventListener('contextmenu', this._markClick);
  };

  /**
   * Right click handler
   * @memberof Field
   */
  _actionClick = () => {
    this.show();

    if (this.isMine) {
      this.game.loss();
    } else {
      if (this.hint === 0) {
        this.game.checkSurround(this.x, this.y, this.isShow);
      }

      this.game.checkStatus();
    }
  };

  /**
   * Left click handler
   * @param {event} e
   * @memberof Field
   */
  _markClick = e => {
    e.preventDefault();

    if (this.isShow) {
      return;
    }

    if (!this.isMark) {
      this._field.setAttribute('mark', true);
      this.isMark = true;
    } else {
      this._field.removeAttribute('mark', true);
      this.isMark = false;
    }
  };

  /**
   * Show field
   * @memberof Field
   */
  show = () => {
    this.isShow = true;
    this._field.removeAttribute('mark', true);
    this._field.setAttribute('show', true);

    if (this.isMine) {
      this._field.setAttribute('mine', true);
    } else if (this.hint !== 0) {
      this._field.textContent = this.hint;
    }
  };
}
