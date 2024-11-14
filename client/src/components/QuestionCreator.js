import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axiosInstance from '../modules/axiosInstance';

import Loading from "./Loading";

const QuestionCreator = () => {
    const { qId } = useParams();
    const nav = useNavigate();

    const [title, setTitle] = useState("My Question");
    const [tags, setTags] = useState("");
    const [media, setMedia] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [correct, setCorrect] = useState(); // id of the correct answer

    const [newMedia, setNewMedia] = useState({type:"text", title:"Title"});
    const [questionId, setQuestionId] = useState(qId);
    const [loading, setLoading] = useState(true);

    const getQuestion = async (id) => {
        console.log("Getting question: " + id);
        try {
            const res = await axiosInstance.get("/question/" + id);
            return res.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    useEffect(() => {
        async function fetchQuestion() {
            let q = await getQuestion(questionId);
            setTitle(q.title);
            setTags(q.tags);
            setCorrect(q.correctAnswerId);

            //calls to get all the media
            await Promise.all(
                q.media.map((m) => axiosInstance.get("/media/" + m.mediaId))
            ).then((responses) => {
                const data = responses.map((response) => response.data);
                setMedia(data);
            }).catch((err) => {
                console.error("Some error getting media data: ", err);
            })

            await Promise.all(
                q.answers.map((ans) => axiosInstance.get("/answer/" + ans.answerId))
            ).then((responses) => {
                const data = responses.map((response) => response.data);
                setAnswers(data);
                console.log("Got all answers and updated", data);
            }).catch((err) => {
                console.error("Some error getting answer data: ", err);
            });
        }

        if (questionId) {
            fetchQuestion();
        }

        setLoading(false);
    }, [questionId, nav]);

    const addMedia = async (e) => {
        e.preventDefault();
        console.log("Adding media of type", newMedia.type);
        try{
            const res = await axiosInstance.post("media/create", {type: newMedia.type, title: newMedia.title});
            let mediaObject = res.data;
            setMedia((prev) => [...prev, mediaObject])
        }catch(err){
            console.error(err);
        }
    };

    const addAnswer = async (e) => {
        e.preventDefault();
        console.log("Adding answer");
        try {
            const res = await axiosInstance.get("answer/create");
            let answerObject = res.data;
            answerObject.unsaved = true;//use this to delete if the question update is not saved
            setAnswers((prev) => [...prev, answerObject]);
            if (answers.length < 1) {
                setCorrect(res.data._id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateAnswer = (id, value) => {
        let contentObj = { content: value };
        setAnswers((prev) =>
            prev.map((ans) =>
                ans._id === id ? { ...ans, ...contentObj } : ans
            )
        );
    };

    const updateNewMedia = (value, key) => {
        let obj = {};
        obj[key] = value;
        setNewMedia((prev) =>{
            return {...prev, ...obj}
            }
        );
    }

    const deleteMedia = async (id) => {
        console.log("Delete media: ", id);
        try{
            await axiosInstance.post("media/delete", {id: id});
            console.log("State of media before filter: ", media);
            console.log("Id: ", id);
            setMedia((prev) =>  prev.filter((m) => m._id !== id));
        }catch(err){
            console.error(err);
        }
    }

    const deleteAnswer = async (id) => {
        console.log("Attempting to delete answer: " + id);
        try {
            await axiosInstance.post("answer/delete", { id: id });
            setAnswers((prev) => {
                const updatedAnswers = prev.filter((ans) => ans._id !== id);
                if (correct === id) {
                    if (updatedAnswers.length > 0) {
                        setCorrect(updatedAnswers[0]._id);
                    } else {
                        setCorrect(null);
                    }
                }
                console.log("item deleted");
                return updatedAnswers;
            });
        } catch (err) {
            console.error(err);
        }
    };

    const postAnswerUpdate = async (ans) => {
        if (answers) {
            if (ans.unsaved) delete ans.unsaved;
            try {
                const res = await axiosInstance.post("answer/update", ans);
                let updatedAns = res.data;
                setAnswers((prev) =>
                    prev.map((ans) =>
                        ans._id === updatedAns._id ? updatedAns : ans
                    )
                );
            } catch (err) {
                console.error(err);
            }
        }
    };

    const saveChanges = async (exit) => {
        let questionObject = {
            title: title,
            tags: tags,
            answers: answers,
            media: media,
            correctAnswerId: correct,
        };

        if (questionId) {
            try {
                console.log("Updating existing question", questionObject);
                questionObject._id = questionId;
                const res = await axiosInstance.post("question/update", questionObject);
                Promise.all(
                    answers.map((ans) => postAnswerUpdate({ ...ans, questionId: res.data._id }))
                ).then(() => {
                    if (exit) nav("/");
                }).catch((err) => {
                    console.error("Error in saving all answers: ", err);
                });
            } catch (err) {
                console.error(err);
            }
        } else {
            try {
                const createdQuestion = await axiosInstance.post("question/create", questionObject);
                setQuestionId(createdQuestion.data._id);
                Promise.all(
                    answers.map((ans) => postAnswerUpdate({ ...ans, questionId: createdQuestion.data._id }))
                ).then(() => {
                    if (exit) nav("/");
                }).catch((err) => {
                    console.error("Error in saving all answers: ", err);
                });
            } catch (err) {
                console.error(err);
            }
        }
    };

    const discardChanges = async () => {
        console.log("discard");
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-semibold text-center mb-6">Question Creator</h1>
                
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Title:</label>
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Tags:</label>
                    <input 
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                {media.map( (m) => {
                    if(m.type === "text"){
                        return (<div key={m._id} className="mb-4">
                            {m.title}
                            <button
                            onClick={() => deleteMedia(m._id)}
                            className="text-red-500 hover:text-red-700 text-sm mb-2"
                        >Delete Media</button>
                        </div>)
                    }else{ //add other cases for each media type
                        return (<div key={m._id}>
                            <h3>{m.title}</h3>
                            <div>
                                Placeholder for media of type {m.type}
                            </div>
                            <button
                            onClick={() => deleteMedia(m._id)}
                            className="text-red-500 hover:text-red-700 text-sm mb-2"
                        >Delete Media</button>
                        </div>)
                    }
                })}
                
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Select Media Type:</label>
                    <select
                        id="newMediaType"
                        value={newMedia.type}
                        onChange={(e) => updateNewMedia(e.target.value, "type")}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                        <option value="audio">Audio</option>
                        <option value="video">Video</option>
                    </select>
                    <input 
                            type="text"
                            value={newMedia.title}
                            onChange={(e) => updateNewMedia(e.target.value, "title")}
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                        />
                    <button
                        onClick={addMedia}
                        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >Add Media</button>
                </div>
                
                {answers.map((a, index) => (
                    <div key={index} className="border border-gray-300 rounded p-4 mb-4">
                        <h3 className="font-semibold">Answer {index + 1}</h3>
                        <input 
                            type="text"
                            value={a.content}
                            onChange={(e) => updateAnswer(a._id, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                        />
                        <button
                            onClick={() => deleteAnswer(a._id)}
                            className="text-red-500 hover:text-red-700 text-sm mb-2"
                        >Delete Answer</button>
                        <div className="flex items-center space-x-2">
                            <input 
                                type="radio"
                                checked={a._id === correct}
                                onChange={() => setCorrect(a._id)}
                                className="text-green-500"
                            />
                            <label className="text-sm">{a._id === correct ? "Correct Answer" : "Mark as Correct"}</label>
                        </div>
                    </div>
                ))}

                <button
                    onClick={addAnswer}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
                >Add Answer</button>
                
                <div className="flex justify-between">
                    <button
                        onClick={() => saveChanges(false)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >Save</button>
                    <button
                        onClick={() => saveChanges(true)}
                        className="bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >Save and Exit</button>
                    <button
                        onClick={discardChanges}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >Discard Changes</button>
                </div>
            </div>
        </div>
    );
};

export default QuestionCreator;
