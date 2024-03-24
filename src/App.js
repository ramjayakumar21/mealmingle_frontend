import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import CameraFeed from "./CameraFeed";

function App() {
  const [image, setImage] = useState(null);
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  // Function to start the camera
  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsCameraOn(true);
          }
        })
        .catch((err) => {
          console.error("Error accessing the camera: ", err);
        });
    }
  };

  // Function to stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      setIsCameraOn(false);
    }
  };

  // Click handler for the button
  const handleClick = () => {
    if (!isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }
  };

  // Cleanup function to stop the camera when the component unmounts
  useEffect(() => {
    return () => {
      if (isCameraOn) {
        stopCamera();
      }
    };
  }, [isCameraOn]);

  return (
    <>
      <h1>Meal Mingle</h1>
      <div id="photo-upload">
        {isCameraOn && (
          <video
            ref={videoRef}
            style={{ width: "100%", maxWidth: "500px", maxHeight: "500px" }}
            autoPlay
            playsInline
          ></video>
        )}
        <CameraFeed takePhoto={isCameraOn}></CameraFeed>
        <input
          type="file"
          onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
          accept="image/*"
          style={{ display: "none" }}
        />
        {image && (
          <img
            src={image}
            alt="Uploaded"
            style={{ maxWidth: "500px", maxHeight: "500px" }}
          />
        )}
      </div>
      {/* <button
        onClick={handleClick}
        style={{
          fontSize: "1.5em",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        {isCameraOn ? "Turn Off Camera" : "Take Picture"}
      </button> */}
    </>
  );
}

export default App;
