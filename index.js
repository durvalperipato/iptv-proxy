export default async function handler(req, res) {
    // Pegamos a URL direto da query string sem deixar o Node processar muito
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('Falta o parâmetro url');
    }

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Referer': new URL(targetUrl).origin + '/',
                'Origin': new URL(targetUrl).origin
            }
        });

        // Se o IPTV retornar erro, a gente quer ver o que ele disse
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro no IPTV:", response.status, errorText);
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.status(response.status).send(errorText);
        }

        const data = await response.arrayBuffer();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');

        return res.status(200).send(Buffer.from(data));
    } catch (e) {
        return res.status(500).send('Erro no Proxy: ' + e.message);
    }
}
