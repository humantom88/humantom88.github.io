/*
  Create a simple note-taking app. A user should be able to:
  Add a note
  Edit a note
  Delete a note
  Also:
  Each note should be in a colored rectangular box.
  Box colors can be selected from a fixed list of colors.
*/

class NoteTakingApp {
    static defaultNoteText = 'Empty Note'
    static defaultColors = [
        '#fcfaaa', '#caf9c5', '#bedff5', '#ecb4ec'
    ]

    constructor() {
        // Properties initialization
        this.selectedNoteId = undefined
        this.selectedColorId = 0
        this.notes = []

        // Method's binding
        this.saveNote = this.saveNote.bind(this)
        this.deleteNote = this.deleteNote.bind(this)
        this.renderNotes = this.renderNotes.bind(this)
        this.clearNotes = this.clearNotes.bind(this)
        this.createHandleNoteCloseClick = this.createHandleNoteCloseClick.bind(this)
        this.createHandleSelectColor = this.createHandleSelectColor.bind(this)
        this.handleAddButton = this.handleAddButton.bind(this)
        this.handleNoteClick = this.handleNoteClick.bind(this)
        this.handleSaveButton = this.handleSaveButton.bind(this)
        this.initElements = this.initElements.bind(this)

        // Initialization
        this.initElements()
    }

    // Initialization methods

    initElements() {
        this.textField = document.getElementById('textField')

        this.saveButton = document.getElementById('saveButton')
        this.saveButton.addEventListener('click', this.handleSaveButton)

        this.addButton = document.getElementById('addButton')
        this.addButton.addEventListener('click', this.handleAddButton)

        this.notesArea = document.getElementById('notesArea')
        this.notesList = document.getElementById('notesList')

        this.colorsDropdown = this.createSuggestNode()
    }

    // Handlers

    createHandleNoteCloseClick(id) {
        return (event) => {
            this.textField.value = ""
            this.selectedNoteId = undefined
            this.deleteNote(id)
            this.renderNotes()
        }
    }

    createHandleSelectColor(id) {
        return (event) => {
            this.colorSelect.classList.remove('opened')
            this.colorSelect.style.backgroundColor = NoteTakingApp.defaultColors[id]
            this.selectedColorId = id
            if (this.selectedNoteId !== id && this.notesList.children[this.selectedNoteId]) {
                this.notesList.children[this.selectedNoteId].style.backgroundColor = NoteTakingApp.defaultColors[id]
            }
        }
    }

    deleteNote(id) {
        this.notes.splice(id, 1)
    }

    handleAddButton(event) {
        this.textField.value = ""
        this.selectedNoteId = undefined
        this.selectedColorId = 0
        this.colorSelect.style.backgroundColor = NoteTakingApp.defaultColors[0]
        this.textField.focus()
        this.renderNotes()
    }

    handleNoteClick(event) {
        let noteText = event.target.querySelectorAll('.note-text')[0]
        if (!noteText) {
            return
        }
        this.textField.value = noteText.innerText
        const noteId = Number(event.target.dataset.id)
        this.selectedNoteId = noteId
        this.selectedColorId = this.notes[noteId].color
        this.renderNotes()
    }

    handleSaveButton(event) {
        this.saveNote(this.textField.value, this.selectedColorId, this.selectedNoteId)
        this.textField.value = ""
        this.selectedNoteId = undefined
        this.selectedColorId = 0
        this.colorSelect.style.backgroundColor = NoteTakingApp.defaultColors[0]
        this.renderNotes()
    }

    // State management

    clearNotes() {
        let lastChild = this.notesList.lastElementChild
        while (lastChild) {
            this.notesList.removeChild(lastChild)
            lastChild = this.notesList.lastElementChild
        }
    }

    saveNote(text, color, id) {
        const noteObject = {
            text: text || NoteTakingApp.defaultNoteText,
            color: color !== undefined ? color : this.selectedColorId
        }

        if (id === undefined) {
            this.notes.push(noteObject)
        } else {
            this.notes.splice(id, 1, noteObject)
        }
    }

    // Rendering

    createNoteNode(text, color, id) {
        const cross = document.createElement('button')
        cross.type = 'button'
        cross.classList = ['close-note']
        cross.innerHTML = '&#215;'
        cross.addEventListener('click', this.createHandleNoteCloseClick(id))

        const noteText = document.createElement('p');
        noteText.classList = ['note-text']
        noteText.innerText = text

        const node = document.createElement('li');
        if (color !== undefined) {
            node.style.backgroundColor = NoteTakingApp.defaultColors[color]
        }
        node.dataset.id = id
        node.appendChild(noteText)
        node.appendChild(cross)
        node.addEventListener('click', this.handleNoteClick)

        return node
    }

    createSuggestNode() {
        this.colorSelect = document.getElementById('colorsDropdown')
        this.selectedColorId = 0
        this.colorSelect.style.backgroundColor = NoteTakingApp.defaultColors[this.selectedColorId]
        this.colorSelect.addEventListener('click', (event) => {
            if (!event.target.classList.contains('colors-dropdown')) {
                return
            }

            if (event.target.classList.contains('opened')) {
                event.target.classList.remove('opened')
            } else {
                event.target.classList.add('opened')
            }
        })

        const suggest = document.createElement('div')
        suggest.classList.add('suggest')

        NoteTakingApp.defaultColors.forEach((color, id) => {
            const option = document.createElement('div')
            option.style.backgroundColor = color;
            option.classList.add('color-option')
            option.addEventListener('click', this.createHandleSelectColor(id))
            suggest.appendChild(option)
        })

        this.colorSelect.appendChild(suggest)
    }

    renderNotes() {
        this.clearNotes()
        this.notes.forEach(({ text, color }, id) => {
            const node = this.createNoteNode(text, color, id)
            if (id === Number(this.selectedNoteId)) {
                node.classList = ['selected']
            }
            this.notesList.appendChild(node)
        });
    }
}

let app = new NoteTakingApp();