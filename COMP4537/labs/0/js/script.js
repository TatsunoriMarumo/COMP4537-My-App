import { messages } from "../lang/messages/en/user.js";

class MemoryButton {
  constructor(order, color) {
    this.btn = document.createElement("button");
    this.btn.classList.add("memory-btn");
    this.btn.style.backgroundColor = color;
    this.btn.textContent = String(order);
    this.order = order;
    this.isNumberVisible = true;
  }

  hideNumber() {
    this.isNumberVisible = false;
    this.btn.classList.add("hidden");
  }

  showNumber() {
    this.isNumberVisible = true;
    this.btn.classList.remove("hidden");
  }

  setLocation(x, y) {
    this.btn.classList.add("shuffled");
    this.btn.style.left = x + "px";
    this.btn.style.top = y + "px";
  }
}

class UI {
  constructor() {
    this.inputLabel = document.getElementById("input-label");
    this.inputField = document.getElementById("btn-count-input");
    this.goBtn = document.getElementById("go-btn");
    this.messageArea = document.getElementById("message-area");
    this.gameArea = document.getElementById("game-area");

    this.inputLabel.textContent = messages.inputLabel;
    this.goBtn.textContent = messages.btnLabel;

    this.goBtn.addEventListener("click", () => {
      this.onClickGo();
    });
  }

  onClickGo() {
    this.messageArea.classList.remove("rainbow-text")
    const userInput = this.inputField.value;
    const numberOfMemoryButtons = this.convertUserInputToInt(userInput);
    const isValidInput = this.validateUserInput(numberOfMemoryButtons);
    if (!isValidInput) {
      this.showMessage(messages.errorMessage);
      return;
    }

    this.clearMessage();
    this.clearGameArea();
    this.inputField.value = "";

    const game = new Game(numberOfMemoryButtons, this.gameArea, this);
    game.start();
  }

  convertUserInputToInt(value) {
    value.trim();
    return value | 0;
  }

  validateUserInput(value) {
    return value >= 3 && value <= 7;
  }

  showMessage(message) {
    this.messageArea.textContent = message;
  }

  clearMessage() {
    this.messageArea.textContent = "";
  }

  clearGameArea() {
    while (this.gameArea.firstChild) {
      this.gameArea.removeChild(this.gameArea.firstChild);
    }
  }
}

class Game {
  constructor(numberOfButtons, gameArea, ui) {
    this.numberOfButtons = numberOfButtons;
    this.gameArea = gameArea;
    this.ui = ui;
    this.buttons = [];
    this.currentButtonOrder = 1;
  }

  start() {
    this.createButtons();
    this.renderButtons();
    setTimeout(() => {
      this.shuffleButtonsWithInterval(() => {
        this.hideAllNumbers();
      });
    }, 1000 * this.numberOfButtons);
  }

  // This code was assisted by ChatGPT.
  shuffleButtonsWithInterval(onComplete) {
    let counter = 0;

    const shuffle = () => {
      this.shuffleButtonsPosition();
      counter++;
      if (counter < this.numberOfButtons) {
        setTimeout(shuffle, 2000);
      } else {
        onComplete();
      }
    };
    shuffle();
  }

  createButtons() {
    const colors = this.getRandomColors(this.numberOfButtons);
    for (let i = 1; i <= this.numberOfButtons; i++) {
      const btn = new MemoryButton(i, colors[i - 1]);
      btn.btn.addEventListener("click", () => {
        this.onBtnClick(btn);
      });
      this.buttons.push(btn);
    }
  }

  onBtnClick(btn) {
    if (btn.isNumberVisible) {
      return;
    }

    if (btn.order === this.currentButtonOrder) {
      btn.showNumber();
      this.currentButtonOrder++;
    } else {
      this.showAllNumbers();
      this.ui.showMessage(messages.gameOver);
    }
    this.checkGameClear();
  }

  checkGameClear() {
    if (this.currentButtonOrder > this.numberOfButtons) {
      this.ui.messageArea.classList.add("rainbow-text");
      this.ui.showMessage(messages.gameClear);
    }
  }

  showAllNumbers() {
    this.buttons.forEach((btn) => {
      btn.showNumber();
    });
  }

  hideAllNumbers() {
    this.buttons.forEach((btn) => {
      btn.hideNumber();
    });
  }

  renderButtons() {
    this.buttons.forEach((btn) => {
      this.gameArea.appendChild(btn.btn);
    });
  }

  // This code was assisted by ChatGPT.
  getRandomColors(n) {
    const colors = [
      "Aquamarine",
      "Beige",
      "Chartreuse",
      "Coral",
      "CornflowerBlue",
      "Gold",
      "Silver",
    ];
    if (n > colors.length) {
      throw new Error("n must be less or equal to 7");
    }

    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }

    return colors.slice(0, n);
  }

  // This code was assisted by ChatGPT.
  shuffleButtonsPosition() {
    const gameAreaRect = this.gameArea.getBoundingClientRect();

    this.buttons.forEach((btn) => {
      const rect = btn.btn.getBoundingClientRect();
      const btnWidth = rect.width;
      const btnHeight = rect.height;

      const x = Math.floor(Math.random() * (gameAreaRect.width - btnWidth));
      const y = Math.floor(Math.random() * (gameAreaRect.height - btnHeight));
      btn.setLocation(x, y);
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new UI();
});
