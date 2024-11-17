import React, { useState, useEffect } from "react";
import axiosInstance from "../modules/axiosInstance";

const Root = () => {
    const [message, setMessage] = useState("message not yet loaded...");
    const [questions, setQuestions] = useState([]); // State to store all questions
    const [filteredQuestions, setFilteredQuestions] = useState([]); // State for filtered questions
    const [searchQuery, setSearchQuery] = useState(""); // State for the search input
    const [filterType, setFilterType] = useState("name"); // State to track filter type: 'name' or 'tag'

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching users and questions...");
            try {
                // Fetch users
                const usersRes = await axiosInstance.get("data");
                setMessage(
                    usersRes.data.map((user) => user.username).join(", ")
                );

                // Fetch questions
                const questionsRes = await axiosInstance.get("/questions");
                setQuestions(questionsRes.data);
                setFilteredQuestions(questionsRes.data); // Show all questions initially
            } catch (err) {
                console.error("Error fetching data: ", err);
            }
        };

        fetchData();
    }, []);

    // Dynamically filter questions based on the selected filter type and search query
    useEffect(() => {
        if (searchQuery === "") {
            setFilteredQuestions(questions); // Show all questions if search is empty
        } else {
            if (filterType === "name") {
                setFilteredQuestions(
                    questions.filter((question) =>
                        question.title
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                    )
                );
            } else if (filterType === "tag") {
                setFilteredQuestions(
                    questions.filter((question) =>
                        question.tags
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                    )
                );
            }
        }
    }, [searchQuery, filterType, questions]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterTypeChange = (e) => {
        setFilterType(e.target.value);
    };

    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-3xl font-bold mb-4 text-center">
                    Current Users:
                </h2>
                <p className="text-xl text-center text-gray-700 mb-6">
                    {message}
                </p>

                <h2 className="text-3xl font-bold mb-4 text-center">
                    Questions:
                </h2>

                {/* Search and Filter Section */}
                <div className="mb-6 flex space-x-4">
                    <select
                        value={filterType}
                        onChange={handleFilterTypeChange}
                        className="p-2 border border-gray-300 rounded bg-white"
                    >
                        <option value="name">Filter by Name</option>
                        <option value="tag">Filter by Tag</option>
                    </select>
                    <input
                        type="text"
                        placeholder={`Search questions by ${filterType}...`}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="flex-grow p-2 border border-gray-300 rounded"
                    />
                </div>

                {/* Display Filtered Questions */}
                <div className="text-left text-lg text-gray-800">
                    {filteredQuestions.length > 0 ? (
                        filteredQuestions.map((question, index) => (
                            <div
                                key={index}
                                className="border p-4 mb-4 rounded-lg shadow-sm bg-gray-50"
                            >
                                <h3 className="font-semibold">
                                    Title: {question.title}
                                </h3>
                                <p>Tags: {question.tags}</p>
                                <div>
                                    Answers:
                                    <ul>
                                        {question.answers.map((answer, idx) => (
                                            <li key={idx}>
                                                {answer.answerId}{" "}
                                                {answer.answerId ===
                                                question.correctAnswerId
                                                    ? "(Correct)"
                                                    : ""}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">
                            No questions found matching your search.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Root;
