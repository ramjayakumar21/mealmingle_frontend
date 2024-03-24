import React, { useRef, useState, useEffect } from "react";

function CameraFeed() {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          throw new Error("getUserMedia is not supported by this browser");
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };
  
    initializeCamera();
  
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);
  

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      async (blob) => {
        setCapturedImage(URL.createObjectURL(blob));
        setIsCaptured(true);
      },
      "image/jpeg",
      0.95
    );
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setIsCaptured(false);
  };

  const submitPhoto = async () => {
    const formData = new FormData();

    let blob = await fetch(capturedImage).then(r => r.blob());
    console.log(blob);
    formData.append("photo", blob, "captured_image.jpeg");
    setMessage("Uploading image...")

    try {
      let response = await fetch("http://localhost:3001/uploads", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("Image uploaded successfully!", response);
      let json_obj = await response.json();
      console.log(json_obj);
      setMessage(`Image uploaded successfully! found data URL: ${JSON.stringify(json_obj)}`);
    } catch (error) {
      setMessage(`Error uploading image:${error}`);
    }
  };

  return (
    <div>
    <video
        ref={videoRef}
        autoPlay
        playsInline
        width="720"
        height="560"
        style={{ transform: "scaleX(-1)", display: (!isCaptured) ? "block" : "none"}}
      ></video>
      {!isCaptured && <button onClick={captureImage}>Capture Image</button>}
      {isCaptured && (
        <>
          <img
            src={capturedImage}
            alt="Captured"
            style={{ display: "block" }}
          />
          <div style={{ display: "flex" }}>
            <button onClick={submitPhoto}>Submit</button>
            <button onClick={retakePhoto}>Retake</button>
          </div>

          <h3>{message}</h3>
        </>
      )}
    </div>
  );
}

export default CameraFeed;
