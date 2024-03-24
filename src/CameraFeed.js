import React, { useRef, useState, useEffect } from "react";

function CameraFeed() {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing the camera:", err);
        });
    }

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
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        setCapturedImage(URL.createObjectURL(blob));
      },
      "image/jpeg",
      0.95
    ); // You can adjust the image format and quality.
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="720"
        height="560"
      ></video>
      <button onClick={captureImage}>Capture Image</button>
      {capturedImage && (
        <img src={capturedImage} alt="Captured" style={{ display: "block" }} />
      )}
    </div>
  );
}

export default CameraFeed;
