import React, { useState } from "react";
import axios from "axios";

function App() {
  const [mood, setMood] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const songsPerPage = 4;

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSongs([]);
    setCurrentIndex(0);
    try {
      const response = await axios.post("http://127.0.0.1:8000/recommend", {
        mood,
      });
      setSongs(response.data);
    } catch (error) {
      alert("Error fetching recommendations");
    }
    setLoading(false);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;
    setLoading(true);
    setSongs([]);
    setCurrentIndex(0);
    const formData = new FormData();
    formData.append("file", image);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/recommend_from_image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSongs(response.data);
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Error fetching recommendations from image"
      );
    }
    setLoading(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - songsPerPage, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + songsPerPage, songs.length - songsPerPage)
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          width: "100%",
          margin: "0 auto",
          padding: "48px 40px 40px 40px",
          background: "#fff",
          borderRadius: 32,
          boxShadow: "0 8px 32px rgba(76, 110, 245, 0.13)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 38 }}>
          <span
            style={{
              fontSize: 48,
              color: "#764ba2",
              verticalAlign: "middle",
              marginRight: 10,
            }}
            role="img"
            aria-label="music"
          >
            <svg width="44" height="44" fill="none" viewBox="0 0 24 24">
              <path fill="#764ba2" d="M9 17V5l12-2v12" />
              <circle cx="6" cy="18" r="3" fill="#667eea" />
              <circle cx="18" cy="16" r="3" fill="#667eea" />
            </svg>
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: 36,
              color: "#2d3748",
              letterSpacing: 1,
              fontFamily: "'Montserrat', sans-serif",
              verticalAlign: "middle",
            }}
          >
            Mood Music AI
          </span>
        </div>
        <form
          onSubmit={handleTextSubmit}
          style={{ display: "flex", gap: 16, marginBottom: 28 }}
        >
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Describe your mood..."
            style={{
              flex: 1,
              padding: "18px 20px",
              borderRadius: 12,
              border: "1.5px solid #d1d5db",
              fontSize: 22,
              background: "#f7f8fa",
              outline: "none",
              transition: "border 0.2s",
            }}
            required
          />
          <button
            type="submit"
            style={{
              padding: "18px 32px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 20,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(76, 110, 245, 0.10)",
              transition: "background 0.2s",
            }}
          >
            Get Songs
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            margin: "28px 0 24px 0",
            color: "#b0a7c7",
            fontWeight: 600,
            fontSize: 20,
            letterSpacing: 1,
          }}
        >
          or
        </div>

        <form
          onSubmit={handleImageSubmit}
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            marginBottom: 36,
            justifyContent: "center",
          }}
        >
          <label
            htmlFor="file-upload"
            style={{
              padding: "16px 24px",
              borderRadius: 12,
              background: "#f7f8fa",
              border: "1.5px solid #d1d5db",
              fontSize: 18,
              color: "#764ba2",
              fontWeight: 600,
              cursor: "pointer",
              marginRight: 8,
              transition: "background 0.2s, border 0.2s",
              display: "inline-block",
            }}
          >
            {image ? image.name : "Choose Image"}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              style={{ display: "none" }}
            />
          </label>
          <button
            type="submit"
            style={{
              padding: "16px 32px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 20,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(76, 110, 245, 0.10)",
              transition: "background 0.2s",
            }}
          >
            Analyze Image
          </button>
        </form>

        {loading && (
          <p
            style={{
              textAlign: "center",
              color: "#764ba2",
              fontWeight: 600,
              fontSize: 20,
            }}
          >
            Loading...
          </p>
        )}

        {songs.length > 0 && (
          <div
            style={{
              marginTop: 38,
              background: "#f7f8fa",
              borderRadius: 18,
              padding: 32,
              boxShadow: "0 2px 8px rgba(76, 110, 245, 0.06)",
              position: "relative",
            }}
          >
            <h3
              style={{
                color: "#2d3748",
                marginBottom: 24,
                textAlign: "center",
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: 0.5,
              }}
            >
              Recommended Songs
            </h3>
            {/* Left Arrow */}
            {songs.length > songsPerPage && (
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                style={{
                  position: "absolute",
                  left: -30,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#fff",
                  border: "2px solid #764ba2",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(76, 110, 245, 0.10)",
                  cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                  opacity: currentIndex === 0 ? 0.3 : 1,
                  zIndex: 2,
                  transition: "opacity 0.2s",
                  padding: 0,
                }}
                aria-label="Previous"
              >
                <svg width="28" height="28" viewBox="0 0 28 28">
                  <path
                    d="M20 6 L10 14 L20 22"
                    stroke="#222"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>
            )}
            {/* Right Arrow */}
            {songs.length > songsPerPage && (
              <button
                onClick={handleNext}
                disabled={currentIndex + songsPerPage >= songs.length}
                style={{
                  position: "absolute",
                  right: -30,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#fff",
                  border: "2px solid #764ba2",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(76, 110, 245, 0.10)",
                  cursor:
                    currentIndex + songsPerPage >= songs.length
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    currentIndex + songsPerPage >= songs.length ? 0.3 : 1,
                  zIndex: 2,
                  transition: "opacity 0.2s",
                  padding: 0,
                }}
                aria-label="Next"
              >
                <svg width="28" height="28" viewBox="0 0 28 28">
                  <path
                    d="M8 6 L18 14 L8 22"
                    stroke="#222"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>
            )}
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {songs
                .slice(currentIndex, currentIndex + songsPerPage)
                .map((song, idx) => (
                  <li key={idx} style={{ marginBottom: 18 }}>
                    <a
                      href={song.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#4f8cff",
                        textDecoration: "none",
                        fontWeight: 700,
                        fontSize: 22,
                        letterSpacing: 0.2,
                        transition: "color 0.2s",
                      }}
                    >
                      {song.title} - {song.artist}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
