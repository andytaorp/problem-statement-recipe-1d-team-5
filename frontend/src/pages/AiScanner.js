import { useState } from "react";

const AiScanner = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ai-scanner/scan`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("API Response:", data);
      setResult(data);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  return (
    <div>
      <h2>AI Food Scanner</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload & Analyze</button>
      </form>

      {result && (
        <div>
          <h3>Analysis Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>

          {/* Extract and Display Food Name */}
          <h3>Food Type:</h3>
          {result.food_types?.map((item, index) => (
            <p key={index}>{item.name} - Probability: {item.probs.toFixed(2)}</p>
          ))}

          {/* Display Ingredients if Available */}
          {result.ingredients && (
            <div>
              <h3>Ingredients:</h3>
              <ul>
                {result.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Display Nutrients if Available */}
          {result.nutrients && (
            <div>
              <h3>Nutritional Information:</h3>
              <ul>
                {Object.entries(result.nutrients).map(([key, value], index) => (
                  <li key={index}>
                    {key}: {value}g
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiScanner;
