// Get Roblox game stats
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
      
      // Fetch game stats from Roblox
      const universeId = '4673043693'; // Universe ID for John Pork is Calling
      const placeId = '12968866459'; // Place ID for John Pork is Calling
      
      // Get game details
      const gameResponse = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
      if (!gameResponse.ok) throw new Error('Failed to fetch game data');
      const gameData = await gameResponse.json();
      
      // Get player count
      const playersResponse = await fetch(`https://games.roblox.com/v1/games/${placeId}/playing`);
      if (!playersResponse.ok) throw new Error('Failed to fetch player count');
      const playerCount = await playersResponse.json();
      
      // Get last updated info
      const versionsResponse = await fetch(`https://games.roblox.com/v1/games/${universeId}/versions?limit=1&sortOrder=Desc`);
      if (!versionsResponse.ok) throw new Error('Failed to fetch version data');
      const versionsData = await versionsResponse.json();
      
      // Extract game info
      const game = gameData.data[0];
      let lastUpdated = "Unknown";
      
      if (versionsData && versionsData.data && versionsData.data[0]) {
        const updateDate = new Date(versionsData.data[0].created);
        lastUpdated = updateDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      // Return the data
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          visits: game.visits,
          favorites: game.favoritedCount,
          activePlayers: playerCount,
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