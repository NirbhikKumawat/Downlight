import {useState} from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';// markdown previewer
import rehypeHighlight  from "rehype-highlight";// linter for markdown
import 'highlight.js/styles/github-dark.css';
import {ReadFile,SaveFileAs,SaveFileToPath,WriteFile} from "../wailsjs/go/main/App";// import functions from Go backend

function App() {
    const [fileContent,setFileContent] = useState("");
    const [currentFilePath,setCurrentFilePath] = useState("");
    function handleNewFile(){
        setFileContent("");
        setCurrentFilePath("");
    }
    async function handleOpenFile(){
        try{
            const data = await ReadFile();// reads file
            if (data.path){
                setFileContent(data.content);
                setCurrentFilePath(data.path);
            }
        }catch (err){
            console.error("Error opening file:",err);
        }
    }
    async function handleSaveFileAs(){
        try{
            const result = await SaveFileAs(fileContent);// save changes to the file
            if(result.path){
                setCurrentFilePath(result.path);
                console.log(result.message);
            }
        }catch(err){
            console.error("Error saving file:",err);
        }
    }
    async function handleSaveFile(){
        try {
            if(currentFilePath===""){
                handleSaveFileAs();
            }else{
                const message = await SaveFileToPath(currentFilePath,fileContent);
                console.log(message);
            }
        }catch (err){
            console.error("Error saving file:",err);
        }
    }
    return(
        <div id="App">
            <div className="toolbar">
                <button className="btn" onClick={handleNewFile}>New File</button>
                <button className="btn" onClick={handleOpenFile}>Open File</button>
                <button className="btn" onClick={handleSaveFile}>Save File</button>
                <button className="btn" onClick={handleSaveFileAs}>Save As</button>
            </div>
            <div className="main-content">
            <textarea className="editor-pane" value={fileContent} onChange={(e)=> setFileContent(e.target.value)}/>{/*changing content in tet area*/}
                <div className="preview-pane">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{fileContent}</ReactMarkdown>{/*preview content*/}
                </div>
            </div>
        </div>
    )
}

export default App
