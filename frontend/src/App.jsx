import {useEffect, useState} from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';// markdown previewer
import rehypeHighlight  from "rehype-highlight";// linter for markdown
import 'highlight.js/styles/github-dark.css';
import {
    OpenFiles,
    ReadFile,
    SaveFileAs,
    SaveFileToPath,
} from "../wailsjs/go/main/App";// import functions from Go backend

let nextTabId =1;
const getNewTabId = () => nextTabId++;
const getNewTabName = (tabs) =>{
    const untitledNums =tabs
        .filter(tab=> tab.name.startsWith("Untitled-"))
        .map(tab=> parseInt(tab.name.split('-')[1]||"0"))
        .sort((a,b)=>a-b);
    let nextNum=1;
    for (const num of untitledNums){
        if(num===nextNum){
            nextNum++;
        }else{
            break;
        }
    }
    return `Untitled-${nextNum}`;
}

/*function App() {
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
            <textarea className="editor-pane" value={fileContent} onChange={(e)=> setFileContent(e.target.value)}/>{/*changing content in tet area*//*}*/
               /* <div className="preview-pane">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{fileContent}</ReactMarkdown>{/*preview content*//*}*/
                /*</div>
            </div>
        </div>
    )
}*/
function App(){
    const [tabs,setTabs] = useState([{
        id:0,
        name: "Untitled-1",
        content:"# Welcome!\n\n Click 'Open File' to load a file, or just start typing.",
        path:"",
    }]);
    const [activeTabId,setActiveTabId] = useState(0);
    const getActiveTab = () => tabs.find(tab=>tab.id ===activeTabId);
    useEffect(()=>{
        if(tabs.length===0){
            const newName = getNewTabId([]);
            const newTab = {
                id: getNewTabId(),
                name: newName,
                content:'',
                path:"",
            };
            setTabs([newTab]);
            setActiveTabId(newTab.id);
        }
    },[tabs]);
    function handleNewFile(){
        const newName = getNewTabName(tabs);
        const newTab = {
            id: getNewTabId(),
            name:newName,
            content:"",
            path:"",
        };
        setTabs([...tabs,newTab]);
        setActiveTabId(newTab.id);
    }
    async function handleOpenFile(){
        try{
            const filesData = await OpenFiles();
            if(!filesData){
                return;
            }

            const newTabs = [];
            let newActiveTabId = activeTabId;

            for (const file of filesData){
                const existingTab = tabs.find(tab=>tab.path === file.path);
                if (existingTab){
                    newActiveTabId = existingTab.id;
                }else{
                    const newTab = {
                        id:getNewTabId(),
                        name: file.name,
                        content: file.content,
                        path: file.path,
                    };
                    newTabs.push(newTab);
                    newActiveTabId = newTab.id;
                }
            }
            if(newTabs.length>0){
                setTabs([...tabs,...newTabs]);
            }
            setActiveTabId(newActiveTabId);
        }catch (err){
            console.error("Error opening file(s):",err);
        }
    }
    async function handleSaveFile(){
        const activeTab = getActiveTab();
        if(!activeTab){
            return;
        }
        try{
            if(activeTab.path === ""){
                handleSaveFileAs();
            }else{
                const message = await SaveFileToPath(activeTab.path,activeTab.content);
                console.log(message);
            }
        }catch(err){
            console.error("Error saving file:",err);
        }
    }
    async function handleSaveFileAs(){
        const activeTab = getActiveTab();
        if(!activeTab){
            return;
        }
        try{
            const result = await SaveFileAs(activeTab.content);
            if(result.path){
                setTabs(tabs.map(tab=>
                    tab.id===activeTabId?{...tab,path:result.path,name:result.name}:tab
            ));
            console.log(result.message);
            }
        }catch (err){
            console.error("Error saving file:",err);
        }
    }
    function handleTabClick(tabId){
        setActiveTabId(tabId);
    }
    function handleContentChange(newContent){
        setTabs(tabs.map(tab=>
        tab.id === activeTabId
        ?{...tab,content:newContent}
        :tab
        ));
    }
    function handleCloseTab(e,tabIdToClose){
        e.stopPropagation();

        const tabIndex = tabs.findIndex(tab=>tab.id === tabIdToClose);

        const newTabs = tabs.filter(tab => tab.id !== tabIdToClose);

        if(activeTabId===tabIdToClose){
            if(newTabs.length>0){
                const newActiveIndex = Math.max(0,tabIndex-1);
                setActiveTabId(newTabs[newActiveIndex].id);
            }else{

            }
        }
        setTabs(newTabs);
    }
    const activeTab = getActiveTab();

    return(
        <div id="App">
            <div className="toolbar">
                <button className="btn" onClick={handleNewFile}>New File</button>
                <button className="btn" onClick={handleOpenFile}>Open File</button>
                <button className="btn" onClick={handleSaveFile}>Save</button>
                <button className="btn" onClick={handleSaveFileAs}>Save As</button>
            </div>
            <div className="tab-bar">
                {tabs.map(tab=>(
                    <div key={tab.id} className={`tab-item ${tab.id=== activeTabId ? 'active' : ''}`} onClick={()=>handleTabClick(tab.id)}>
                        <span className="tab-name">{tab.name}</span>
                        <button className="tab-close" onClick={(e)=> handleCloseTab(e,tab.id)}>
                            &times;
                        </button>
                    </div>
                ))}
            </div>
            <div className="main-content">
                <textarea className="editor-pane" value={activeTab?activeTab.content:""} onChange={(e)=>handleContentChange(e.target.value)}/>

                <div className="preview-pane">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                        {activeTab?activeTab.content:""}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    )

}

export default App
