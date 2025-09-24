'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { supabase, Usuario } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  usuario: Usuario | null
  loading: boolean
  signOut: () => Promise<void>
  isVereador: boolean
  isAssessor: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)\n  const [usuario, setUsuario] = useState<Usuario | null>(null)\n  const [loading, setLoading] = useState(true)\n\n  useEffect(() => {\n    // Verificar sessão inicial\n    supabase.auth.getSession().then(({ data: { session } }) => {\n      setUser(session?.user ?? null)\n      if (session?.user) {\n        fetchUsuario(session.user.id)\n      } else {\n        setLoading(false)\n      }\n    })\n\n    // Escutar mudanças na autenticação\n    const {\n      data: { subscription },\n    } = supabase.auth.onAuthStateChange(async (event, session) => {\n      setUser(session?.user ?? null)\n      if (session?.user) {\n        await fetchUsuario(session.user.id)\n      } else {\n        setUsuario(null)\n        setLoading(false)\n      }\n    })\n\n    return () => subscription.unsubscribe()\n  }, [])\n\n  const fetchUsuario = async (userId: string) => {\n    try {\n      const { data, error } = await supabase\n        .from('usuarios')\n        .select('*')\n        .eq('id', userId)\n        .single()\n\n      if (error) {\n        console.error('Erro ao buscar usuário:', error)\n      } else {\n        setUsuario(data)\n      }\n    } catch (error) {\n      console.error('Erro ao buscar usuário:', error)\n    } finally {\n      setLoading(false)\n    }\n  }\n\n  const signOut = async () => {\n    await supabase.auth.signOut()\n    setUser(null)\n    setUsuario(null)\n  }\n\n  const isVereador = usuario?.nivel_acesso === 'vereador'\n  const isAssessor = usuario?.nivel_acesso === 'assessor'\n\n  return (\n    <AuthContext.Provider value={{\n      user,\n      usuario,\n      loading,\n      signOut,\n      isVereador,\n      isAssessor\n    }}>\n      {children}\n    </AuthContext.Provider>\n  )\n}\n\nexport function useAuth() {\n  const context = useContext(AuthContext)\n  if (context === undefined) {\n    throw new Error('useAuth deve ser usado dentro de um AuthProvider')\n  }\n  return context\n}