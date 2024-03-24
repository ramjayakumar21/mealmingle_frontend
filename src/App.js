import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import CameraFeed from "./CameraFeed";

function App() {
  const [image, setImage] = useState(null);
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [foodList, setFoodList] = useState([]);

  // Function to fetch food data from the backend
  const fetchFoodData = async () => {
    setIsCameraOn(!isCameraOn);
    try {
      const response = await fetch("http://localhost:3001/foods");
      const json_obj = await response.json();
      console.log(json_obj);
      setFoodList(json_obj); // Assuming the response.data is an array of food items
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
  };

  // Render food items
  const renderFoodItems = () => {
    return foodList.map((food, index) => (
      <div key={index} className="food-entry">
        <h2>Food: {food.name}</h2>
        <div>
          <p>Quantity: {food.quantity}</p>
          <p>Ripeness: {food.quality}</p>
        </div>
        <img src={food.url} alt={food.name} style={{ maxWidth: "200px" }} /> {/* Display the photo */}
      </div>
    ));
  };

  return (
    <>
      <h1>Meal Mingle</h1>
      <button onClick={fetchFoodData}>{isCameraOn ? "See Available Food" : "Add Food"}</button>
      {!isCameraOn && foodList.length > 0 && renderFoodItems()}
      {isCameraOn && <CameraFeed takePhoto={isCameraOn}></CameraFeed>}
    </>
  );
}

export default App;
