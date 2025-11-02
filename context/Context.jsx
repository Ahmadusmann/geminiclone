/* eslint-disable react-refresh/only-export-components */
import {createContext} from "react";
import {useState} from "react";
import runChat from "../api/gemini.js";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState('');
    const [recentPrompt, setRecentPrompt] = useState('');
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState('');

    const delayPara = (index, nextChar) => {
        setTimeout(function () {
            setResultData(prev=>prev+nextChar)
        },75*index)
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt) => {

        setResultData("");
        setLoading(true);
        setShowResult(true);

        let response;
        if (prompt !== undefined) {
            response= await runChat(prompt);
            setRecentPrompt(prompt);
        }
        else{
            setPrevPrompts(prev=>[...prev,input]);
            setRecentPrompt(input);
            response = await runChat(input);
        }
  
       let newResponse = response.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
       newResponse = newResponse.replace(/\*(.*?)\*/g, '<i>$1</i>');
       newResponse = newResponse.replace(/\n/g, '<br/>');

       for(let i=0; i<newResponse.length;i++)
       {
           const nextChar = newResponse[i];
           delayPara(i,nextChar)
       }
       setLoading(false);
       setInput('');
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        Loading,
        resultData,
        input,
        setInput,
        newChat,
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider