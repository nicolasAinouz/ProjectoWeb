function reloadPage() {
    location.reload(); 
}

function closeBanner() {
    const banner = document.getElementById('reload-banner');
    const reopenBtn = document.getElementById('reopen-banner-btn');
    banner.classList.remove('show');
    banner.classList.add('hide');
    
    banner.addEventListener('animationend', () => {
        if (banner.classList.contains('hide')) {
            banner.style.display = 'none';
            reopenBtn.style.display = 'flex'; 
        }
    }, { once: true });
}

function openBanner() {
    const banner = document.getElementById('reload-banner');
    const reopenBtn = document.getElementById('reopen-banner-btn');
    banner.style.display = 'flex';
    banner.classList.remove('hide');
    banner.classList.add('show');
    reopenBtn.style.display = 'none';
}

async function fetchStreamerDetails() {
    const clientId = 'adbopgnei7covlqdafnlj96ef5jujj';
    const clientSecret = 'gzltzahimveacj859q9kimvi8ymtcc';
    
    async function getToken() {
        const storedToken = localStorage.getItem('twitch_token');
        const tokenExpiration = localStorage.getItem('twitch_token_expiration');
        const now = new Date().getTime();
        
        if (storedToken && tokenExpiration && now < parseInt(tokenExpiration)) {
            console.log('stored')
            return storedToken;
        }
        
        const response = await fetch(
            `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
            { method: 'POST' }
        );
        const data = await response.json();
        
        const expiresIn = data.expires_in * 1000;
        localStorage.setItem('twitch_token', data.access_token);
        localStorage.setItem('twitch_token_expiration', (now + expiresIn).toString());
        
        return data.access_token;
    }
    
    try {
        const token = await getToken();
        const headers = { 
            'Authorization': `Bearer ${token}`,
            'Client-Id': clientId 
        };
        
        const streamResponse = await fetch('https://api.twitch.tv/helix/streams?first=20&language=en', { headers });
        const streamData = await streamResponse.json();
        const randomStreamer = streamData.data[Math.floor(Math.random() * streamData.data.length)];
        
        const { user_name, user_id, game_id, thumbnail_url } = randomStreamer;
        
        const userResponse = await fetch(`https://api.twitch.tv/helix/users?id=${user_id}`, { headers });
        const userData = await userResponse.json();
        
        const gameResponse = await fetch(`https://api.twitch.tv/helix/games?id=${game_id}`, { headers });
        const gameData = await gameResponse.json();
        
        const clipsResponse = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${user_id}&first=2`, { headers });
        const clipsData = await clipsResponse.json();
        
        return {
            user: userData.data[0],
            game: gameData.data[0],
            clips: clipsData.data,
            stream: randomStreamer
        };
    } catch (error) {
        console.error('Error fetching streamer details:', error);
        throw error;
    }
}

function printStreamerDetails({ user, game, clips, stream }) {
    const profileImage = user.profile_image_url || '';
    const bio = user.description || 'No bio available';
    const gameName = game?.name || 'Unknown Game';
    const gameThumbnail = game?.box_art_url?.replace('{width}', '300').replace('{height}', '400') || '';
    
    document.getElementById('streamer-info').innerHTML = `
        <div class="col-lg-4 col-md-6">
            <div class="streamer-card">
                <img src="${profileImage}" alt="${user.display_name}'s profile">
                <h4>${user.display_name}</h4>
                <p>${bio}</p>
            </div>
        </div>
        <div class="col-lg-8 col-md-6">
            <div class="game-section">
                <img src="${gameThumbnail}" alt="${gameName}">
                <h5>Playing: ${gameName}</h5>
                <h6>Top Clips:</h6>
                <div class="row g-3">
                    ${clips.map(clip => `
                        <div class="col-6 clip-thumbnail">
                            <a href="${clip.url}" target="_blank">
                                <img src="${clip.thumbnail_url}" alt="Clip Thumbnail">
                            </a>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
`;
}