export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('Mande a URL no parâmetro ?url=');
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Referer': new URL(url).origin + '/',
                'Origin': new URL(url).origin
            }
        });

        // Lemos os dados como buffer para não corromper o binário do vídeo
        const data = await response.arrayBuffer();
        
        // Headers mágicos para o Flutter Web
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/vnd.apple.mpegurl');

        return res.status(response.status).send(Buffer.from(data));
    } catch (e) {
        return res.status(500).send('Erro no Proxy: ' + e.message);
    }
}
