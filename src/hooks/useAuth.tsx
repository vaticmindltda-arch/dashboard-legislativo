'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '@/lib/supabase'

interface Usuario {
  id: string
  email: string
  nome: string
  nivel_acesso: 'vereador' | 'assessor'
  cargo?: string
  whatsapp?: string
  rua?: string
  bairro?: string
  nascimento?: string
  sexo?: 'masculino' | 'feminino'
  ativo: boolean
}

interface AuthContextType {
  usuario: Usuario | null
  loading: boolean
  login: (userData: any) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const usuarioSalvo = localStorage.getItem('usuario_logado')
    if (usuarioSalvo) {
      try {
        const userData = JSON.parse(usuarioSalvo)
        setUsuario(userData)
      } catch (error) {
        console.error('Erro ao recuperar usuário:', error)
        localStorage.removeItem('usuario_logado')
      }
    }

    // Verificar sessão do Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !usuario) {
        // Buscar dados do usuário na tabela usuarios
        supabase
          .from('usuarios')
          .select('*')
          .eq('email', session.user.email)
          .single()
          .then(({ data, error }) => {
            if (data && !error) {
              const userData = {
                id: data.id,
                email: data.email,
                nome: data.nome,
                nivel_acesso: data.nivel_acesso,
                cargo: data.cargo,
                whatsapp: data.whatsapp,
                rua: data.rua,
                bairro: data.bairro,
                nascimento: data.nascimento,
                sexo: data.sexo,
                ativo: data.ativo
              }
              setUsuario(userData)
              localStorage.setItem('usuario_logado', JSON.stringify(userData))
            }
          })
      }
      setLoading(false)
    })

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUsuario(null)
          localStorage.removeItem('usuario_logado')
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = (userData: any) => {
    const usuario: Usuario = {
      id: userData.id || userData.user_id || 'demo-user',
      email: userData.email,
      nome: userData.nome || userData.name || 'Usuário',
      nivel_acesso: userData.nivel_acesso || 'vereador',
      cargo: userData.cargo,
      whatsapp: userData.whatsapp,
      rua: userData.rua,
      bairro: userData.bairro,
      nascimento: userData.nascimento,
      sexo: userData.sexo,
      ativo: userData.ativo !== false
    }
    
    setUsuario(usuario)
    localStorage.setItem('usuario_logado', JSON.stringify(usuario))
  }

  const logout = async () => {
    try {
      // Fazer logout do Supabase Auth se estiver logado
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
    
    // Limpar dados locais
    setUsuario(null)
    localStorage.removeItem('usuario_logado')
    
    // Recarregar a página para garantir limpeza completa
    window.location.reload()
  }

  const value = {
    usuario,
    loading,
    login,
    logout,
    isAuthenticated: !!usuario
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}