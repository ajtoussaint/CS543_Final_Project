import React, { useEffect, useState } from "react";
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axiosInstance from '../modules/axiosInstance';

const QuestionCreator = () => {
    const { user } = useUser();
    const { questionId } = useParams();
    const nav = useNavigate();

    //state related to the question
    const [title, setTitle] = useState("My Question");
    const [creatorId, setCreatorId] = useState("");
    const [tags, setTags] = useState("");
    const [media, setMedia] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [correct, setCorrect] = useState();//id of correct answer
    const [newMediaType, setNewMediaType] = useState("text");
    
    useEffect(() =>{
        if(!user){
            //if not logged in send the user to the login page
            nav("/login");
            return;
        }else{
            setCreatorId(user._id);
            if(questionId){
                //editing existing question

                //pull current state of the question from the server
            }
        }
    }, [user, questionId, nav])

    const addMedia = async (e) => {
        e.preventDefault();
        console.log(newMediaType);
    }

    const addAnswer = async (e) => {
        e.preventDefault();
        console.log("Adding answer");
        try{
            const res = await axiosInstance.get("answer/create");
            let answerObject = res.data;
            
            //track that this is a newly created answer for saving purposes
            answerObject.unsaved = true;

            setAnswers(prev => [...prev, answerObject]);
            console.log("Added new answer");
            //if this is the first answer added make it correct
            if(answers.length < 1){
                setCorrect(res.data._id);
            }
        }catch(err){
            console.error(err);
        }
        
    }

    const updateAnswer = (id, value) => {
        let contentObj = {content:value}
        setAnswers(prev => 
            prev.map(ans =>
                ans._id === id ? {...ans, ...contentObj} : ans
            )
        );
    }

    const deleteAnswer = async (id) =>{
        console.log("Attempting to delte item: " + id);

        try{
            //remove the item server side
            const res = await axiosInstance.post("answer/delete", {
                id:id
            });

            console.log("axios done ", res);

            //remove the item client side
            setAnswers(prev => {
                const updatedAnswers = prev.filter(ans => ans._id !== id);
                //if this was the correct answer set a new correct answer
                if(correct === id){
                    if(updatedAnswers.length > 0){
                        setCorrect(updatedAnswers[0]._id);
                    }else{
                        setCorrect(null);
                    }
                }
                console.log("item deleted");
                return updatedAnswers
            },);

            
        }catch(err){
            console.error(err);
        }
        
        
    }

    const saveChanges = async () => {
        console.log("save");
    }

    const discardChanges = async () => {
        console.log("discard");
    }

    //prevents flickering for unAuth users
    if (!user) return null;

    return (
        <div>
            <h1>Question Creator:</h1>
            <div className="border border-black m-4">
                Title: 
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="border border-black  m-4">
                Tags: 
                <input 
                    type="text" 
                    value={tags} 
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            {media.map((m, index) => (
                <div key={index} className="media border border-black-500 m-4">
                    {m._id};
                </div>
            ))}
            <form onSubmit={addMedia} className="border border-black  m-4">
                <label htmlFor="newMediaType">Add media:</label>
                <select id="newMediaType" value={newMediaType} onChange={(e) => setNewMediaType(e.target.value)}>
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                </select>
                <button type="submit" className="bg-gray-500">Add new media slot</button>
            </form>
            {answers.map((a, index) => (
                <div key={index} className="answer border border-black-500 m-4">
                    <div>
                        Answer {index + 1}:
                    </div>
                    <div>
                    {a._id}
                    </div>
                    <input 
                        type="text" 
                        value={a.content} 
                        onChange={(e) => updateAnswer(a._id, e.target.value)}
                    />
                    <button
                        onClick={() => deleteAnswer(a._id)}
                    >Delete Answer</button>
                    {/*have radio buttons to select the correct answer*/}
                    <div>
                        {a._id === correct ? "RIGHT" : "WRONG"}
                    </div>
                    <button
                        onClick={() => setCorrect(a._id)}
                    >Make this answer the correct answer</button>
                </div>
            ))}
            <form onSubmit={addAnswer} className="border border-black  m-4">
                <button type="submit" className="bg-gray-500">Add Answer</button>
            </form>

            <button onClick={saveChanges} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 m-2"> Save</button>
            <button onClick={discardChanges} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 m-2">Discard Changes</button>
        </div>
    )
}

export default QuestionCreator;