import React, {useState} from 'react';
import { Link } from "react-router-dom";
import axiosInstance from '../modules/axiosInstance';

const OtherPage = () => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [file, setFile] = useState(null);
    const [fileId, setFileID] = useState(null);

    const handleFileChange = (event) => {
        console.log(event.target.files[0]);
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('No file selected!');
            return;
        }
        // Handle the upload logic, sending the file to a server.
        
        const formData = new FormData();
        formData.append('file', selectedFile);
        console.log('Uploading:', formData);
        console.log("tecst", formData.get("file"));
        //selected File is an empty object in the request
        try{
            const res = await axiosInstance.post("/file", formData,{
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res.data);
            setFileID(res.data.fileId);
        }catch(err){
            console.error(err);
        }
    };

    const handleDownload = async () => {
        try{
            const res = await axiosInstance.get("/file/" + fileId, { responseType: 'blob' });
            const url = URL.createObjectURL(res.data);
            setFile(url);
        }catch(err){
            console.error(err);
        }
    }

    return (
        <div>
            <div>You are on the other page!</div>
            <Link to='/'>Go Back</Link>
            <h1>Testing media upload:</h1>
            <div className="p-5 border border-gray-300 rounded-md">
                <input type="file" onChange={handleFileChange} className="block mb-2" />
                {selectedFile && <p className="mb-2">Selected file: {selectedFile.name}</p>}
                <button
                    onClick={handleUpload}
                    disabled={!selectedFile}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-blue-600"
                >
                    Upload File
                </button>
            </div>
            <div className="p-5 border border-gray-300 rounded-md">
                <button 
                    onClick={handleDownload}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-blue-600"
                >
                    Download
                </button>
                {/*Display the image*/}
                {file ? (
                    <img src={file} alt="Downloaded" />
                ):(
                    <p>No image</p>
                )
                }
            </div>
        </div> 
    )
}

export default OtherPage;