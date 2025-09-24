'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react'

interface LoginProps {
  onLogin: (user: any) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    // Verificar se já existe uma sessão ativa
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        onLogin(session.user)
      }
    })

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        onLogin(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [onLogin])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        setError('Email ou senha incorretos')
      } else if (data.user) {
        onLogin(data.user)
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4\">\n      <div className=\"max-w-md w-full\">\n        {/* Logo e Título */}\n        <div className=\"text-center mb-8\">\n          <div className=\"w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4\">\n            <User className=\"w-8 h-8 text-white\" />\n          </div>\n          <h1 className=\"text-3xl font-bold text-gray-900 mb-2\">Sistema Parlamentar</h1>\n          <p className=\"text-gray-600\">Faça login para acessar o sistema</p>\n        </div>\n\n        {/* Formulário de Login */}\n        <div className=\"bg-white rounded-2xl shadow-xl p-8\">\n          <form onSubmit={handleLogin} className=\"space-y-6\">\n            {error && (\n              <div className=\"bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm\">\n                {error}\n              </div>\n            )}\n\n            <div>\n              <label className=\"block text-sm font-medium text-gray-700 mb-2\">\n                Email\n              </label>\n              <div className=\"relative\">\n                <Mail className=\"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5\" />\n                <input\n                  type=\"email\"\n                  required\n                  value={formData.email}\n                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}\n                  className=\"w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors\"\n                  placeholder=\"seu@email.com\"\n                />\n              </div>\n            </div>\n\n            <div>\n              <label className=\"block text-sm font-medium text-gray-700 mb-2\">\n                Senha\n              </label>\n              <div className=\"relative\">\n                <Lock className=\"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5\" />\n                <input\n                  type={showPassword ? 'text' : 'password'}\n                  required\n                  value={formData.password}\n                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}\n                  className=\"w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors\"\n                  placeholder=\"••••••••\"\n                />\n                <button\n                  type=\"button\"\n                  onClick={() => setShowPassword(!showPassword)}\n                  className=\"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600\"\n                >\n                  {showPassword ? <EyeOff className=\"w-5 h-5\" /> : <Eye className=\"w-5 h-5\" />}\n                </button>\n              </div>\n            </div>\n\n            <button\n              type=\"submit\"\n              disabled={loading}\n              className=\"w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2\"\n            >\n              {loading ? (\n                <>\n                  <div className=\"w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin\"></div>\n                  Entrando...\n                </>\n              ) : (\n                'Entrar'\n              )}\n            </button>\n          </form>\n\n          {/* Informações de Acesso */}\n          <div className=\"mt-8 pt-6 border-t border-gray-200\">\n            <h3 className=\"text-sm font-medium text-gray-900 mb-3\">Níveis de Acesso:</h3>\n            <div className=\"space-y-2 text-sm text-gray-600\">\n              <div className=\"flex items-center gap-2\">\n                <div className=\"w-2 h-2 bg-blue-500 rounded-full\"></div>\n                <span><strong>Vereador:</strong> Acesso completo ao sistema</span>\n              </div>\n              <div className=\"flex items-center gap-2\">\n                <div className=\"w-2 h-2 bg-green-500 rounded-full\"></div>\n                <span><strong>Assessor:</strong> Acesso limitado às suas funções</span>\n              </div>\n            </div>\n          </div>\n        </div>\n\n        {/* Rodapé */}\n        <div className=\"text-center mt-6 text-sm text-gray-500\">\n          Sistema de Gestão Parlamentar v1.0\n        </div>\n      </div>\n    </div>\n  )\n}