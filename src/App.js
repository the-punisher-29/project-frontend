import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const App = () => {
  const webcamRef = useRef(null); // Reference to the webcam
  const [imageCaptured, setImageCaptured] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  const capturePhoto = () => {
    //see this fn triggers webcam to take a photo
    const imageSrc = webcamRef.current.getScreenshot();
    setImageCaptured(imageSrc); // Store captured image
  };

  const uploadPhoto = async () => {
    if (!imageCaptured) {
      alert("Please capture a photo first!");
      return;
    }

    //there is this blob(compressed kinda ) thing that is used to send image data to the backend
    const blob = await fetch(imageCaptured).then((res) => res.blob());
    const formData = new FormData();
    formData.append("file", blob, "captured_photo.jpg");

    try {
      const response = await axios.post("http://127.0.0.1:5000/recognize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponseMessage(response.data.message);
    } catch (error) {
      setResponseMessage("Error: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Facial Recognition System</h1>

      {/* Webcam Component */}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
      />

      {/* Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={capturePhoto} style={{ marginRight: "10px" }}>
          Capture Photo
        </button>
        <button onClick={uploadPhoto}>Upload and Recognize</button>
      </div>

      {/* Display Captured Image */}
      {imageCaptured && (
        <div style={{ marginTop: "20px" }}>
          <h4>Captured Photo:</h4>
          <img src={imageCaptured} alt="Captured" width={320} height={240} />
        </div>
      )}

      {/* Display Backend Response */}
      {responseMessage && <p style={{ marginTop: "20px" }}>{responseMessage}</p>}
    </div>
  );
};

export default App;
