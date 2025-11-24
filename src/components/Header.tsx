'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { User, LogOut, Settings, ChevronDown, Shield, Bell } from 'lucide-react'

interface HeaderProps {
  activeScreen: string
}

export default function Header({ activeScreen }: HeaderProps) {
  const { usuario, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const getScreenTitle = (screen: string) => {
    const titles: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'contatos': 'Contatos',
      'pedidos': 'Pedidos',
      'bairros': 'Bairros',
      'materia-legislativa': 'Matéria Legislativa',
      'tarefas': 'Tarefas',
      'marketing': 'Marketing',
      'relatorios': 'Relatórios',
      'alertas': 'Alertas',
      'assinatura': 'Assinatura Digital',
      'documentos': 'Documentos',
      'cadastro-assessor': 'Cadastro de Assessor',
      'listagem-municipes': 'Listagem de Munícipes'
    }
    return titles[screen] || 'Sistema Parlamentar'
  }

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair do sistema?')) {
      logout()
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">
            {getScreenTitle(activeScreen)}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Informações do Sistema */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Sistema Online</span>
          </div>

          {/* Notificações */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </button>

          {/* Menu do Usuário */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{usuario?.nome}</p>
                <p className="text-xs text-gray-600 capitalize">{usuario?.nivel_acesso}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{usuario?.nome}</p>
                      <p className="text-xs text-gray-600">{usuario?.email}</p>
                      {usuario?.cargo && (
                        <p className="text-xs text-gray-500 mt-1">{usuario.cargo}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Configurações
                  </button>
                  
                  <div className="border-t border-gray-100 my-2"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair do Sistema
                  </button>
                </div>

                {/* Informações Adicionais */}
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3" />
                      <span><strong>Nível:</strong> {usuario?.nivel_acesso}</span>
                    </div>
                    {usuario?.whatsapp && (
                      <p><strong>WhatsApp:</strong> {usuario.whatsapp}</p>
                    )}
                    {usuario?.bairro && (
                      <p><strong>Bairro:</strong> {usuario.bairro}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clique fora para fechar menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </header>
  )
}