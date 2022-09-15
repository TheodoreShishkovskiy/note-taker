var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");

// activeNote is being used to keep track of the notes in the text area
var activeNote = {};

// This is a function for getting all the notes from db
var getNotes = function() {
    return $.ajax({
        url: "/api/notes"  ,
        method: "GET"
      });
    };

// This function is for saving a note to the db
var saveNote = function(note) {
    return $.ajax({
      url: "/api/notes",
      data: note,
      method: "POST"
    });
  };

//   BONUS! This funtion will delete a note from the db
var deleteNote = function(id) {
    return $.ajax({
      url: "api/notes/" + id,
      method: "DELETE"
    });
  };

//   If there is an activeNote it will display it and if not it renders a empty input
var renderActiveNote = function() {
    $saveNoteBtn.hide();
  
    if (activeNote.id) {
      $noteTitle.attr("readonly", true);
      $noteText.attr("readonly", true);
      $noteTitle.val(activeNote.title);
      $noteText.val(activeNote.text);
    } else {
      $noteTitle.attr("readonly", false);
      $noteText.attr("readonly", false);
      $noteTitle.val("");
      $noteText.val("");
    }
  };

// Get the note dat from the input and save it to the db and updates the view
var handleNoteSave = function() {
    var newNote = {
      title: $noteTitle.val(),
      text: $noteText.val()
    };
  
    saveNote(newNote).then(function(data) {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

//   BONUS: Delete clicked note
var handleNoteDelete = function(event) {
    // prevents the click listener for the list from being called when the button inside of it is clicked
    event.stopPropagation();
  
    var note = $(this)
      .parent(".list-group-item")
      .data();
  
    if (activeNote.id === note.id) {
      activeNote = {};
    }
  
    deleteNote(note.id).then(function() {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

//   Sets activeNote and displays it as well
var handleNoteView = function () {
    activeNote = $(this).data();
    renderActiveNote();
};

// Sets the activeNote to an empty object and allows a user to enter their new note
var handleNewNoteView = function () {
    activeNote = {};
    renderActiveNote ();
};

// If the title or text for the note is empty hide the button, if not show the button
var handleRenderSaveBtn = function() {
    if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
      $saveNoteBtn.hide();
    } else {
      $saveNoteBtn.show();
    }
  };

//   Render the list of note titles
var renderNoteList = function(notes) {
    $noteList.empty();
  
    var noteListItems = [];
  
    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];
  
      var $li = $("<li class='list-group-item'>").data(note);
      var $span = $("<span>").text(note.title);
      var $delBtn = $(
        "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
      );
  
      $li.append($span, $delBtn);
      noteListItems.push($li);
    }
  
    $noteList.append(noteListItems);
  };

//   Get notes from the db and render them into the sidebar
var getAndRenderNotes = function() {
    return getNotes().then(function(data) {
      renderNoteList(data);
    });
  };
  
  $saveNoteBtn.on("click", handleNoteSave);
  $noteList.on("click", ".list-group-item", handleNoteView);
  $newNoteBtn.on("click", handleNewNoteView);
  $noteList.on("click", ".delete-note", handleNoteDelete);
  $noteTitle.on("keyup", handleRenderSaveBtn);
  $noteText.on("keyup", handleRenderSaveBtn);
  
  // This will get and render the initial list of notes
  getAndRenderNotes();