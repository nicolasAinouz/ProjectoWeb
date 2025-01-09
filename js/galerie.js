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

async function fetchStreamers() {
    try {
        const token = await getToken();
        
        const response = await fetch('https://api.twitch.tv/helix/streams?language=en', {
            method: 'GET',
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            throw new Error('Error fetching streamers');
        }
        
        const data = await response.json();
        const streamers = data.data.map(stream => ({
            name: stream.user_name,
            viewers: stream.viewer_count,
            thumbnail: stream.thumbnail_url,
            url: `https://www.twitch.tv/${stream.user_name}`,
        }));
        
        return streamers;
    } catch (error) {
        console.error(error);
    }
}