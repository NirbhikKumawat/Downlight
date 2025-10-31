import {useState} from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';
import {ReadFile,WriteFile} from "../wailsjs/go/main/App";// import functions from Go backend

function App() {
    const [fileContent,setFileContent] = useState("Click 'Open File' to load a .md file");
    async function handleOpenFile(){
        try{
            const content = await ReadFile();// reads file
            if (content !==""){
                setFileContent(content);
            }
        }catch (err){
            console.error("Error opening file:",err);
        }
    }
    async function handleSaveFile(){
        try{
            const message = await WriteFile(fileContent);// save changes to the file
            console.log(message);
        }catch(err){
            console.error("Error saving file:",err);
        }
    }
    return(
        <div id="App">
            <div className="toolbar">
                <button className="btn" onClick={handleOpenFile}>Open File</button>
                <button className="btn" onClick={handleSaveFile}>Save File</button>
            </div>
            <div className="main-content">
            <textarea className="editor-pane" value={fileContent} onChange={(e)=> setFileContent(e.target.value)}/>{/*changing content in tet area*/}
                <div className="preview-pane">
                    <ReactMarkdown>{fileContent}</ReactMarkdown>
                </div>
            </div>
        </div>
    )
}

export default App
