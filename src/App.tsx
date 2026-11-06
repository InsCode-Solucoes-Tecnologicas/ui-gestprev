import { useEffect, useState, type FormEvent } from 'react'
import { api, ErroApi, type Usuario } from './api/cliente'

export default function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api
      .csrf()
      .then(() => api.eu())
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) return <main className="centro">Carregando...</main>

  if (!usuario) return <Login aoEntrar={setUsuario} />

  return (
    <main className="pagina">
      <header className="topo">
        <strong>GestPrev</strong>
        <span>
          {usuario.first_name || usuario.username} · {usuario.perfis.join(', ') || 'sem perfil'}
        </span>
        <button
          onClick={async () => {
            await api.logout()
            await api.csrf()
            setUsuario(null)
          }}
        >
          Sair
        </button>
      </header>
      <section>
        <h1>Calculadora Previdenciária</h1>
        <p>Ambiente no ar. As telas do cálculo entram na Fase 3.</p>
      </section>
    </main>
  )
}

function Login({ aoEntrar }: { aoEntrar: (u: Usuario) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function entrar(evento: FormEvent) {
    evento.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      aoEntrar(await api.login(username, password))
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : 'Falha ao conectar com a API.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="centro">
      <form className="cartao" onSubmit={entrar}>
        <h1>GestPrev</h1>
        <label>
          Usuário
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {erro && <p className="erro">{erro}</p>}
        <button type="submit" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}
