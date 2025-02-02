import { messages } from "../lang/messages/en/user.js";

class Reader {
  constructor() {
    this.title = document.getElementById("title");
    this.timestamp = document.getElementById("timestamp");
    this.noteList = document.getElementById("note-list");
    this.backBtn = document.getElementById("back-btn");

    this.title.innerText = messages.noteTitle.replace("%1", "Reader");

    this.backBtn.innerText = messages.backBtnText;
    this.backBtn.addEventListener("click", () => {
      window.location.href = "./index.html";
    });

    this.loadData();
    this.displayNotes();

    window.addEventListener("storage", () => {
      this.loadData();
      this.displayNotes();
    });
  }

  loadData() {
    if (typeof Storage == "undefined") {
      return;
    }
    const timestamp = localStorage.getItem("timestamp") || "";
    this.timestamp.innerText = messages.updatedTimeStamp.replace(
      "%1",
      timestamp
    );
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    this.notes = notes;
  }

  createReadOnlyNote(text) {
    const note = document.createElement("textarea");
    note.classList.add("note");
    note.value = text;
    note.readOnly = true;

    const li = document.createElement("li");
    const div = document.createElement("div");
    div.classList.add("note-elements");

    div.appendChild(note);
    li.appendChild(div);
    return li;
  }

  displayNotes() {
    this.clearNotes();
    this.notes.forEach((obj) => {
      const text = obj.text;
      const readOnlyNote = this.createReadOnlyNote(text);
      this.noteList.appendChild(readOnlyNote);
    });
  }

  clearNotes() {
    while (this.noteList.firstChild) {
      this.noteList.removeChild(this.noteList.firstChild);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new Reader();
});
