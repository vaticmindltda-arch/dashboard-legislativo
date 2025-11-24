'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Lock, Eye, EyeOff, LogIn, Shield } from 'lucide-react'

interface LoginProps {
  onLogin: (user: any) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      // Primeiro, tenta fazer login com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: senha
      })

      if (authError) {
        // Se não conseguir fazer login com Auth, verifica na tabela usuarios
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', email)
          .eq('senha', senha) // Em produção, use hash da senha
          .eq('ativo', true)
          .single()

        if (userError || !userData) {
          setErro('Email ou senha incorretos')
          setLoading(false)
          return
        }

        // Login bem-sucedido com tabela usuarios
        onLogin(userData)
      } else {
        // Login bem-sucedido com Supabase Auth
        // Busca dados adicionais do usuário na tabela usuarios
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', email)
          .single()

        if (userData) {
          onLogin({ ...authData.user, ...userData })
        } else {
          onLogin(authData.user)
        }
      }
    } catch (error) {
      console.error('Erro no login:', error)
      setErro('Erro interno. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleLoginDemo = () => {
    // Login de demonstração
    const usuarioDemo = {
      id: 'demo-user',
      email: 'vereador@demo.com',
      nome: 'Vereador João Silva',
      nivel_acesso: 'vereador',
      cargo: 'Vereador',
      ativo: true
    }
    onLogin(usuarioDemo)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="bg-white p-4 rounded-full shadow-lg inline-block mb-4">
            <Shield className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema Parlamentar</h1>
          <p className="text-gray-600">Gestão Completa de Mandato</p>
        </div>

        {/* Formulário de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso ao Sistema</h2>
            <p className="text-gray-600">Entre com suas credenciais para continuar</p>
          </div>

          {erro && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{erro}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar no Sistema
                </>
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">ou</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Login Demo */}
          <button
            onClick={handleLoginDemo}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Acesso Demonstração
          </button>

          {/* Informações de Acesso */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Credenciais de Teste:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Vereador:</strong> vereador@sistema.com / senha123</p>
              <p><strong>Assessor:</strong> assessor@sistema.com / senha123</p>
              <p><strong>Demo:</strong> Clique em "Acesso Demonstração"</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Sistema Parlamentar v2.0 - Gestão Completa de Mandato
          </p>
        </div>
      </div>
    </div>
  )
}