import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Usuario {
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
  created_at: string
  updated_at: string
}

export interface Municipe {
  id: string
  nome: string
  email: string
  whatsapp: string
  rua: string
  bairro: string
  nascimento: string
  sexo: 'masculino' | 'feminino'
  created_at: string
  updated_at: string
}

export interface Pedido {
  id: string
  municipe_id: string
  titulo: string
  descricao: string
  categoria: string
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  status: 'pendente' | 'em_andamento' | 'resolvido' | 'cancelado'
  data_abertura: string
  data_resposta?: string
  resposta?: string
  bairro: string
  rua: string
  created_at: string
  updated_at: string
}

export interface Bairro {
  id: string
  nome: string
  regiao: string
  populacao: number
  descricao: string
  created_at: string
  updated_at: string
}

export interface Tarefa {
  id: string
  titulo: string
  descricao: string
  tipo: 'administrativa' | 'atendimento' | 'evento' | 'projeto' | 'urgente'
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada'
  assessor_id: string
  data_criacao: string
  data_vencimento: string
  data_conclusao?: string
  created_at: string
  updated_at: string
}

export interface MateriaLegislativa {
  id: string
  numero: string
  bairro: string
  tipo_legislativo: string
  tema: string
  data_protocolo: string
  estado_tramitacao: 'protocolado' | 'em_tramitacao' | 'aprovado' | 'rejeitado' | 'arquivado'
  observacoes?: string
  created_at: string
  updated_at: string
}