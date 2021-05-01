import React from 'react';
import { useState, useEffect} from 'react';
import ReactQuill from 'react-quill';
import debounce from '../helpers';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';


class EditorComponent extends React.Component {
    constructor() {
      super();
      this.state = {
        text: '',
        title: '',
        id: ''
      };
    }
  
    componentDidMount = () => {
      this.setState({
        text: this.props.selectedNote.body,
        title: this.props.selectedNote.title,
        id: this.props.selectedNote.id
      });
    }
  
    componentDidUpdate = () => {
        if(this.props.selectedNote.id !== this.state.id) {
          this.setState({
            text: this.props.selectedNote.body,
            title: this.props.selectedNote.title,
            id: this.props.selectedNote.id
          });
        }
    }
  
    render() {
  
      const { classes } = this.props;
  
      return(
        <div className={classes.editorContainer}>
          <BorderColorIcon className={classes.editIcon}></BorderColorIcon>
          <input
            className={classes.titleInput}
            placeholder='Note title...'
            value={this.state.title ? this.state.title : ''}
            onChange={(e) => this.updateTitle(e.target.value)}>
          </input>
          <ReactQuill
            value={this.state.text} 
            onChange={this.updateBody}>
          </ReactQuill>
        </div>
      );
    }
    updateBody = async (val) => {
      await this.setState({ text: val });
      this.update();
    };
    updateTitle = async (txt) => {
      await this.setState({ title: txt });
      this.update();
    }
    update = debounce(() => {
        // console.log('updating');
      this.props.noteUpdate(this.state.id, {
        title: this.state.title,
        body: this.state.text
      })
    }, 1500);
  }

////////////////////////////////////////////////////////////////
// function EditorComponent(props) {
//     const [text, setText] = useState('');
//     const [title, setTitle] = useState('');
//     const [id, setId] = useState('');
//     const { classes } = props;

//     useEffect(() => {
//         setText(props.selectedNote.body);
//         setTitle(props.selectedNote.title);
//         setId(props.selectedNote.id);
        
//     },[])

//     useEffect(() => {
//         if(props.selectedNote.id !== id) {
//             setText(props.selectedNote.body);
//             setTitle(props.selectedNote.title);
//             setId(props.selectedNote.id);
//         }
//     },[text, title, id])


//     var updateBody = async (val) => {
//         await setText( val );
//         update();
//       };
      
//     var updateTitle = async (txt) => {
//         await setTitle( txt );
//         update();
//       }
//     var update = debounce(() => {
//         console.log('u d');
//         props.noteUpdate(setId, {
//           title: this.state.title,
//           body: this.state.text
//         })
//       }, 1500);


//     return (
//         <div className={classes.editorContainer}>
//             <BorderColorIcon className={classes.editIcon}></BorderColorIcon>
//             <input
//                 className={classes.titleInput}
//                 placeholder='Note title...'
//                 value={title ? title : ''}
//                 onChange={(e) => updateTitle(e.target.value)}>
//             </input>
//             <ReactQuill 
//             value={text}
//             onChange={updateBody}>
//             </ReactQuill>
//         </div>

//     )
// }


export default withStyles(styles)(EditorComponent);
