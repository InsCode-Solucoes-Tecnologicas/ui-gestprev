// Cliente HTTP da API GestPrev: sessao por cookie + header X-CSRFToken.
// Tipos vem do contrato OpenAPI da API: npm run gen:api -> src/api/schema.d.ts (nao editar a mao).

import type { components } from './schema'

export type Usuario = components['schemas']['Usuario']

export class ErroApi extends Error {
  status: number
  constructor(status: number, mensagem: string) {
    super(mensagem)
    this.status = status
  }
}

function lerCookie(nome: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((parte) => parte.startsWith(`${nome}=`))
    ?.split('=')[1]
}

async function chamar<T>(metodo: string, caminho: string, corpo?: unknown): Promise<T> {
  const cabecalhos: Record<string, string> = { Accept: 'application/json' }
  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json'
  if (metodo !== 'GET') {
    const token = lerCookie('csrftoken')
    if (token) cabecalhos['X-CSRFToken'] = token
  }
  const resposta = await fetch(`/api${caminho}`, {
    method: metodo,
    headers: cabecalhos,
    credentials: 'same-origin',
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  })
  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`
    try {
      const dados = await resposta.json()
      if (dados?.detail) mensagem = dados.detail
    } catch {
      // resposta sem corpo JSON
    }
    throw new ErroApi(resposta.status, mensagem)
  }
  if (resposta.status === 204) return undefined as T
  return resposta.json() as Promise<T>
}

export const api = {
  csrf: () => chamar<void>('GET', '/auth/csrf/'),
  login: (username: string, password: string) =>
    chamar<Usuario>('POST', '/auth/login/', { username, password }),
  logout: () => chamar<void>('POST', '/auth/logout/'),
  eu: () => chamar<Usuario>('GET', '/auth/eu/'),
}
