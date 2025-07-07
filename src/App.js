import React, { useState, useEffect } from 'react';
import './App.css';

const MOODS = [
  { emoji: '😊', label: 'Happy', color: '#FFD700' },
  { emoji: '😢', label: 'Sad', color: '#87CEEB' },
  { emoji: '😡', label: 'Angry', color: '#FF6B6B' },
  { emoji: '😰', label: 'Anxious', color: '#DDA0DD' },
  { emoji: '😴', label: 'Tired', color: '#B0C4DE' },
  { emoji: '😎', label: 'Confident', color: '#32CD32' },
  { emoji: '🤔', label: 'Thoughtful', color: '#F0E68C' },
  { emoji: '😑', label: 'Neutral', color: '#D3D3D3' },
];

function App() {
  const [moodEntries, setMoodEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Load mood entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setMoodEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save mood entries to localStorage whenever moodEntries changes
  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
  }, [moodEntries]);

  const handleMoodSubmit = (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    const newEntry = {
      id: Date.now(),
      mood: selectedMood,
      note: note.trim(),
      date: new Date().toISOString(),
    };

    setMoodEntries(prev => [newEntry, ...prev]);
    setSelectedMood(null);
    setNote('');
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const deleteEntry = (id) => {
    setMoodEntries(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🌟 My Mood Journal</h1>
        <p>Track your daily emotions and thoughts</p>
      </header>

      <main className="main-content">
        {!showForm ? (
          <div className="welcome-section">
            <button 
              className="add-mood-btn"
              onClick={() => setShowForm(true)}
            >
              + Add Today's Mood
            </button>
          </div>
        ) : (
          <div className="mood-form-container">
            <h2>How are you feeling today?</h2>
            <form onSubmit={handleMoodSubmit} className="mood-form">
              <div className="mood-selector">
                {MOODS.map((mood) => (
                  <button
                    key={mood.label}
                    type="button"
                    className={`mood-option ${selectedMood?.label === mood.label ? 'selected' : ''}`}
                    onClick={() => setSelectedMood(mood)}
                    style={{ 
                      backgroundColor: selectedMood?.label === mood.label ? mood.color : 'transparent',
                      borderColor: mood.color 
                    }}
                  >
                    <span className="mood-emoji">{mood.emoji}</span>
                    <span className="mood-label">{mood.label}</span>
                  </button>
                ))}
              </div>

              <div className="note-section">
                <label htmlFor="note">Write a note about your mood (optional):</label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What happened today? How are you feeling? Any thoughts you'd like to remember..."
                  rows="4"
                  maxLength="500"
                />
                <small>{note.length}/500 characters</small>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={!selectedMood}>
                  Save Mood Entry
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedMood(null);
                    setNote('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mood-history">
          <h2>Your Mood History</h2>
          {moodEntries.length === 0 ? (
            <div className="no-entries">
              <p>No mood entries yet. Start by adding your first mood!</p>
            </div>
          ) : (
            <div className="entries-container">
              {moodEntries.map((entry) => (
                <div key={entry.id} className="mood-entry">
                  <div className="entry-header">
                    <div className="mood-display">
                      <span 
                        className="mood-emoji-large"
                        style={{ backgroundColor: entry.mood.color }}
                      >
                        {entry.mood.emoji}
                      </span>
                      <div className="mood-info">
                        <span className="mood-name">{entry.mood.label}</span>
                        <span className="entry-date">{formatDate(entry.date)}</span>
                      </div>
                    </div>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteEntry(entry.id)}
                      title="Delete entry"
                    >
                      ×
                    </button>
                  </div>
                  {entry.note && (
                    <div className="entry-note">
                      <p>{entry.note}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
