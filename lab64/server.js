// Importa os módulos necessários
const http = require('http'); // Módulo para criar o servidor HTTP
const fs = require('fs'); // Módulo para manipulação de arquivos
const path = require('path'); // Módulo para trabalhar com caminhos de arquivos

// Configuração da porta do servidor
const PORT = 3000;

// Função para lidar com requisições
const requestHandler = (req, res) => {
    // Logs para depuração
    console.log('URL:', req.url); // Log da URL acessada
    console.log('Método:', req.method); // Log do método HTTP
    console.log('Cabeçalho Content-Type:', req.headers['content-type']); // Log do cabeçalho Content-Type

    // Rota da página inicial
    if (req.method === 'GET' && req.url === '/') {
        // Define o cabeçalho da resposta e o tipo de conteúdo
        res.writeHead(200, { 'Content-Type': 'text/html' });
        // Envia a página inicial com links para outras rotas
        res.end(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Página Inicial</title>
            </head>
            <body>
                <h1>Página Inicial</h1>
                <p>Bem-vindo ao nosso servidor de upload de arquivos!</p>
                <a href="/sobre">Sobre</a><br>
                <a href="/upload">Enviar Arquivo</a>
            </body>
            </html>
        `);
    }
    // Rota Sobre
    else if (req.method === 'GET' && req.url === '/sobre') {
        // Define o cabeçalho da resposta e o tipo de conteúdo
        res.writeHead(200, { 'Content-Type': 'text/html' });
        // Envia a página sobre o projeto
        res.end(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Sobre</title>
            </head>
            <body>
                <h1>Sobre</h1>
                <p>Informações sobre o projeto.</p>
                <a href="/">Voltar para a Página Inicial</a>
            </body>
            </html>
        `);
    }
    // Rota para enviar arquivo (formulário)
    else if (req.method === 'GET' && req.url === '/upload') {
        // Define o cabeçalho da resposta e o tipo de conteúdo
        res.writeHead(200, { 'Content-Type': 'text/html' });
        // Envia a página com o formulário para upload
        res.end(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Enviar Arquivo</title>
            </head>
            <body>
                <h1>Enviar Arquivo</h1>
                <form action="/upload" method="POST" enctype="multipart/form-data">
                    <input type="file" name="file" required />
                    <button type="submit">Enviar</button>
                </form>
                <a href="/">Voltar para a Página Inicial</a>
            </body>
            </html>
        `);
    }
    // Rota de upload de arquivos (POST)
    else if (req.method === 'POST' && req.url === '/upload') {
        let body = '';

        // Coletar dados da requisição
        req.on('data', chunk => {
            body += chunk.toString(); // Concatena os chunks recebidos
        });

        req.on('end', () => {
            // Extrair o boundary do cabeçalho
            const boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
            // Divide o corpo da requisição em partes
            const parts = body.split('--' + boundary).slice(1, -1);

            for (let part of parts) {
                // Extraindo informações do arquivo
                const contentDisposition = part.match(/Content-Disposition: form-data; name="([^"]+)"; filename="([^"]+)"/);
                if (contentDisposition) {
                    const name = contentDisposition[1]; // Nome do campo
                    const filename = contentDisposition[2]; // Nome do arquivo
                    const fileData = part.split('\r\n\r\n')[1].slice(0, -4); // Remove os delimitadores

                    const filePath = path.join(__dirname, 'uploads'); // Caminho para a pasta de uploads
                    // Verifica se a pasta existe, se não, cria
                    if (!fs.existsSync(filePath)) {
                        fs.mkdirSync(filePath);
                    }

                    const outputPath = path.join(filePath, filename); // Caminho para salvar o arquivo
                    fs.writeFileSync(outputPath, fileData, 'binary'); // Salva o arquivo

                    // Define o cabeçalho da resposta e envia a confirmação
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(`
                        <!DOCTYPE html>
                        <html lang="pt-BR">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Arquivo Enviado</title>
                        </head>
                        <body>
                            <h1>Arquivo Enviado com Sucesso!</h1>
                            <p>Arquivo: ${filename}</p>
                            <a href="/">Voltar para a Página Inicial</a>
                        </body>
                        </html>
                    `);
                    return;
                }
            }
            // Caso não tenha encontrado arquivo para upload
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Erro</title>
                </head>
                <body>
                    <h1>Erro!</h1>
                    <p>Nenhum arquivo encontrado para upload.</p>
                    <a href="/upload">Tentar Novamente</a>
                </body>
                </html>
            `);
        });
    }
    // Rota 404 para páginas não encontradas
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>Página Não Encontrada</h1>');
    }
};

// Criação do servidor
const server = http.createServer(requestHandler);

// Iniciando o servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
