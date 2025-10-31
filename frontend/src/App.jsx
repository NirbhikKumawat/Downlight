import {useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {ReadFile} from "../wailsjs/go/main/App";

function App() {
    const [fileContent,setFileContent] = useState("Click 'Open File' to load a .md file");
    async function handleOpenFile(){
        try{
            const content = await ReadFile();
            if (content !==""){
                setFileContent(content);
            }
        }catch (err){
            console.error("Error openine file:",err);
        }
    }
    return(
        <div id="App">
            <div className="toolbar">
                <button className="btn" onClick={handleOpenFile}>Open File</button>
            </div>
            <textarea className="editor-pane" value={fileContent} onChange={(e)=> setFileContent(e.target.value)}/>
        </div>
    )
}

export default App
