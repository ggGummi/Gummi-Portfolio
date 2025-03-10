// main.js - Portfolio website with Netlify function API
document.addEventListener('DOMContentLoaded', () => {
  fetchGameStats();
});

// Function to fetch game statistics via Netlify function
async function fetchGameStats() {
  try {
    // Set loading state
    setStatsLoadingState();
    
    // Call our Netlify function (note the /api/ prefix defined in redirects)
    const response = await fetch('/.netlify/functions/getRobloxStats');
    if (!response.ok) throw new Error('Failed to fetch game stats');
    const stats = await response.json();
    
    // Update the UI with loaded data
    document.getElementById('visits').textContent = formatNumber(stats.visits);
    document.getElementById('favorites').textContent = formatNumber(stats.favorites);
    document.getElementById('active-players').textContent = formatNumber(stats.activePlayers);
    document.getElementById('likes').textContent = `71%`;
    document.getElementById('last-updated').textContent = stats.lastUpdated;
    
    // Add timestamp of when stats were fetched
    const statsContainer = document.querySelector('.project-stats');
    if (statsContainer) {
      const updateNote = document.createElement('div');
      updateNote.className = 'stats-update-note';
      updateNote.textContent = `Stats updated: ${new Date().toLocaleString()}`;
      updateNote.style.fontSize = '0.8rem';
      updateNote.style.marginTop = '10px';
      updateNote.style.textAlign = 'right';
      statsContainer.appendChild(updateNote);
    }
  } catch (error) {
    console.error('Error fetching game stats:', error);
    setStatsFallbackState();
  }
}

// Format numbers with commas
function formatNumber(number) {
  return number.toLocaleString();
}

// Set loading state for stats
function setStatsLoadingState() {
  document.getElementById('visits').textContent = 'Loading...';
  document.getElementById('favorites').textContent = 'Loading...';
  document.getElementById('active-players').textContent = 'Loading...';
  document.getElementById('likes').textContent = 'Loading...';
  document.getElementById('last-updated').textContent = 'Loading...';
}

// Set fallback values in case API calls fail
function setStatsFallbackState() {
  document.getElementById('visits').textContent = '9.8M+';
  document.getElementById('favorites').textContent = '20K+';
  document.getElementById('active-players').textContent = '40+';
  document.getElementById('likes').textContent = '70%+';
  document.getElementById('last-updated').textContent = 'Recent';
  
  // Display error message to user
  const statsContainer = document.querySelector('.project-stats');
  if (statsContainer) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'api-error-message';
    errorMessage.textContent = 'Could not load real-time stats. Showing approximate values.';
    errorMessage.style.color = '#ff5555';
    errorMessage.style.marginTop = '10px';
    statsContainer.appendChild(errorMessage);
  }
}