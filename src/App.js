import React, { useState } from "react";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setIsError] = useState(false);

  // Handle image upload
  const handleImageUpload = (event) => {
    setSelectedImage(event.target.files[0]); // Store the actual file object
  };

  // Handle form submission to analyze emotion
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form behavior
    if (!selectedImage) {
      alert("Please select an image to upload!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedImage); // Send the file, not a URL

    try {
      const response = await fetch(
        "https://emotionapi-c6h2f0d4bydqgxbc.australiasoutheast-01.azurewebsites.net/classify_emotion",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log(data); // Log the data to inspect it
      setResult(data); // Update the state with the response data
      setIsError(false);
    } catch (error) {
      console.error("Error analyzing emotion:", error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Emotion Analysis</h1>
      <input
        type="file"
        onChange={handleImageUpload}
        style={styles.fileInput}
      />
      <button onClick={handleSubmit} style={styles.button}>
        Analyze Emotion
      </button>
      {loading && <p style={styles.loading}>Analyzing...</p>}
      {error && <p style={styles.isErr}>Please Try Again Later...</p>}

      {/* Display uploaded image */}
      {selectedImage && !loading && (
        <div style={styles.imageContainer}>
          <h3 style={styles.imageHeading}>Uploaded Image</h3>
          <img
            src={URL.createObjectURL(selectedImage)} // Display image URL
            alt="Uploaded"
            style={styles.image}
          />
        </div>
      )}

      {/* Rendering the result */}
      {/* {result && result.emotions ? (
        <ul style={styles.emotionsList}>
          {Object.entries(result.emotions).map(([emotion, probability]) => (
            <li key={emotion} style={styles.emotionItem}>
              {emotion}: {Math.round(probability * 100)}%
            </li>
          ))}
        </ul>
      ) : (
        <p></p>
      )} */}

      {result && result.emotion ? (
        <div style={styles.dominantEmotionContainer}>
          <h3 style={styles.dominantEmotionHeading}>
            Dominant Emotion: {result.emotion}
          </h3>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  heading: {
    fontSize: "3rem",
    marginBottom: "20px",
  },
  fileInput: {
    padding: "10px",
    marginBottom: "20px",
    border: "2px solid white",
    backgroundColor: "transparent",
    color: "white",
    fontSize: "1rem",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "1.2rem",
  },
  loading: {
    color: "yellow",
    fontSize: "1.5rem",
  },
  isErr: {
    color: "red",
    fontSize: "1.5rem",
  },
  imageContainer: {
    marginTop: "30px",
    textAlign: "center",
  },
  imageHeading: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  image: {
    width: "100%",
    maxWidth: "500px",
    height: "auto",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  resultContainer: {
    marginTop: "30px",
    backgroundColor: "#333",
    padding: "20px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "500px",
  },
  resultHeading: {
    fontSize: "2rem",
    marginBottom: "10px",
  },
  resultText: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  emotionsHeading: {
    fontSize: "1.8rem",
    marginBottom: "10px",
  },
  emotionsList: {
    listStyleType: "none",
    paddingLeft: 0,
  },
  emotionItem: {
    fontSize: "1.2rem",
    marginBottom: "5px",
  },
};

export default App;
