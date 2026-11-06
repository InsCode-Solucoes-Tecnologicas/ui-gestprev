# ui-gestprev

Front da plataforma **GestPrev** — React + Vite + TypeScript. Primeiro módulo: Calculadora Previdenciária.

A API fica no repositório [api-gestprev](https://github.com/ins-batista/api-gestprev).

## Subir tudo junto (recomendado)

O `docker compose` do **api-gestprev** constrói este front e sobe banco, API e nginx. Veja o README de lá. Acesso em http://localhost:8080.

## Desenvolvimento só do front

Com a API rodando em `http://localhost:8000` (runserver):

```bash
npm install
npm run dev
```

O Vite encaminha `/api` para a API, imitando o nginx de produção (mesmo domínio, sessão por cookie, sem CORS). Para outra URL: `API_URL=http://127.0.0.1:8080 npm run dev`.

## Contrato com a API

Os tipos das respostas vêm do OpenAPI da API, nunca escritos à mão:

```bash
API_SCHEMA_URL=http://localhost:8080/api/schema/ npm run gen:api
```

Gera `src/api/schema.d.ts`, que é versionado. Rode de novo sempre que a API mudar e faça commit junto.

## Qualidade

```bash
npm run lint
npm run build
```

O CI (GitHub Actions) roda lint, build e o build da imagem em todo push e PR.

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| `src/api/cliente.ts` | Chamadas à API: cookie de sessão + header `X-CSRFToken` |
| `src/api/schema.d.ts` | Tipos gerados do contrato OpenAPI |
| `src/App.tsx` | Login e página inicial |
| `deploy/nginx.conf` | Nginx que serve a SPA dentro do container |
