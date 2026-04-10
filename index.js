export default async function handler(req, res) {
    // 1. CONFIGURAÇÃO DE HEADERS (Obrigatório para o Chrome Debug aceitar)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', '*');
    // 2. RESPONDE AO CHROME QUE O CAMINHO ESTÁ LIVRE
    // Se não tiver isso, o Flutter Web sempre vai dar "Failed to fetch" no console
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('Falta o parâmetro url');
    }

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Referer': new URL(targetUrl).origin + '/',
                'Origin': new URL(targetUrl).origin
            }
        });

        const data = await response.arrayBuffer();
        
        // Repassa o Content-Type original (seja JSON ou stream de vídeo)
        const contentType = response.headers.get('content-type');
        res.setHeader('Content-Type', contentType || 'application/json');

        return res.status(response.status).send(Buffer.from(data));

    } catch (e) {
        // Log para você ver no painel da Vercel se algo explodir
        console.error("Erro no Proxy:", e.message);
        return res.status(500).send('Erro no Proxy: ' + e.message);
    }
}
