import { messages } from "../lang/messages/en/user.js";

class Note {
  constructor(text, onRemoveCallback, onInputCallback) {
    this.text = text;

    // Textarea
    this.note = document.createElement("textarea");
    this.note.classList.add("note");
    this.note.innerText = text;
    this.note.spellcheck = true;
    this.note.addEventListener("input", () => {
      onInputCallback();
    });

    // Remove button
    this.removeBtn = document.createElement("button");
    this.removeBtn.classList.add("remove-btn");
    this.removeBtn.innerText = messages.removeBtnText;
    this.removeBtn.addEventListener("click", () => {
      this.onClickRemove(onRemoveCallback);
    });
  }

  onClickRemove(onRemoveCallBack) {
    this.removeBtn.closest("li").remove();
    onRemoveCallBack();
  }
}

class Writer {
  constructor() {
    this.title = document.getElementById("title");
    this.timestamp = document.getElementById("timestamp");
    this.noteList = document.getElementById("note-list");
    this.addBtn = document.getElementById("add-btn");
    this.backBtn = document.getElementById("back-btn");

    this.title.innerText = messages.noteTitle.replace("%1", "Writer");

    this.addBtn.innerText = messages.addBtnText;
    this.backBtn.innerText = messages.backBtnText;

    this.addBtn.addEventListener("click", () => {
      this.onClickAdd();
    });
    this.backBtn.addEventListener("click", () => {
      window.location.href = "./index.html";
    });

    this.timer = null;
    this.load();
  }

  onClickAdd() {
    const newNote = this.createNote("");
    this.noteList.appendChild(newNote);
    this.getNonEmptyNotes();
    this.save();
  }

  createNote(text) {
    const note = new Note(
      text,
      () => this.save(),
      () => this.startSaveTimer()
    );

    const li = document.createElement("li");
    const div = document.createElement("div");
    div.classList.add("note-elements");

    div.appendChild(note.note);
    div.appendChild(note.removeBtn);
    li.appendChild(div);
    return li;
  }

  /*This code was assisted by ChatGPT.*/
  save() {
    if (typeof Storage == "undefined") {
      return;
    }
    const timestamp = this.getCurrentTime();
    this.timestamp.innerText = messages.storedTimeStamp.replace(
      "%1",
      timestamp
    );
    const notes = this.getNonEmptyNotes().map((text) => ({ text }));
    localStorage.setItem("timestamp", timestamp);
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  load() {
    if (typeof Storage == "undefined") {
      return;
    }
    const timestamp = localStorage.getItem("timestamp") || "";
    this.timestamp.innerText = messages.storedTimeStamp.replace(
      "%1",
      timestamp
    );
    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    this.clearNotes();

    notes.forEach((obj) => {
      const text = obj.text;
      const note = this.createNote(text);
      this.noteList.appendChild(note);
    });
  }

  clearNotes() {
    while (this.noteList.firstChild) {
      this.noteList.removeChild(this.noteList.firstChild);
    }
  }

  /*This code was assisted by ChatGPT.*/
  getCurrentTime() {
    const now = new Date();

    const hours = now.getHours() % 12 || 12;
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const ampm = now.getHours() >= 12 ? "PM" : "AM";

    const formattedTime = `${hours}:${minutes}:${seconds}:${ampm}`;
    return formattedTime;
  }

  getNonEmptyNotes() {
    const textareas = this.noteList.querySelectorAll("li div textarea");
    const notes = Array.from(textareas)
      .map((textarea) => textarea.value.trim())
      .filter((value) => value !== "");

    return notes;
  }

  /*This code was assisted by ChatGPT.*/
  startSaveTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.save();
    }, 2000);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new Writer();
});
