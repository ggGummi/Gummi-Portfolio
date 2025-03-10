exports.handler = async function(event, context) {
  try {
    // Enable CORS
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };
    
    // Handle preflight OPTIONS request
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers
      };
    }
    
    // Use only the universe ID, since it has all the data we need
    const universeId = '4535329696';
    
    // Get all game details from a single API call
    console.log("Fetching game data from Roblox...");
    const gameResponse = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
    if (!gameResponse.ok) throw new Error('Failed to fetch game data');
    const gameData = await gameResponse.json();
    
    // Extract game info
    const game = gameData.data[0];
    const lastUpdated = new Date(game.updated).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
    
    // Return the data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        visits: game.visits,
        favorites: game.favoritedCount,
        activePlayers: game.playing,
        likes: Math.round((game.likeRatio || 0) * 100),
        lastUpdated: lastUpdated,
        updateTimestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.log('Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch Roblox stats',
        message: error.message
      })
    };
  }
};