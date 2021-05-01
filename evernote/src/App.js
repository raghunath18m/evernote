import React from 'react';
import { useState, useEffect} from 'react';
import { projectFirestore, timeStamp } from './config';
import './App.css';
import SidebarComponent from './sidebar/sidebar'
import EditorComponent from './editor/editor'

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedNoteIndex: null,
      selectedNote: null,
      notes: null
    };
  }

  render() {
    return(
      <div className="app-container">
        <SidebarComponent 
          selectedNoteIndex={this.state.selectedNoteIndex}
          notes={this.state.notes}
          deleteNote={this.deleteNote}
          selectNote={this.selectNote}
          newNote={this.newNote}></SidebarComponent>

        {
          this.state.selectedNote ?
          <EditorComponent 
          selectedNote={this.state.selectedNote}
          selectedNoteIndex={this.state.selectedNoteIndex}
          notes={this.state.notes}
          noteUpdate={this.noteUpdate}></EditorComponent> :
          null
        }
      </div>
    );
  }

  componentDidMount = () => {
    projectFirestore
      .collection('notes')
      .onSnapshot(serverUpdate => {
        const notes = serverUpdate.docs.map(_doc => {
          const data = _doc.data();
          data['id'] = _doc.id;
          return data;
        });
        console.log(notes);
        this.setState({ notes: notes });
      });
  }

  selectNote = (note, index) => this.setState({ selectedNoteIndex: index, selectedNote: note });
  // noteUpdate = (id, noteObj) => {console.log(id, noteObj);}
  noteUpdate = (id, noteObj) => {
    projectFirestore
      .collection('notes')
      .doc(id)
      .update({
        title: noteObj.title,
        body: noteObj.body,
        timestamp: timeStamp()
      });
  }
  newNote = async (title) => {
    const note = {
      title: title,
      body: ''
    };
    const newFromDB = await projectFirestore
      .collection('notes')
      .add({
        title: note.title,
        body: note.body,
        timestamp: timeStamp()
      });
    const newID = newFromDB.id;
    await this.setState({ notes: [...this.state.notes, note] });
    const newNoteIndex = this.state.notes.indexOf(this.state.notes.filter(_note => _note.id === newID)[0]);
    this.setState({ selectedNote: this.state.notes[newNoteIndex], selectedNoteIndex: newNoteIndex });
  }

  deleteNote = async (note) => {
    const noteIndex = this.state.notes.indexOf(note);
    await this.setState({ notes: this.state.notes.filter(_note => _note !== note) });
    if(this.state.selectedNoteIndex === noteIndex) {
      this.setState({ selectedNoteIndex: null, selectedNote: null });
    } else {
      this.state.notes.length > 1 ?
      this.selectNote(this.state.notes[this.state.selectedNoteIndex - 1], this.state.selectedNoteIndex - 1) :
      this.setState({ selectedNoteIndex: null, selectedNote: null });
    }

    projectFirestore
      .collection('notes')
      .doc(note.id)
      .delete();
  }
}

//////////////////////////////////////////////////////////////////////////////////

// function App() {
//   const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
//   const [selectedNote, setSelectedNote] = useState(null);
//   const [notes, setNotes] = useState(null);

//   useEffect(() => {
//     projectFirestore
//     .collection('notes')
//     .onSnapshot(serverUpdate => {
//       const notes = serverUpdate.docs.map(_doc => {
//         const data = _doc.data();
//         data['id'] = _doc.id;
//         return data;
//       });
//       console.log(notes);
//       setNotes( notes );
//     });
//     // return () => {
//     //   cleanup
//     // }
//   }, [])

//   var selectNote = (note, index) => {
//     setSelectedNoteIndex({ index });
//     setSelectedNote( note );
//   }
//   var noteUpdate = (id, noteObj) => {
//     projectFirestore
//       .collection('notes')
//       .doc(id)
//       .update({
//         title: noteObj.title,
//         body: noteObj.body,
//         timestamp: projectFirestore.FieldValue.serverTimestamp()
//       });
//   }
//   var newNote = async (title) => {
//     const note = {
//       title: title,
//       body: ''
//     };
//     const newFromDB = await projectFirestore
//       .collection('notes')
//       .add({
//         title: note.title,
//         body: note.body,
//         timestamp: projectFirestore.FieldValue.serverTimestamp()
//       });
//     const newID = newFromDB.id;
//     await setNotes( [...notes, note] );

//     const newNoteIndex = notes.indexOf(notes.filter(_note => _note.id === newID)[0]);
//     setSelectedNote( notes[newNoteIndex] );
//     setSelectedNoteIndex( newNoteIndex );
//   }

//   var deleteNote = async (note) => {
//     const noteIndex = notes.indexOf(note);
//     await setNotes( notes.filter(_note => _note !== note) );
//     if(selectedNoteIndex === noteIndex) {
//       setSelectedNote( null );
//       setSelectedNoteIndex( null );
//     } else {
//       notes.length > 1 ?
//       selectNote(notes[selectedNoteIndex - 1], selectedNoteIndex - 1) :
//       setSelectedNote( null );
//       setSelectedNoteIndex( null );
//     }

//     projectFirestore
//       .collection('notes')
//       .doc(note.id)
//       .delete();
//   }


//   return (
//     <div className="app-container">
//       <SidebarComponent 
//       selectedNoteIndex={selectedNoteIndex}
//       notes={notes}
//       deleteNote={deleteNote}
//       newNote={newNote}
//       selectNote={selectNote}>
//       </SidebarComponent>
//       {
//           selectedNote ?
//           <EditorComponent selectedNote={selectedNote}
//           selectedNoteIndex={selectedNoteIndex}
//           notes={notes}
//           noteUpdate={noteUpdate}></EditorComponent> :
//           null
//         }
//     </div>
//   );
// }

export default App;
