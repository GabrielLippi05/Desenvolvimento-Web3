# Testando o Servidor com cURL

Este servidor foi desenvolvido para aceitar requisições HTTP através de várias rotas. 

Abaixo estão exemplos de como testar cada rota usando o cURL:

Rota Inicial (`/`)

Use o comando abaixo para acessar a página inicial:

```bash
curl http://localhost:3000/
curl http://localhost:3000/sobre
curl -X POST http://localhost:3000/upload -F "file=@/caminho/para/seu/arquivo.txt"
