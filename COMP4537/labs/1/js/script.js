import { messages } from "../lang/messages/en/user.js";

class Home {
  constructor() {
    this.title = document.getElementById("title")
    this.name = document.getElementById("name")
    this.writerBtn = document.getElementById("writer-btn")
    this.readerBtn = document.getElementById("reader-btn");

    this.title.innerText = messages.title
    this.name.innerText = messages.name
    this.writerBtn.innerText = messages.writerBtnLabel;
    this.readerBtn.innerText = messages.readerBtnLabel;

    this.writerBtn.addEventListener("click", () => {
      window.location.href = "writer.html"
    })

    this.readerBtn.addEventListener("click", () => {
      window.location.href = "reader.html"
    })
  }
}

window.document.addEventListener("DOMContentLoaded", () => {
  new Home()
});
