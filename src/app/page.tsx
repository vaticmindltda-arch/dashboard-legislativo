'use client'

import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import Login from '@/components/Login'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'
import { 
  BarChart3, 
  Users, 
  FileText, 
  MapPin, 
  TrendingUp,
  UserPlus,
  Edit3,
  Home,
  Phone,
  CheckSquare,
  Megaphone,
  BarChart,
  Bell,
  PenTool,
  FolderOpen,
  User,
  Search,
  Trash2,
  Plus,
  Clock,
  AlertTriangle,
  Filter,
  Calendar,
  MessageSquare,
  Eye,
  CheckCircle,
  XCircle,
  Thermometer,
  ArrowUp,
  ArrowDown,
  Target,
  ArrowRight,
  ListTodo,
  UserCheck,
  Activity,
  PieChart,
  Award,
  Zap,
  Upload,
  Image,
  Video,
  Palette,
  Sparkles,
  Save,
  Send,
  Heart,
  Gift,
  TreePine,
  Flag,
  Briefcase,
  Cake,
  Mail,
  Download,
  RefreshCw,
  Wand2,
  Layout,
  Type,
  Camera,
  List,
  Scale,
  FileUp,
  Signature,
  MousePointer,
  RotateCcw,
  Check,
  X,
  CalendarDays,
  UserCog,
  ClipboardList,
  TrendingDown
} from 'lucide-react'

// Tipos e interfaces
type ActiveScreen = 'dashboard' | 'cadastro-assessor' | 'listagem-municipes' | 'contatos' | 'pedidos' | 'tarefas' | 'marketing' | 'relatorios' | 'alertas' | 'assinatura' | 'agenda' | 'bairros' | 'materia-legislativa'
type ContatosView = 'lista' | 'cadastro' | 'edicao'
type PedidosView = 'lista' | 'cadastro' | 'edicao' | 'detalhes'
type BairrosView = 'lista' | 'cadastro' | 'edicao'
type MarketingView = 'criador' | 'templates' | 'aniversarios' | 'calendario' | 'datas-comemorativas'
type MunicipesView = 'lista' | 'cadastro' | 'edicao'
type MateriaLegislativaView = 'lista' | 'cadastro' | 'edicao'
type TarefasView = 'lista' | 'cadastro' | 'edicao'
type AssessorView = 'lista' | 'cadastro' | 'edicao'
type AgendaView = 'lista' | 'cadastro' | 'edicao'

interface Municipe {
  id: number
  nome: string
  email: string
  whatsapp: string
  rua: string
  bairro: string
  nascimento: string
  sexo: string
}

interface Pedido {
  id: number
  municipeId: number
  titulo: string
  descricao: string
  categoria: string
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  status: 'pendente' | 'em_andamento' | 'resolvido' | 'cancelado'
  dataAbertura: string
  dataResposta?: string
  resposta?: string
  bairro: string
  rua: string
}

interface Bairro {
  id: number
  nome: string
  regiao: string
  populacao: number
  descricao: string
  dataCadastro: string
}

interface Assessor {
  id: number
  nome: string
  email: string
  cargo: string
  telefone: string
  avatar?: string
  tipo: 'vereador' | 'assessor'
  ativo: boolean
  dataCadastro: string
}

interface Tarefa {
  id: number
  titulo: string
  descricao: string
  tipo: 'administrativa' | 'atendimento' | 'evento' | 'projeto' | 'urgente'
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada'
  assessorId: number
  dataCriacao: string
  dataVencimento: string
  dataConclusao?: string
  concluida: boolean
}

interface PostagemTemplate {
  id: number
  titulo: string
  conteudo: string
  categoria: 'politica' | 'social' | 'evento' | 'aniversario'
  imagem?: string
  dataUltimaEdicao: string
}

interface DataComemorativa {
  id: number
  nome: string
  data: string
  tipo: 'natal' | 'pascoa' | 'ano-novo' | 'independencia' | 'trabalho'
  midia?: string
  tipoMidia: 'imagem' | 'video'
  geradoPorIA: boolean
}

interface MateriaLegislativa {
  id: number
  numero: string
  bairro: string
  tipoLegislativo: string
  tema: string
  dataProtocolo: string
  estadoTramitacao: 'protocolado' | 'em_tramitacao' | 'aprovado' | 'rejeitado' | 'arquivado'
  observacoes?: string
}

interface DocumentoAssinatura {
  id: number
  nome: string
  arquivo: File | null
  assinatura: string | null
  dataUpload: string
  dataAssinatura?: string
  status: 'pendente' | 'assinado'
  tipo: 'pdf' | 'doc' | 'docx'
}

interface Compromisso {
  id: number
  titulo: string
  descricao: string
  dataHora: string
  local: string
  assessorId: number
  tipo: 'reuniao' | 'evento' | 'audiencia' | 'visita' | 'outros'
  status: 'agendado' | 'confirmado' | 'realizado' | 'cancelado'
  dataCriacao: string
}

interface CampanhaMarketing {
  id: number
  titulo: string
  descricao: string
  tipo: 'post' | 'video' | 'imagem' | 'campanha'
  conteudo: string
  dataPublicacao: string
  status: 'rascunho' | 'agendado' | 'publicado'
  plataformas: string[]
  dataCriacao: string
}

interface AssinaturaDigital {
  id: number
  documento: string
  assinante: string
  dataAssinatura: string
  status: 'pendente' | 'assinado' | 'rejeitado'
  hash: string
}

// Componente principal do sistema
function SistemaGestaoParlamenta() {
  const { usuario } = useAuth()
  
  // Estados do sistema
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard')
  const [contatosView, setContatosView] = useState<ContatosView>('lista')
  const [pedidosView, setPedidosView] = useState<PedidosView>('lista')
  const [bairrosView, setBairrosView] = useState<BairrosView>('lista')
  const [marketingView, setMarketingView] = useState<MarketingView>('criador')
  const [materiaLegislativaView, setMateriaLegislativaView] = useState<MateriaLegislativaView>('lista')
  const [tarefasView, setTarefasView] = useState<TarefasView>('lista')
  const [assessorView, setAssessorView] = useState<AssessorView>('lista')
  const [agendaView, setAgendaView] = useState<AgendaView>('lista')
  const [municipeEditando, setMunicipeEditando] = useState<Municipe | null>(null)
  const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null)
  const [bairroEditando, setBairroEditando] = useState<Bairro | null>(null)
  const [materiaEditando, setMateriaEditando] = useState<MateriaLegislativa | null>(null)
  const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null)
  const [assessorEditando, setAssessorEditando] = useState<Assessor | null>(null)
  const [compromissoEditando, setCompromissoEditando] = useState<Compromisso | null>(null)
  const [pedidoDetalhes, setPedidoDetalhes] = useState<Pedido | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroMorador, setFiltroMorador] = useState('')
  const [filtroBairro, setFiltroBairro] = useState('')
  const [filtroRua, setFiltroRua] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')

  // Estados específicos para listagem de munícipes
  const [municipesView, setMunicipesView] = useState<MunicipesView>('lista')
  const [searchMunicipes, setSearchMunicipes] = useState('')

  // Estados do Marketing
  const [logoUrl, setLogoUrl] = useState('')
  const [novaPostagem, setNovaPostagem] = useState('')
  const [templateAniversarioMasc, setTemplateAniversarioMasc] = useState('')
  const [templateAniversarioFem, setTemplateAniversarioFem] = useState('')

  // Estados para Matéria Legislativa
  const [searchMateria, setSearchMateria] = useState('')
  const [filtroTipoLegislativo, setFiltroTipoLegislativo] = useState('')
  const [filtroEstadoTramitacao, setFiltroEstadoTramitacao] = useState('')
  const [filtroBairroMateria, setFiltroBairroMateria] = useState('')
  const [materiaVisualizando, setMateriaVisualizando] = useState<MateriaLegislativa | null>(null)

  // Estados para Assinatura Digital
  const [documentos, setDocumentos] = useState<DocumentoAssinatura[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [documentoSelecionado, setDocumentoSelecionado] = useState<DocumentoAssinatura | null>(null)

  // Estados para dados do Supabase
  const [municipes, setMunicipes] = useState<Municipe[]>([])
  const [bairros, setBairros] = useState<Bairro[]>([])
  const [materiasLegislativas, setMateriasLegislativas] = useState<MateriaLegislativa[]>([])
  const [loading, setLoading] = useState(true)

  // Lista de assessores
  const [assessores, setAssessores] = useState<Assessor[]>([
    {
      id: 1,
      nome: 'Carlos Silva',
      email: 'carlos@gabinete.com',
      cargo: 'Assessor Parlamentar',
      telefone: '(11) 99999-0001',
      tipo: 'assessor',
      ativo: true,
      dataCadastro: '2024-01-01'
    },
    {
      id: 2,
      nome: 'Ana Santos',
      email: 'ana@gabinete.com',
      cargo: 'Chefe de Gabinete',
      telefone: '(11) 99999-0002',
      tipo: 'assessor',
      ativo: true,
      dataCadastro: '2024-01-01'
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      email: 'pedro@gabinete.com',
      cargo: 'Assessor de Comunicação',
      telefone: '(11) 99999-0003',
      tipo: 'assessor',
      ativo: true,
      dataCadastro: '2024-01-01'
    },
    {
      id: 4,
      nome: 'Maria Oliveira',
      email: 'maria@gabinete.com',
      cargo: 'Assessor Jurídico',
      telefone: '(11) 99999-0004',
      tipo: 'assessor',
      ativo: true,
      dataCadastro: '2024-01-01'
    }
  ])

  // Lista de tarefas
  const [tarefas, setTarefas] = useState<Tarefa[]>([
    {
      id: 1,
      titulo: 'Responder pedidos de infraestrutura',
      descricao: 'Analisar e responder os pedidos relacionados a buracos e pavimentação',
      tipo: 'atendimento',
      prioridade: 'alta',
      status: 'em_andamento',
      assessorId: 1,
      dataCriacao: '2024-01-15',
      dataVencimento: '2024-01-20',
      concluida: false
    },
    {
      id: 2,
      titulo: 'Organizar evento no bairro Centro',
      descricao: 'Preparar reunião com moradores do Centro para discutir melhorias',
      tipo: 'evento',
      prioridade: 'media',
      status: 'pendente',
      assessorId: 2,
      dataCriacao: '2024-01-14',
      dataVencimento: '2024-01-25',
      concluida: false
    },
    {
      id: 3,
      titulo: 'Elaborar projeto de lei sobre iluminação',
      descricao: 'Redigir projeto de lei para melhorar a iluminação pública',
      tipo: 'projeto',
      prioridade: 'alta',
      status: 'concluida',
      assessorId: 3,
      dataCriacao: '2024-01-10',
      dataVencimento: '2024-01-18',
      dataConclusao: '2024-01-17',
      concluida: true
    },
    {
      id: 4,
      titulo: 'Atualizar documentos administrativos',
      descricao: 'Revisar e atualizar documentos do gabinete',
      tipo: 'administrativa',
      prioridade: 'baixa',
      status: 'pendente',
      assessorId: 4,
      dataCriacao: '2024-01-12',
      dataVencimento: '2024-01-30',
      concluida: false
    },
    {
      id: 5,
      titulo: 'Urgente: Resposta sobre segurança pública',
      descricao: 'Responder imediatamente sobre questões de segurança na Vila Nova',
      tipo: 'urgente',
      prioridade: 'urgente',
      status: 'em_andamento',
      assessorId: 1,
      dataCriacao: '2024-01-16',
      dataVencimento: '2024-01-17',
      concluida: false
    }
  ])

  // Lista de compromissos da agenda
  const [compromissos, setCompromissos] = useState<Compromisso[]>([
    {
      id: 1,
      titulo: 'Reunião com moradores do Centro',
      descricao: 'Discussão sobre melhorias na infraestrutura do bairro',
      dataHora: '2024-01-25T14:00',
      local: 'Salão Comunitário do Centro',
      assessorId: 1,
      tipo: 'reuniao',
      status: 'agendado',
      dataCriacao: '2024-01-15'
    },
    {
      id: 2,
      titulo: 'Audiência Pública - Orçamento 2024',
      descricao: 'Apresentação e discussão do orçamento municipal',
      dataHora: '2024-01-30T19:00',
      local: 'Câmara Municipal',
      assessorId: 2,
      tipo: 'audiencia',
      status: 'confirmado',
      dataCriacao: '2024-01-10'
    },
    {
      id: 3,
      titulo: 'Visita técnica - Vila Nova',
      descricao: 'Vistoria das obras de pavimentação',
      dataHora: '2024-01-22T09:00',
      local: 'Rua Principal - Vila Nova',
      assessorId: 3,
      tipo: 'visita',
      status: 'agendado',
      dataCriacao: '2024-01-12'
    }
  ])

  // Lista de campanhas de marketing
  const [campanhasMarketing, setCampanhasMarketing] = useState<CampanhaMarketing[]>([
    {
      id: 1,
      titulo: 'Campanha Obras Concluídas',
      descricao: 'Divulgação das obras finalizadas no primeiro trimestre',
      tipo: 'campanha',
      conteudo: 'Mais obras entregues para nossa cidade! Confira as melhorias realizadas.',
      dataPublicacao: '2024-01-20',
      status: 'publicado',
      plataformas: ['Facebook', 'Instagram', 'WhatsApp'],
      dataCriacao: '2024-01-15'
    },
    {
      id: 2,
      titulo: 'Post Aniversário da Cidade',
      descricao: 'Homenagem ao aniversário da cidade',
      tipo: 'post',
      conteudo: 'Parabéns nossa querida cidade! Juntos construímos um futuro melhor.',
      dataPublicacao: '2024-02-01',
      status: 'agendado',
      plataformas: ['Facebook', 'Instagram'],
      dataCriacao: '2024-01-18'
    }
  ])

  // Lista de assinaturas digitais
  const [assinaturasDigitais, setAssinaturasDigitais] = useState<AssinaturaDigital[]>([
    {
      id: 1,
      documento: 'Projeto de Lei 001/2024',
      assinante: 'Vereador João Silva',
      dataAssinatura: '2024-01-15',
      status: 'assinado',
      hash: 'abc123def456'
    },
    {
      id: 2,
      documento: 'Requerimento 005/2024',
      assinante: 'Vereador João Silva',
      dataAssinatura: '',
      status: 'pendente',
      hash: ''
    }
  ])

  const [novaTarefa, setNovaTarefa] = useState('')

  // Lista de pedidos
  const [pedidos, setPedidos] = useState<Pedido[]>([
    {
      id: 1,
      municipeId: 1,
      titulo: 'Buraco na Rua das Palmeiras',
      descricao: 'Existe um buraco grande na frente do número 456 que está causando problemas para os carros e pedestres.',
      categoria: 'Infraestrutura',
      prioridade: 'alta',
      status: 'pendente',
      dataAbertura: '2024-01-15',
      bairro: 'Centro',
      rua: 'Rua das Palmeiras'
    },
    {
      id: 2,
      municipeId: 2,
      titulo: 'Falta de Iluminação Pública',
      descricao: 'A Av. Brasil está sem iluminação há mais de uma semana, causando insegurança.',
      categoria: 'Segurança',
      prioridade: 'urgente',
      status: 'em_andamento',
      dataAbertura: '2024-01-10',
      dataResposta: '2024-01-12',
      resposta: 'Pedido encaminhado para a Secretaria de Obras. Previsão de reparo em 5 dias úteis.',
      bairro: 'Vila Nova',
      rua: 'Av. Brasil'
    },
    {
      id: 3,
      municipeId: 3,
      titulo: 'Coleta de Lixo Irregular',
      descricao: 'A coleta de lixo não está passando regularmente na Rua das Flores.',
      categoria: 'Limpeza',
      prioridade: 'media',
      status: 'resolvido',
      dataAbertura: '2024-01-05',
      dataResposta: '2024-01-08',
      resposta: 'Problema resolvido. Rota de coleta foi ajustada e normalizada.',
      bairro: 'Jardim América',
      rua: 'Rua das Flores'
    },
    {
      id: 4,
      municipeId: 1,
      titulo: 'Solicitação de Lombada',
      descricao: 'Pedido para instalação de lombada na Rua das Palmeiras para reduzir velocidade dos veículos.',
      categoria: 'Trânsito',
      prioridade: 'baixa',
      status: 'pendente',
      dataAbertura: '2023-12-20',
      bairro: 'Centro',
      rua: 'Rua das Palmeiras'
    }
  ])

  // Templates de postagens
  const [templates, setTemplates] = useState<PostagemTemplate[]>([
    {
      id: 1,
      titulo: 'Reunião com Moradores',
      conteudo: 'Hoje estivemos reunidos com os moradores do bairro [BAIRRO] para discutir as melhorias necessárias na região. Juntos, vamos construir uma cidade melhor! 🏘️',
      categoria: 'politica',
      dataUltimaEdicao: '2024-01-15'
    },
    {
      id: 2,
      titulo: 'Obra Concluída',
      conteudo: 'Mais uma obra entregue para nossa cidade! A [OBRA] foi finalizada e já está beneficiando toda a comunidade. Continuamos trabalhando por você! 🚧✅',
      categoria: 'politica',
      dataUltimaEdicao: '2024-01-14'
    },
    {
      id: 3,
      titulo: 'Feliz Aniversário',
      conteudo: 'Parabéns, [NOME]! Que este novo ano de vida seja repleto de alegrias, saúde e realizações. Conte sempre conosco! 🎂🎉',
      categoria: 'aniversario',
      dataUltimaEdicao: '2024-01-13'
    }
  ])

  // Datas comemorativas
  const [datasComemorativos, setDatasComemorativos] = useState<DataComemorativa[]>([
    {
      id: 1,
      nome: 'Natal',
      data: '2024-12-25',
      tipo: 'natal',
      tipoMidia: 'imagem',
      geradoPorIA: false
    },
    {
      id: 2,
      nome: 'Páscoa',
      data: '2024-03-31',
      tipo: 'pascoa',
      tipoMidia: 'video',
      geradoPorIA: false
    },
    {
      id: 3,
      nome: 'Ano Novo',
      data: '2024-01-01',
      tipo: 'ano-novo',
      tipoMidia: 'imagem',
      geradoPorIA: true
    },
    {
      id: 4,
      nome: 'Independência do Brasil',
      data: '2024-09-07',
      tipo: 'independencia',
      tipoMidia: 'video',
      geradoPorIA: false
    },
    {
      id: 5,
      nome: 'Dia do Trabalhador',
      data: '2024-05-01',
      tipo: 'trabalho',
      tipoMidia: 'imagem',
      geradoPorIA: true
    }
  ])

  // Carregar dados do Supabase
  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
      
      // Carregar bairros
      const { data: bairrosData, error: bairrosError } = await supabase
        .from('bairros')
        .select('*')
        .order('nome')

      if (bairrosError) {
        console.error('Erro ao carregar bairros:', bairrosError)
      } else {
        const bairrosFormatados = bairrosData.map(b => ({
          id: b.id,
          nome: b.nome,
          regiao: b.regiao,
          populacao: b.populacao,
          descricao: b.descricao || '',
          dataCadastro: b.data_cadastro || b.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
        }))
        setBairros(bairrosFormatados)
      }

      // Carregar munícipes
      const { data: municipesData, error: municipesError } = await supabase
        .from('municipes')
        .select('*')
        .order('nome')

      if (municipesError) {
        console.error('Erro ao carregar munícipes:', municipesError)
      } else {
        const municipesFormatados = municipesData.map(m => ({
          id: m.id,
          nome: m.nome,
          email: m.email,
          whatsapp: m.whatsapp,
          rua: m.rua,
          bairro: m.bairro,
          nascimento: m.nascimento,
          sexo: m.sexo
        }))
        setMunicipes(municipesFormatados)
      }

      // Carregar matérias legislativas
      const { data: materiasData, error: materiasError } = await supabase
        .from('materias_legislativas')
        .select('*')
        .order('data_protocolo', { ascending: false })

      if (materiasError) {
        console.error('Erro ao carregar matérias legislativas:', materiasError)
        // Se a tabela não existir, usar dados de exemplo
        setMateriasLegislativas([
          {
            id: 1,
            numero: 'PL-001/2024',
            bairro: 'Centro',
            tipoLegislativo: 'Projeto de Lei Ordinária',
            tema: 'Criação de área de lazer na Praça Central',
            dataProtocolo: '2024-01-15',
            estadoTramitacao: 'em_tramitacao',
            observacoes: 'Aguardando parecer da Comissão de Obras'
          },
          {
            id: 2,
            numero: 'IND-002/2024',
            bairro: 'Vila Nova',
            tipoLegislativo: 'Indicação',
            tema: 'Melhoria na iluminação pública da Av. Brasil',
            dataProtocolo: '2024-01-10',
            estadoTramitacao: 'aprovado',
            observacoes: 'Encaminhado para execução pela Prefeitura'
          },
          {
            id: 3,
            numero: 'REQ-003/2024',
            bairro: 'Jardim América',
            tipoLegislativo: 'Requerimento',
            tema: 'Informações sobre coleta seletiva',
            dataProtocolo: '2024-01-08',
            estadoTramitacao: 'protocolado',
            observacoes: 'Aguardando resposta do Executivo'
          },
          {
            id: 4,
            numero: 'EME-004/2024',
            bairro: 'São José',
            tipoLegislativo: 'Emenda',
            tema: 'Alteração no projeto de pavimentação',
            dataProtocolo: '2024-01-05',
            estadoTramitacao: 'rejeitado',
            observacoes: 'Rejeitada por questões técnicas'
          },
          {
            id: 5,
            numero: 'PDL-005/2024',
            bairro: 'Santa Maria',
            tipoLegislativo: 'Projeto de Decreto Legislativo',
            tema: 'Homenagem aos profissionais da saúde',
            dataProtocolo: '2024-01-03',
            estadoTramitacao: 'aprovado',
            observacoes: 'Aprovado por unanimidade'
          }
        ])
      } else {
        const materiasFormatadas = materiasData.map(m => ({
          id: m.id,
          numero: m.numero,
          bairro: m.bairro,
          tipoLegislativo: m.tipo_legislativo,
          tema: m.tema,
          dataProtocolo: m.data_protocolo,
          estadoTramitacao: m.estado_tramitacao,
          observacoes: m.observacoes || ''
        }))
        setMateriasLegislativas(materiasFormatadas)
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  // Verificar se usuário é assessor (sem acesso a relatórios)
  const isAssessor = usuario?.tipo === 'assessor'

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'contatos', label: 'Contatos', icon: Users },
    { id: 'pedidos', label: 'Pedidos', icon: Phone },
    { id: 'bairros', label: 'Bairros', icon: MapPin },
    { id: 'materia-legislativa', label: 'Matéria Legislativa', icon: Scale },
    { id: 'tarefas', label: 'Tarefas', icon: CheckSquare },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'agenda', label: 'Agenda', icon: CalendarDays },
    { id: 'cadastro-assessor', label: 'Assessores', icon: UserCog },
    { id: 'alertas', label: 'Alertas', icon: Bell },
    { id: 'assinatura', label: 'Assinatura', icon: PenTool },
    // Relatórios só para vereadores
    ...(isAssessor ? [] : [{ id: 'relatorios', label: 'Relatórios', icon: BarChart }]),
  ]

  const bairrosNomes = bairros.map(b => b.nome)

  const categoriasPedido = [
    'Infraestrutura', 'Segurança', 'Limpeza', 'Trânsito', 'Saúde', 
    'Educação', 'Meio Ambiente', 'Assistência Social', 'Outros'
  ]

  const regioes = ['Central', 'Norte', 'Sul', 'Leste', 'Oeste']

  const tiposLegislativos = [
    'Emenda',
    'Indicação',
    'Projeto de Decreto Legislativo',
    'Projeto de Lei Ordinária',
    'Projeto de Resolução',
    'Recurso',
    'Requerimento',
    'Denúncia',
    'Voto de pesar',
    'Ofício',
    'Projeto de Lei',
    'Moção',
    'Resposta à diligência',
    'Requerimento diverso',
    'Emenda Parlamentar',
    'Emenda Impositiva'
  ]

  const estadosTramitacao = [
    { id: 'protocolado', label: 'Protocolado', color: 'bg-blue-100 text-blue-800' },
    { id: 'em_tramitacao', label: 'Em Tramitação', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'aprovado', label: 'Aprovado', color: 'bg-green-100 text-green-800' },
    { id: 'rejeitado', label: 'Rejeitado', color: 'bg-red-100 text-red-800' },
    { id: 'arquivado', label: 'Arquivado', color: 'bg-gray-100 text-gray-800' }
  ]

  const tiposTarefa = [
    { id: 'administrativa', label: 'Administrativa', color: 'bg-blue-100 text-blue-800' },
    { id: 'atendimento', label: 'Atendimento', color: 'bg-green-100 text-green-800' },
    { id: 'evento', label: 'Evento', color: 'bg-purple-100 text-purple-800' },
    { id: 'projeto', label: 'Projeto', color: 'bg-orange-100 text-orange-800' },
    { id: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-800' }
  ]

  const statusTarefa = [
    { id: 'pendente', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'em_andamento', label: 'Em Andamento', color: 'bg-blue-100 text-blue-800' },
    { id: 'concluida', label: 'Concluída', color: 'bg-green-100 text-green-800' },
    { id: 'cancelada', label: 'Cancelada', color: 'bg-red-100 text-red-800' }
  ]

  const prioridades = [
    { id: 'baixa', label: 'Baixa', color: 'bg-gray-100 text-gray-800' },
    { id: 'media', label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { id: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-800' }
  ]

  // Função para adicionar nova tarefa
  const adicionarTarefa = () => {
    if (novaTarefa.trim()) {
      const novaTarefaObj: Tarefa = {
        id: Math.max(...tarefas.map(t => t.id)) + 1,
        titulo: novaTarefa,
        descricao: 'Tarefa criada rapidamente',
        tipo: 'administrativa',
        prioridade: 'media',
        status: 'pendente',
        assessorId: assessores[0].id,
        dataCriacao: new Date().toISOString().split('T')[0],
        dataVencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        concluida: false
      }
      setTarefas([...tarefas, novaTarefaObj])
      setNovaTarefa('')
    }
  }

  // Função para marcar tarefa como concluída
  const toggleTarefa = (id: number) => {
    setTarefas(tarefas.map(tarefa => 
      tarefa.id === id 
        ? { 
            ...tarefa, 
            concluida: !tarefa.concluida,
            status: !tarefa.concluida ? 'concluida' : 'pendente',
            dataConclusao: !tarefa.concluida ? new Date().toISOString().split('T')[0] : undefined
          }
        : tarefa
    ))
  }

  // Função para calcular dias sem resposta
  const calcularDiasSemResposta = (dataAbertura: string, status: string) => {
    if (status !== 'pendente') return 0
    const hoje = new Date()
    const abertura = new Date(dataAbertura)
    const diffTime = Math.abs(hoje.getTime() - abertura.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Pedidos mais antigos sem resposta
  const pedidosAntigos = pedidos
    .filter(p => p.status === 'pendente')
    .map(p => ({ ...p, diasSemResposta: calcularDiasSemResposta(p.dataAbertura, p.status) }))
    .sort((a, b) => b.diasSemResposta - a.diasSemResposta)
    .slice(0, 5)

  // Tarefas atrasadas (para alertas)
  const tarefasAtrasadas = tarefas.filter(t => {
    if (t.status === 'concluida' || t.status === 'cancelada') return false
    const hoje = new Date()
    const vencimento = new Date(t.dataVencimento)
    return vencimento < hoje
  })

  // Funções para salvar no Supabase
  const salvarBairroSupabase = async (bairro: Omit<Bairro, 'id' | 'dataCadastro'>) => {
    try {
      const { data, error } = await supabase
        .from('bairros')
        .insert([{
          nome: bairro.nome,
          regiao: bairro.regiao,
          populacao: bairro.populacao,
          descricao: bairro.descricao,
          data_cadastro: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao salvar bairro:', error)
        alert('Erro ao salvar bairro: ' + error.message)
        return null
      }

      return {
        id: data.id,
        nome: data.nome,
        regiao: data.regiao,
        populacao: data.populacao,
        descricao: data.descricao || '',
        dataCadastro: data.data_cadastro || data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
      }
    } catch (error) {
      console.error('Erro ao salvar bairro:', error)
      alert('Erro ao salvar bairro')
      return null
    }
  }

  const salvarMunicipeSupabase = async (municipe: Omit<Municipe, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('municipes')
        .insert([{
          nome: municipe.nome,
          email: municipe.email,
          whatsapp: municipe.whatsapp,
          rua: municipe.rua,
          bairro: municipe.bairro,
          nascimento: municipe.nascimento,
          sexo: municipe.sexo
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao salvar munícipe:', error)
        alert('Erro ao salvar munícipe: ' + error.message)
        return null
      }

      return {
        id: data.id,
        nome: data.nome,
        email: data.email,
        whatsapp: data.whatsapp,
        rua: data.rua,
        bairro: data.bairro,
        nascimento: data.nascimento,
        sexo: data.sexo
      }
    } catch (error) {
      console.error('Erro ao salvar munícipe:', error)
      alert('Erro ao salvar munícipe')
      return null
    }
  }

  const atualizarMunicipeSupabase = async (id: number, municipe: Omit<Municipe, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('municipes')
        .update({
          nome: municipe.nome,
          email: municipe.email,
          whatsapp: municipe.whatsapp,
          rua: municipe.rua,
          bairro: municipe.bairro,
          nascimento: municipe.nascimento,
          sexo: municipe.sexo
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar munícipe:', error)
        alert('Erro ao atualizar munícipe: ' + error.message)
        return null
      }

      return {
        id: data.id,
        nome: data.nome,
        email: data.email,
        whatsapp: data.whatsapp,
        rua: data.rua,
        bairro: data.bairro,
        nascimento: data.nascimento,
        sexo: data.sexo
      }
    } catch (error) {
      console.error('Erro ao atualizar munícipe:', error)
      alert('Erro ao atualizar munícipe')
      return null
    }
  }

  const deletarMunicipeSupabase = async (id: number) => {
    try {
      const { error } = await supabase
        .from('municipes')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar munícipe:', error)
        alert('Erro ao deletar munícipe: ' + error.message)
        return false
      }

      return true
    } catch (error) {
      console.error('Erro ao deletar munícipe:', error)
      alert('Erro ao deletar munícipe')
      return false
    }
  }

  const salvarMateriaLegislativaSupabase = async (materia: Omit<MateriaLegislativa, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('materias_legislativas')
        .insert([{
          numero: materia.numero,
          bairro: materia.bairro,
          tipo_legislativo: materia.tipoLegislativo,
          tema: materia.tema,
          data_protocolo: materia.dataProtocolo,
          estado_tramitacao: materia.estadoTramitacao,
          observacoes: materia.observacoes
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao salvar matéria legislativa:', error)
        if (error.code === '42P01') {
          const novaMateria = {
            id: Math.max(...materiasLegislativas.map(m => m.id)) + 1,
            ...materia
          }
          setMateriasLegislativas([...materiasLegislativas, novaMateria])
          return novaMateria
        }
        alert('Erro ao salvar matéria legislativa: ' + error.message)
        return null
      }

      return {
        id: data.id,
        numero: data.numero,
        bairro: data.bairro,
        tipoLegislativo: data.tipo_legislativo,
        tema: data.tema,
        dataProtocolo: data.data_protocolo,
        estadoTramitacao: data.estado_tramitacao,
        observacoes: data.observacoes || ''
      }
    } catch (error) {
      console.error('Erro ao salvar matéria legislativa:', error)
      const novaMateria = {
        id: Math.max(...materiasLegislativas.map(m => m.id)) + 1,
        ...materia
      }
      setMateriasLegislativas([...materiasLegislativas, novaMateria])
      return novaMateria
    }
  }

  // Funções para ações das matérias legislativas
  const visualizarMateria = (materia: MateriaLegislativa) => {
    setMateriaVisualizando(materia)
  }

  const editarMateria = (materia: MateriaLegislativa) => {
    setMateriaEditando(materia)
    setMateriaLegislativaView('edicao')
  }

  const deletarMateria = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta matéria legislativa?')) {
      try {
        const { error } = await supabase
          .from('materias_legislativas')
          .delete()
          .eq('id', id)

        if (error && error.code !== '42P01') {
          console.error('Erro ao deletar matéria:', error)
          alert('Erro ao deletar matéria: ' + error.message)
          return
        }

        setMateriasLegislativas(materiasLegislativas.filter(m => m.id !== id))
        alert('Matéria legislativa excluída com sucesso!')
      } catch (error) {
        console.error('Erro ao deletar matéria:', error)
        setMateriasLegislativas(materiasLegislativas.filter(m => m.id !== id))
        alert('Matéria legislativa excluída com sucesso!')
      }
    }
  }

  // Dashboard Component
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard - Visão Geral do Mandato</h1>
          <p className="text-gray-600 mt-1">Bem-vindo, {usuario?.nome}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button 
            onClick={() => setActiveScreen('cadastro-assessor')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Cadastrar Assessor
          </button>
          <button 
            onClick={() => setActiveScreen('listagem-municipes')}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <List className="w-4 h-4" />
            Listar Munícipes
          </button>
        </div>
      </div>

      {/* Termômetro de Pedidos Antigos */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 lg:p-6 rounded-xl border border-red-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg lg:text-xl font-bold text-red-800 flex items-center gap-2">
            <Thermometer className="w-5 h-5 lg:w-6 lg:h-6" />
            Termômetro - Pedidos Mais Antigos Sem Resposta
          </h2>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            {pedidosAntigos.length} pendentes
          </span>
        </div>
        
        <div className="space-y-3">
          {pedidosAntigos.map((pedido) => {
            const municipe = municipes.find(m => m.id === pedido.municipeId)
            const intensidade = pedido.diasSemResposta > 30 ? 'bg-red-500' : 
                              pedido.diasSemResposta > 15 ? 'bg-orange-500' : 'bg-yellow-500'
            
            return (
              <div key={pedido.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg border border-red-100 gap-3">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <div className={`w-3 h-3 rounded-full ${intensidade} flex-shrink-0`}></div>
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{pedido.titulo}</h3>
                    <span className="text-xs lg:text-sm text-gray-600 hidden sm:inline">- {municipe?.nome}</span>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-600 sm:hidden">{municipe?.nome}</p>
                  <p className="text-xs lg:text-sm text-gray-600">{pedido.bairro} • {pedido.categoria}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-lg font-bold text-red-600">{pedido.diasSemResposta}</span>
                  <p className="text-xs text-gray-500">dias</p>
                </div>
              </div>
            )
          })}
          
          {pedidosAntigos.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 font-medium">Todos os pedidos estão em dia!</p>
            </div>
          )}
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Total de Pedidos</p>
              <p className="text-2xl lg:text-3xl font-bold text-emerald-600">{pedidos.length}</p>
            </div>
            <Phone className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Pedidos Pendentes</p>
              <p className="text-2xl lg:text-3xl font-bold text-red-600">{pedidos.filter(p => p.status === 'pendente').length}</p>
            </div>
            <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Pedidos Resolvidos</p>
              <p className="text-2xl lg:text-3xl font-bold text-green-600">{pedidos.filter(p => p.status === 'resolvido').length}</p>
            </div>
            <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Matérias Legislativas</p>
              <p className="text-2xl lg:text-3xl font-bold text-indigo-600">{materiasLegislativas.length}</p>
            </div>
            <Scale className="w-6 h-6 lg:w-8 lg:h-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Gráfico de Atividades */}
      <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Status dos Pedidos por Categoria
        </h2>
        
        <div className="space-y-4">
          {categoriasPedido.slice(0, 4).map(categoria => {
            const pedidosCategoria = pedidos.filter(p => p.categoria === categoria)
            const porcentagem = pedidosCategoria.length > 0 ? (pedidosCategoria.length / pedidos.length) * 100 : 0
            
            return (
              <div key={categoria} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-emerald-500 rounded flex-shrink-0"></div>
                  <span className="font-medium text-sm lg:text-base">{categoria}</span>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-full sm:w-64 bg-gray-200 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full" style={{width: `${porcentagem}%`}}></div>
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-gray-600 whitespace-nowrap">{pedidosCategoria.length} pedidos</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  // Componente de Listagem de Munícipes
  const ListagemMunicipesScreen = () => {
    const municipesFiltrados = municipes.filter(m => 
      m.nome.toLowerCase().includes(searchMunicipes.toLowerCase()) ||
      m.email.toLowerCase().includes(searchMunicipes.toLowerCase()) ||
      m.bairro.toLowerCase().includes(searchMunicipes.toLowerCase())
    )

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <List className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
            Listagem de Munícipes
          </h1>
          <button
            onClick={() => setActiveScreen('dashboard')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Voltar ao Dashboard
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisar por nome, email ou bairro..."
              value={searchMunicipes}
              onChange={(e) => setSearchMunicipes(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Lista de Munícipes */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">
              Munícipes Cadastrados ({municipesFiltrados.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bairro</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {municipesFiltrados.map((municipe) => (
                  <tr key={municipe.id} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
                        </div>
                        <div className="ml-3 lg:ml-4">
                          <div className="text-sm font-medium text-gray-900">{municipe.nome}</div>
                          <div className="text-xs text-gray-500 sm:hidden">{municipe.email}</div>
                          <div className="text-xs text-gray-500">{municipe.sexo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 hidden sm:table-cell">{municipe.email}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">{municipe.whatsapp}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">{municipe.bairro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {municipesFiltrados.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum munícipe encontrado</h3>
              <p className="text-gray-600">
                {searchMunicipes ? 'Tente ajustar o termo de pesquisa' : 'Nenhum munícipe cadastrado ainda'}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Componente de Tarefas
  const TarefasScreen = () => {
    const [formData, setFormData] = useState({
      titulo: '',
      descricao: '',
      tipo: 'administrativa' as const,
      prioridade: 'media' as const,
      assessorId: assessores[0]?.id || 1,
      dataVencimento: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      
      const novaTarefaObj: Tarefa = {
        id: Math.max(...tarefas.map(t => t.id)) + 1,
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo: formData.tipo,
        prioridade: formData.prioridade,
        status: 'pendente',
        assessorId: formData.assessorId,
        dataCriacao: new Date().toISOString().split('T')[0],
        dataVencimento: formData.dataVencimento,
        concluida: false
      }
      
      setTarefas([...tarefas, novaTarefaObj])
      setFormData({
        titulo: '',
        descricao: '',
        tipo: 'administrativa',
        prioridade: 'media',
        assessorId: assessores[0]?.id || 1,
        dataVencimento: ''
      })
      alert('Tarefa cadastrada com sucesso!')
      setTarefasView('lista')
    }

    const handleEdit = (tarefa: Tarefa) => {
      setTarefaEditando(tarefa)
      setTarefasView('edicao')
    }

    const handleDelete = (id: number) => {
      if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        setTarefas(tarefas.filter(t => t.id !== id))
        alert('Tarefa excluída com sucesso!')
      }
    }

    const handleUpdateStatus = (id: number, novoStatus: Tarefa['status']) => {
      setTarefas(tarefas.map(t => 
        t.id === id 
          ? { 
              ...t, 
              status: novoStatus,
              concluida: novoStatus === 'concluida',
              dataConclusao: novoStatus === 'concluida' ? new Date().toISOString().split('T')[0] : undefined
            }
          : t
      ))
    }

    if (tarefasView === 'cadastro') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <CheckSquare className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
              Cadastrar Nova Tarefa
            </h1>
            <button
              onClick={() => setTarefasView('lista')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Voltar
            </button>
          </div>

          <div className="bg-white p-4 lg:p-8 rounded-xl shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título da Tarefa</label>
                  <input
                    type="text"
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Digite o título da tarefa"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    required
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Descreva a tarefa detalhadamente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    required
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {tiposTarefa.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>{tipo.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                  <select
                    required
                    value={formData.prioridade}
                    onChange={(e) => setFormData({...formData, prioridade: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {prioridades.map(prioridade => (
                      <option key={prioridade.id} value={prioridade.id}>{prioridade.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                  <select
                    required
                    value={formData.assessorId}
                    onChange={(e) => setFormData({...formData, assessorId: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {assessores.filter(a => a.ativo).map(assessor => (
                      <option key={assessor.id} value={assessor.id}>{assessor.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Vencimento</label>
                  <input
                    type="date"
                    required
                    value={formData.dataVencimento}
                    onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar Tarefa
                </button>
                <button
                  type="button"
                  onClick={() => setTarefasView('lista')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CheckSquare className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
            Gestão de Tarefas
          </h1>
          <button
            onClick={() => setTarefasView('cadastro')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </button>
        </div>

        {/* Estatísticas das Tarefas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statusTarefa.map(status => {
            const count = tarefas.filter(t => t.status === status.id).length
            return (
              <div key={status.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                <div className="text-center">
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{count}</p>
                  <p className={`text-xs font-medium px-2 py-1 rounded-full ${status.color} mt-1`}>
                    {status.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Lista de Tarefas */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">
              Lista de Tarefas ({tarefas.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {tarefas.map((tarefa) => {
              const assessor = assessores.find(a => a.id === tarefa.assessorId)
              const tipoInfo = tiposTarefa.find(t => t.id === tarefa.tipo)
              const statusInfo = statusTarefa.find(s => s.id === tarefa.status)
              const prioridadeInfo = prioridades.find(p => p.id === tarefa.prioridade)
              const isAtrasada = new Date(tarefa.dataVencimento) < new Date() && tarefa.status !== 'concluida'
              
              return (
                <div key={tarefa.id} className="p-4 lg:p-6 hover:bg-gray-50">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex-1 w-full lg:w-auto">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{tarefa.titulo}</h3>
                        <div className="flex gap-2 flex-wrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${tipoInfo?.color}`}>
                            {tipoInfo?.label}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${prioridadeInfo?.color}`}>
                            {prioridadeInfo?.label}
                          </span>
                          {isAtrasada && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Atrasada
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{tarefa.descricao}</p>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs text-gray-500">
                        <span>Responsável: {assessor?.nome}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Vencimento: {new Date(tarefa.dataVencimento).toLocaleDateString()}</span>
                        {tarefa.dataConclusao && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span>Concluída: {new Date(tarefa.dataConclusao).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusInfo?.color}`}>
                        {statusInfo?.label}
                      </span>
                      
                      <div className="flex gap-2">
                        {tarefa.status !== 'concluida' && (
                          <button
                            onClick={() => handleUpdateStatus(tarefa.id, 'concluida')}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Marcar como concluída"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(tarefa)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tarefa.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {tarefas.length === 0 && (
            <div className="text-center py-12">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa cadastrada</h3>
              <p className="text-gray-600 mb-4">Comece criando sua primeira tarefa</p>
              <button
                onClick={() => setTarefasView('cadastro')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Criar Primeira Tarefa
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Componente de Cadastro de Assessores
  const CadastroAssessorScreen = () => {
    const [formData, setFormData] = useState({
      nome: '',
      email: '',
      cargo: '',
      telefone: '',
      tipo: 'assessor' as const
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      
      const novoAssessor: Assessor = {
        id: Math.max(...assessores.map(a => a.id)) + 1,
        nome: formData.nome,
        email: formData.email,
        cargo: formData.cargo,
        telefone: formData.telefone,
        tipo: formData.tipo,
        ativo: true,
        dataCadastro: new Date().toISOString().split('T')[0]
      }
      
      setAssessores([...assessores, novoAssessor])
      setFormData({
        nome: '',
        email: '',
        cargo: '',
        telefone: '',
        tipo: 'assessor'
      })
      alert('Assessor cadastrado com sucesso!')
      setAssessorView('lista')
    }

    const handleEdit = (assessor: Assessor) => {
      setAssessorEditando(assessor)
      setAssessorView('edicao')
    }

    const handleDelete = (id: number) => {
      if (confirm('Tem certeza que deseja excluir este assessor?')) {
        setAssessores(assessores.filter(a => a.id !== id))
        alert('Assessor excluído com sucesso!')
      }
    }

    const toggleStatus = (id: number) => {
      setAssessores(assessores.map(a => 
        a.id === id ? { ...a, ativo: !a.ativo } : a
      ))
    }

    if (assessorView === 'cadastro') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <UserCog className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
              Cadastrar Novo Assessor
            </h1>
            <button
              onClick={() => setAssessorView('lista')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Voltar
            </button>
          </div>

          <div className="bg-white p-4 lg:p-8 rounded-xl shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Digite o nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
                  <input
                    type="text"
                    required
                    value={formData.cargo}
                    onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Ex: Assessor Parlamentar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <input
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    required
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="assessor">Assessor</option>
                    <option value="vereador">Vereador</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar Assessor
                </button>
                <button
                  type="button"
                  onClick={() => setAssessorView('lista')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <UserCog className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
            Gestão de Assessores
          </h1>
          <button
            onClick={() => setAssessorView('cadastro')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Assessor
          </button>
        </div>

        {/* Lista de Assessores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assessores.map((assessor) => (
            <div key={assessor.id} className="bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <UserCog className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{assessor.nome}</h3>
                    <p className="text-sm text-gray-600">{assessor.cargo}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStatus(assessor.id)}
                    className={`p-1 rounded ${assessor.ativo ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`}
                    title={assessor.ativo ? 'Desativar' : 'Ativar'}
                  >
                    {assessor.ativo ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(assessor)}
                    className="text-indigo-600 hover:text-indigo-900 p-1"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(assessor.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <strong>Email:</strong> {assessor.email}
                </p>
                <p className="text-gray-600">
                  <strong>Telefone:</strong> {assessor.telefone}
                </p>
                <p className="text-gray-600">
                  <strong>Tipo:</strong> {assessor.tipo === 'vereador' ? 'Vereador' : 'Assessor'}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    assessor.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {assessor.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Cadastrado em {new Date(assessor.dataCadastro).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {assessores.length === 0 && (
          <div className="text-center py-12">
            <UserCog className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum assessor cadastrado</h3>
            <p className="text-gray-600 mb-4">Comece cadastrando seu primeiro assessor</p>
            <button
              onClick={() => setAssessorView('cadastro')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cadastrar Primeiro Assessor
            </button>
          </div>
        )}
      </div>
    )
  }

  // Componente de Agenda
  const AgendaScreen = () => {
    const [formData, setFormData] = useState({
      titulo: '',
      descricao: '',
      dataHora: '',
      local: '',
      assessorId: assessores[0]?.id || 1,
      tipo: 'reuniao' as const
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      
      const novoCompromisso: Compromisso = {
        id: Math.max(...compromissos.map(c => c.id)) + 1,
        titulo: formData.titulo,
        descricao: formData.descricao,
        dataHora: formData.dataHora,
        local: formData.local,
        assessorId: formData.assessorId,
        tipo: formData.tipo,
        status: 'agendado',
        dataCriacao: new Date().toISOString().split('T')[0]
      }
      
      setCompromissos([...compromissos, novoCompromisso])
      setFormData({
        titulo: '',
        descricao: '',
        dataHora: '',
        local: '',
        assessorId: assessores[0]?.id || 1,
        tipo: 'reuniao'
      })
      alert('Compromisso agendado com sucesso!')
      setAgendaView('lista')
    }

    const handleDelete = (id: number) => {
      if (confirm('Tem certeza que deseja excluir este compromisso?')) {
        setCompromissos(compromissos.filter(c => c.id !== id))
        alert('Compromisso excluído com sucesso!')
      }
    }

    const handleUpdateStatus = (id: number, novoStatus: Compromisso['status']) => {
      setCompromissos(compromissos.map(c => 
        c.id === id ? { ...c, status: novoStatus } : c
      ))
    }

    const tiposCompromisso = [
      { id: 'reuniao', label: 'Reunião', color: 'bg-blue-100 text-blue-800' },
      { id: 'evento', label: 'Evento', color: 'bg-purple-100 text-purple-800' },
      { id: 'audiencia', label: 'Audiência', color: 'bg-green-100 text-green-800' },
      { id: 'visita', label: 'Visita', color: 'bg-orange-100 text-orange-800' },
      { id: 'outros', label: 'Outros', color: 'bg-gray-100 text-gray-800' }
    ]

    const statusCompromisso = [
      { id: 'agendado', label: 'Agendado', color: 'bg-yellow-100 text-yellow-800' },
      { id: 'confirmado', label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
      { id: 'realizado', label: 'Realizado', color: 'bg-green-100 text-green-800' },
      { id: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-800' }
    ]

    if (agendaView === 'cadastro') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <CalendarDays className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
              Agendar Novo Compromisso
            </h1>
            <button
              onClick={() => setAgendaView('lista')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Voltar
            </button>
          </div>

          <div className="bg-white p-4 lg:p-8 rounded-xl shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título do Compromisso</label>
                  <input
                    type="text"
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Digite o título do compromisso"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    required
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Descreva o compromisso"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data e Hora</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dataHora}
                    onChange={(e) => setFormData({...formData, dataHora: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Local</label>
                  <input
                    type="text"
                    required
                    value={formData.local}
                    onChange={(e) => setFormData({...formData, local: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Local do compromisso"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    required
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {tiposCompromisso.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>{tipo.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                  <select
                    required
                    value={formData.assessorId}
                    onChange={(e) => setFormData({...formData, assessorId: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {assessores.filter(a => a.ativo).map(assessor => (
                      <option key={assessor.id} value={assessor.id}>{assessor.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Agendar Compromisso
                </button>
                <button
                  type="button"
                  onClick={() => setAgendaView('lista')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CalendarDays className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
            Agenda de Compromissos
          </h1>
          <button
            onClick={() => setAgendaView('cadastro')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Compromisso
          </button>
        </div>

        {/* Estatísticas dos Compromissos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statusCompromisso.map(status => {
            const count = compromissos.filter(c => c.status === status.id).length
            return (
              <div key={status.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                <div className="text-center">
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{count}</p>
                  <p className={`text-xs font-medium px-2 py-1 rounded-full ${status.color} mt-1`}>
                    {status.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Lista de Compromissos */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">
              Próximos Compromissos ({compromissos.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {compromissos
              .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
              .map((compromisso) => {
                const assessor = assessores.find(a => a.id === compromisso.assessorId)
                const tipoInfo = tiposCompromisso.find(t => t.id === compromisso.tipo)
                const statusInfo = statusCompromisso.find(s => s.id === compromisso.status)
                const dataCompromisso = new Date(compromisso.dataHora)
                const isProximo = dataCompromisso.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 && compromisso.status === 'agendado'
                
                return (
                  <div key={compromisso.id} className="p-4 lg:p-6 hover:bg-gray-50">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="flex-1 w-full lg:w-auto">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{compromisso.titulo}</h3>
                          <div className="flex gap-2 flex-wrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${tipoInfo?.color}`}>
                              {tipoInfo?.label}
                            </span>
                            {isProximo && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                Próximo
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{compromisso.descricao}</p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs text-gray-500">
                          <span>📅 {dataCompromisso.toLocaleDateString()} às {dataCompromisso.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>📍 {compromisso.local}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>👤 {assessor?.nome}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusInfo?.color}`}>
                          {statusInfo?.label}
                        </span>
                        
                        <div className="flex gap-2">
                          {compromisso.status === 'agendado' && (
                            <button
                              onClick={() => handleUpdateStatus(compromisso.id, 'realizado')}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Marcar como realizado"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(compromisso.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>

          {compromissos.length === 0 && (
            <div className="text-center py-12">
              <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum compromisso agendado</h3>
              <p className="text-gray-600 mb-4">Comece agendando seu primeiro compromisso</p>
              <button
                onClick={() => setAgendaView('cadastro')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Agendar Primeiro Compromisso
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Componente de Alertas
  const AlertasScreen = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Bell className="w-6 h-6 lg:w-8 lg:h-8 text-red-600" />
          Sistema de Alertas
        </h1>
      </div>

      {/* Alertas de Tarefas Atrasadas */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 lg:p-6 rounded-xl border border-red-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg lg:text-xl font-bold text-red-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6" />
            Tarefas Atrasadas
          </h2>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            {tarefasAtrasadas.length} atrasadas
          </span>
        </div>
        
        <div className="space-y-3">
          {tarefasAtrasadas.map((tarefa) => {
            const assessor = assessores.find(a => a.id === tarefa.assessorId)
            const diasAtraso = Math.ceil((new Date().getTime() - new Date(tarefa.dataVencimento).getTime()) / (1000 * 60 * 60 * 24))
            
            return (
              <div key={tarefa.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg border border-red-100 gap-3">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{tarefa.titulo}</h3>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-600 mb-1">{tarefa.descricao}</p>
                  <p className="text-xs lg:text-sm text-gray-600">
                    Responsável: {assessor?.nome} • Vencimento: {new Date(tarefa.dataVencimento).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-lg font-bold text-red-600">{diasAtraso}</span>
                  <p className="text-xs text-gray-500">dias de atraso</p>
                </div>
              </div>
            )
          })}
          
          {tarefasAtrasadas.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 font-medium">Todas as tarefas estão em dia!</p>
            </div>
          )}
        </div>
      </div>

      {/* Alertas de Pedidos Antigos */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 lg:p-6 rounded-xl border border-yellow-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg lg:text-xl font-bold text-yellow-800 flex items-center gap-2">
            <Clock className="w-5 h-5 lg:w-6 lg:h-6" />
            Pedidos Pendentes Há Muito Tempo
          </h2>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {pedidosAntigos.length} pendentes
          </span>
        </div>
        
        <div className="space-y-3">
          {pedidosAntigos.slice(0, 10).map((pedido) => {
            const municipe = municipes.find(m => m.id === pedido.municipeId)
            
            return (
              <div key={pedido.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg border border-yellow-100 gap-3">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{pedido.titulo}</h3>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-600 mb-1">Solicitante: {municipe?.nome}</p>
                  <p className="text-xs lg:text-sm text-gray-600">
                    {pedido.bairro} • {pedido.categoria} • Aberto em {new Date(pedido.dataAbertura).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-lg font-bold text-yellow-600">{pedido.diasSemResposta}</span>
                  <p className="text-xs text-gray-500">dias sem resposta</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Compromissos Próximos */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 lg:p-6 rounded-xl border border-blue-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg lg:text-xl font-bold text-blue-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 lg:w-6 lg:h-6" />
            Compromissos Próximos (24h)
          </h2>
        </div>
        
        <div className="space-y-3">
          {compromissos
            .filter(c => {
              const dataCompromisso = new Date(c.dataHora)
              const agora = new Date()
              const diff = dataCompromisso.getTime() - agora.getTime()
              return diff > 0 && diff < 24 * 60 * 60 * 1000 && c.status !== 'cancelado'
            })
            .map((compromisso) => {
              const assessor = assessores.find(a => a.id === compromisso.assessorId)
              const dataCompromisso = new Date(compromisso.dataHora)
              
              return (
                <div key={compromisso.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg border border-blue-100 gap-3">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
                      <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{compromisso.titulo}</h3>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-600 mb-1">{compromisso.local}</p>
                    <p className="text-xs lg:text-sm text-gray-600">
                      Responsável: {assessor?.nome}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">
                      {dataCompromisso.toLocaleDateString()}
                    </span>
                    <p className="text-xs text-gray-500">
                      {dataCompromisso.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              )
            })}
          
          {compromissos.filter(c => {
            const dataCompromisso = new Date(c.dataHora)
            const agora = new Date()
            const diff = dataCompromisso.getTime() - agora.getTime()
            return diff > 0 && diff < 24 * 60 * 60 * 1000 && c.status !== 'cancelado'
          }).length === 0 && (
            <div className="text-center py-8">
              <CalendarDays className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <p className="text-blue-700 font-medium">Nenhum compromisso nas próximas 24 horas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Componente de Marketing
  const MarketingScreen = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Megaphone className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
          Marketing e Comunicação
        </h1>
      </div>

      {/* Estatísticas de Marketing */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-center">
            <p className="text-xl lg:text-2xl font-bold text-gray-900">{campanhasMarketing.length}</p>
            <p className="text-xs font-medium text-gray-600">Campanhas</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-center">
            <p className="text-xl lg:text-2xl font-bold text-gray-900">{templates.length}</p>
            <p className="text-xs font-medium text-gray-600">Templates</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-center">
            <p className="text-xl lg:text-2xl font-bold text-gray-900">{campanhasMarketing.filter(c => c.status === 'publicado').length}</p>
            <p className="text-xs font-medium text-gray-600">Publicadas</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-center">
            <p className="text-xl lg:text-2xl font-bold text-gray-900">{datasComemorativos.length}</p>
            <p className="text-xs font-medium text-gray-600">Datas Especiais</p>
          </div>
        </div>
      </div>

      {/* Lista de Campanhas */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900">Campanhas de Marketing</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {campanhasMarketing.map((campanha) => {
            const statusInfo = {
              'rascunho': { color: 'bg-gray-100 text-gray-800', label: 'Rascunho' },
              'agendado': { color: 'bg-yellow-100 text-yellow-800', label: 'Agendado' },
              'publicado': { color: 'bg-green-100 text-green-800', label: 'Publicado' }
            }[campanha.status]
            
            return (
              <div key={campanha.id} className="p-4 lg:p-6 hover:bg-gray-50">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex-1 w-full lg:w-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{campanha.titulo}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo?.color}`}>
                        {statusInfo?.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{campanha.descricao}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>📅 {new Date(campanha.dataPublicacao).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>📱 {campanha.plataformas.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="text-indigo-600 hover:text-indigo-900 p-1" title="Editar">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-1" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Templates Disponíveis */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900">Templates de Postagem</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 lg:p-6">
          {templates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{template.titulo}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  template.categoria === 'politica' ? 'bg-blue-100 text-blue-800' :
                  template.categoria === 'social' ? 'bg-green-100 text-green-800' :
                  template.categoria === 'evento' ? 'bg-purple-100 text-purple-800' :
                  'bg-pink-100 text-pink-800'
                }`}>
                  {template.categoria}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.conteudo}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Editado em {new Date(template.dataUltimaEdicao).toLocaleDateString()}</span>
                <button className="text-emerald-600 hover:text-emerald-900 font-medium">
                  Usar Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Componente de Assinatura Digital
  const AssinaturaScreen = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <PenTool className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
          Assinatura Digital
        </h1>
      </div>

      {/* Estatísticas de Assinaturas */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-center">
            <p className="text-xl lg:text-2xl font-bold text-gray-900">{assinaturasDigitais.length}</p>
            <p className="text-xs font-medium text-gray-600">Total de Documentos</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-center">
            <p className="text-xl lg:text-2xl font-bold text-green-600">{assinaturasDigitais.filter(a => a.status === 'assinado').length}</p>
            <p className="text-xs font-medium text-gray-600">Assinados</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-center">
            <p className="text-xl lg:text-2xl font-bold text-yellow-600">{assinaturasDigitais.filter(a => a.status === 'pendente').length}</p>
            <p className="text-xs font-medium text-gray-600">Pendentes</p>
          </div>
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900">Documentos para Assinatura</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {assinaturasDigitais.map((assinatura) => {
            const statusInfo = {
              'pendente': { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
              'assinado': { color: 'bg-green-100 text-green-800', label: 'Assinado' },
              'rejeitado': { color: 'bg-red-100 text-red-800', label: 'Rejeitado' }
            }[assinatura.status]
            
            return (
              <div key={assinatura.id} className="p-4 lg:p-6 hover:bg-gray-50">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex-1 w-full lg:w-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{assinatura.documento}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo?.color}`}>
                        {statusInfo?.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Assinante: {assinatura.assinante}</p>
                    <div className="text-xs text-gray-500">
                      {assinatura.status === 'assinado' ? (
                        <span>Assinado em {new Date(assinatura.dataAssinatura).toLocaleDateString()}</span>
                      ) : (
                        <span>Aguardando assinatura</span>
                      )}
                      {assinatura.hash && (
                        <>
                          <span> • Hash: {assinatura.hash}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {assinatura.status === 'pendente' && (
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm">
                        Assinar
                      </button>
                    )}
                    <button className="text-indigo-600 hover:text-indigo-900 p-1" title="Visualizar">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 p-1" title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  // Componente de Relatórios (apenas para vereadores)
  const RelatoriosScreen = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
          Relatórios e Análises
        </h1>
      </div>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-center">
            <p className="text-xl lg:text-2xl font-bold text-emerald-600">{municipes.length}</p>
            <p className="text-xs font-medium text-gray-600">Munícipes Cadastrados</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-center">
            <p className="text-xl lg:text-2xl font-bold text-blue-600">{pedidos.length}</p>
            <p className="text-xs font-medium text-gray-600">Total de Pedidos</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-center">
            <p className="text-xl lg:text-2xl font-bold text-purple-600">{tarefas.length}</p>
            <p className="text-xs font-medium text-gray-600">Tarefas Cadastradas</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-center">
            <p className="text-xl lg:text-2xl font-bold text-orange-600">{materiasLegislativas.length}</p>
            <p className="text-xs font-medium text-gray-600">Matérias Legislativas</p>
          </div>
        </div>
      </div>

      {/* Relatório de Pedidos por Bairro */}
      <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-6">Pedidos por Bairro</h2>
        <div className="space-y-4">
          {bairros.slice(0, 5).map(bairro => {
            const pedidosBairro = pedidos.filter(p => p.bairro === bairro.nome)
            const porcentagem = pedidos.length > 0 ? (pedidosBairro.length / pedidos.length) * 100 : 0
            
            return (
              <div key={bairro.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-emerald-500 rounded flex-shrink-0"></div>
                  <span className="font-medium text-sm lg:text-base">{bairro.nome}</span>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-full sm:w-64 bg-gray-200 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full" style={{width: `${porcentagem}%`}}></div>
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-gray-600 whitespace-nowrap">{pedidosBairro.length} pedidos</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Relatório de Performance dos Assessores */}
      <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-6">Performance dos Assessores</h2>
        <div className="space-y-4">
          {assessores.filter(a => a.ativo).map(assessor => {
            const tarefasAssessor = tarefas.filter(t => t.assessorId === assessor.id)
            const tarefasConcluidas = tarefasAssessor.filter(t => t.status === 'concluida')
            const porcentagem = tarefasAssessor.length > 0 ? (tarefasConcluidas.length / tarefasAssessor.length) * 100 : 0
            
            return (
              <div key={assessor.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-medium text-sm lg:text-base">{assessor.nome}</span>
                    <p className="text-xs text-gray-600">{assessor.cargo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-full sm:w-48 bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{width: `${porcentagem}%`}}></div>
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-gray-600 whitespace-nowrap">
                    {tarefasConcluidas.length}/{tarefasAssessor.length} ({Math.round(porcentagem)}%)
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Relatório de Status das Matérias Legislativas */}
      <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-6">Status das Matérias Legislativas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {estadosTramitacao.map(estado => {
            const count = materiasLegislativas.filter(m => m.estadoTramitacao === estado.id).length
            const porcentagem = materiasLegislativas.length > 0 ? (count / materiasLegislativas.length) * 100 : 0
            
            return (
              <div key={estado.id} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className={`text-xs font-medium px-2 py-1 rounded-full ${estado.color} mt-2`}>
                  {estado.label}
                </p>
                <p className="text-xs text-gray-500 mt-1">{Math.round(porcentagem)}%</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  // Componente de Contatos
  const ContatosScreen = () => {
    const [formData, setFormData] = useState({
      nome: '',
      email: '',
      whatsapp: '',
      rua: '',
      bairro: '',
      nascimento: '',
      sexo: 'masculino'
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (contatosView === 'edicao' && municipeEditando) {
        // Editar contato existente
        const municipeAtualizado = await atualizarMunicipeSupabase(municipeEditando.id, formData)
        if (municipeAtualizado) {
          setMunicipes(municipes.map(m => m.id === municipeEditando.id ? municipeAtualizado : m))
          setMunicipeEditando(null)
          setFormData({
            nome: '',
            email: '',
            whatsapp: '',
            rua: '',
            bairro: '',
            nascimento: '',
            sexo: 'masculino'
          })
          alert('Contato atualizado com sucesso!')
          setContatosView('lista')
        }
      } else {
        // Criar novo contato
        const novoMunicipe = await salvarMunicipeSupabase(formData)
        if (novoMunicipe) {
          setMunicipes([...municipes, novoMunicipe])
          setFormData({
            nome: '',
            email: '',
            whatsapp: '',
            rua: '',
            bairro: '',
            nascimento: '',
            sexo: 'masculino'
          })
          alert('Contato cadastrado com sucesso!')
          setContatosView('lista')
        }
      }
    }

    const handleEdit = (municipe: Municipe) => {
      setMunicipeEditando(municipe)
      setFormData({
        nome: municipe.nome,
        email: municipe.email,
        whatsapp: municipe.whatsapp,
        rua: municipe.rua,
        bairro: municipe.bairro,
        nascimento: municipe.nascimento,
        sexo: municipe.sexo
      })
      setContatosView('edicao')
    }

    const handleDelete = async (id: number) => {
      if (confirm('Tem certeza que deseja excluir este contato?')) {
        const sucesso = await deletarMunicipeSupabase(id)
        if (sucesso) {
          setMunicipes(municipes.filter(m => m.id !== id))
          alert('Contato excluído com sucesso!')
        }
      }
    }

    const municipesFiltrados = municipes.filter(m => 
      m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.bairro.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (contatosView === 'cadastro' || contatosView === 'edicao') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
              {contatosView === 'edicao' ? 'Editar Contato' : 'Cadastrar Novo Contato'}
            </h1>
            <button
              onClick={() => {
                setContatosView('lista')
                setMunicipeEditando(null)
                setFormData({
                  nome: '',
                  email: '',
                  whatsapp: '',
                  rua: '',
                  bairro: '',
                  nascimento: '',
                  sexo: 'masculino'
                })
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Voltar
            </button>
          </div>

          <div className="bg-white p-4 lg:p-8 rounded-xl shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Digite o nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                  <select
                    required
                    value={formData.bairro}
                    onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Selecione o bairro</option>
                    {bairrosNomes.map(bairro => (
                      <option key={bairro} value={bairro}>{bairro}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rua</label>
                  <input
                    type="text"
                    required
                    value={formData.rua}
                    onChange={(e) => setFormData({...formData, rua: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Nome da rua e número"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                  <input
                    type="date"
                    required
                    value={formData.nascimento}
                    onChange={(e) => setFormData({...formData, nascimento: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                  <select
                    required
                    value={formData.sexo}
                    onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {contatosView === 'edicao' ? 'Atualizar Contato' : 'Salvar Contato'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setContatosView('lista')
                    setMunicipeEditando(null)
                    setFormData({
                      nome: '',
                      email: '',
                      whatsapp: '',
                      rua: '',
                      bairro: '',
                      nascimento: '',
                      sexo: 'masculino'
                    })
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
            Gestão de Contatos
          </h1>
          <button
            onClick={() => setContatosView('cadastro')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Contato
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisar por nome, email ou bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Lista de Contatos */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">Lista de Contatos ({municipesFiltrados.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bairro</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {municipesFiltrados.map((municipe) => (
                  <tr key={municipe.id} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
                        </div>
                        <div className="ml-3 lg:ml-4">
                          <div className="text-sm font-medium text-gray-900">{municipe.nome}</div>
                          <div className="text-xs text-gray-500 sm:hidden">{municipe.email}</div>
                          <div className="text-xs text-gray-500">{municipe.sexo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 hidden sm:table-cell">{municipe.email}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">{municipe.whatsapp}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">{municipe.bairro}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(municipe)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(municipe.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {municipesFiltrados.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum contato encontrado</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Tente ajustar o termo de pesquisa' : 'Comece cadastrando seu primeiro contato'}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Componente de Pedidos
  const PedidosScreen = () => {
    const [formData, setFormData] = useState({
      municipeId: 0,
      titulo: '',
      descricao: '',
      categoria: '',
      prioridade: 'media' as const,
      bairro: '',
      rua: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      
      const novoPedido: Pedido = {
        id: Math.max(...pedidos.map(p => p.id)) + 1,
        municipeId: formData.municipeId,
        titulo: formData.titulo,
        descricao: formData.descricao,
        categoria: formData.categoria,
        prioridade: formData.prioridade,
        status: 'pendente',
        dataAbertura: new Date().toISOString().split('T')[0],
        bairro: formData.bairro,
        rua: formData.rua
      }
      
      setPedidos([...pedidos, novoPedido])
      setFormData({
        municipeId: 0,
        titulo: '',
        descricao: '',
        categoria: '',
        prioridade: 'media',
        bairro: '',
        rua: ''
      })
      alert('Pedido cadastrado com sucesso!')
      setPedidosView('lista')
    }

    const pedidosFiltrados = pedidos.filter(p => {
      const municipe = municipes.find(m => m.id === p.municipeId)
      const matchSearch = searchTerm === '' || 
        p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        municipe?.nome.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchBairro = filtroBairro === '' || p.bairro === filtroBairro
      const matchStatus = filtroStatus === '' || p.status === filtroStatus
      
      return matchSearch && matchBairro && matchStatus
    })

    if (pedidosView === 'cadastro') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Phone className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
              Cadastrar Novo Pedido
            </h1>
            <button
              onClick={() => setPedidosView('lista')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Voltar
            </button>
          </div>

          <div className="bg-white p-4 lg:p-8 rounded-xl shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Munícipe (Contato)</label>
                  <select
                    required
                    value={formData.municipeId}
                    onChange={(e) => setFormData({...formData, municipeId: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value={0}>Selecione o munícipe</option>
                    {municipes.map(municipe => (
                      <option key={municipe.id} value={municipe.id}>{municipe.nome} - {municipe.bairro}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    required
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Selecione a categoria</option>
                    {categoriasPedido.map(categoria => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título do Pedido</label>
                  <input
                    type="text"
                    required
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Digite o título do pedido"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    required
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Descreva o pedido detalhadamente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                  <select
                    required
                    value={formData.bairro}
                    onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Selecione o bairro</option>
                    {bairrosNomes.map(bairro => (
                      <option key={bairro} value={bairro}>{bairro}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rua</label>
                  <input
                    type="text"
                    required
                    value={formData.rua}
                    onChange={(e) => setFormData({...formData, rua: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Nome da rua"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                  <select
                    required
                    value={formData.prioridade}
                    onChange={(e) => setFormData({...formData, prioridade: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {prioridades.map(prioridade => (
                      <option key={prioridade.id} value={prioridade.id}>{prioridade.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar Pedido
                </button>
                <button
                  type="button"
                  onClick={() => setPedidosView('lista')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Phone className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
            Gestão de Pedidos
          </h1>
          <button
            onClick={() => setPedidosView('cadastro')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Pedido
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Pesquisar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <select
              value={filtroBairro}
              onChange={(e) => setFiltroBairro(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Todos os bairros</option>
              {bairrosNomes.map(bairro => (
                <option key={bairro} value={bairro}>{bairro}</option>
              ))}
            </select>

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="resolvido">Resolvido</option>
              <option value="cancelado">Cancelado</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('')
                setFiltroBairro('')
                setFiltroStatus('')
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">
              Lista de Pedidos ({pedidosFiltrados.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {pedidosFiltrados.map((pedido) => {
              const municipe = municipes.find(m => m.id === pedido.municipeId)
              const prioridadeInfo = prioridades.find(p => p.id === pedido.prioridade)
              const statusInfo = {
                'pendente': { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
                'em_andamento': { color: 'bg-blue-100 text-blue-800', label: 'Em Andamento' },
                'resolvido': { color: 'bg-green-100 text-green-800', label: 'Resolvido' },
                'cancelado': { color: 'bg-red-100 text-red-800', label: 'Cancelado' }
              }[pedido.status]
              
              return (
                <div key={pedido.id} className="p-4 lg:p-6 hover:bg-gray-50">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex-1 w-full lg:w-auto">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{pedido.titulo}</h3>
                        <div className="flex gap-2 flex-wrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${prioridadeInfo?.color}`}>
                            {prioridadeInfo?.label}
                          </span>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {pedido.categoria}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{pedido.descricao}</p>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs text-gray-500">
                        <span>👤 {municipe?.nome}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>📍 {pedido.bairro}, {pedido.rua}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>📅 {new Date(pedido.dataAbertura).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusInfo?.color}`}>
                        {statusInfo?.label}
                      </span>
                      
                      <div className="flex gap-2">
                        <button className="text-indigo-600 hover:text-indigo-900 p-1" title="Visualizar">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1" title="Editar">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1" title="Excluir">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {pedidosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filtroBairro || filtroStatus
                  ? 'Tente ajustar os filtros de pesquisa'
                  : 'Comece cadastrando seu primeiro pedido'
                }
              </p>
              <button
                onClick={() => setPedidosView('cadastro')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cadastrar Primeiro Pedido
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Componente de Bairros
  const BairrosScreen = () => {
    const [formData, setFormData] = useState({
      nome: '',
      regiao: '',
      populacao: 0,
      descricao: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      const novoBairro = await salvarBairroSupabase(formData)
      if (novoBairro) {
        setBairros([...bairros, novoBairro])
        setFormData({
          nome: '',
          regiao: '',
          populacao: 0,
          descricao: ''
        })
        alert('Bairro cadastrado com sucesso!')
        setBairrosView('lista')
      }
    }

    const handleEdit = (bairro: Bairro) => {
      setBairroEditando(bairro)
      setBairrosView('edicao')
    }

    const handleDelete = (id: number) => {
      if (confirm('Tem certeza que deseja excluir este bairro?')) {
        setBairros(bairros.filter(b => b.id !== id))
        alert('Bairro excluído com sucesso!')
      }
    }

    if (bairrosView === 'cadastro') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MapPin className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
              Cadastrar Novo Bairro
            </h1>
            <button
              onClick={() => setBairrosView('lista')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Voltar
            </button>
          </div>

          <div className="bg-white p-4 lg:p-8 rounded-xl shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Bairro</label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Digite o nome do bairro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Região</label>
                  <select
                    required
                    value={formData.regiao}
                    onChange={(e) => setFormData({...formData, regiao: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Selecione a região</option>
                    {regioes.map(regiao => (
                      <option key={regiao} value={regiao}>{regiao}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">População Estimada</label>
                  <input
                    type="number"
                    required
                    value={formData.populacao}
                    onChange={(e) => setFormData({...formData, populacao: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Descrição do bairro (opcional)"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar Bairro
                </button>
                <button
                  type="button"
                  onClick={() => setBairrosView('lista')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MapPin className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
            Gestão de Bairros
          </h1>
          <button
            onClick={() => setBairrosView('cadastro')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Bairro
          </button>
        </div>

        {/* Lista de Bairros */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {bairros.map((bairro) => (
            <div key={bairro.id} className="bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">{bairro.nome}</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(bairro)}
                    className="text-indigo-600 hover:text-indigo-900 p-1"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(bairro.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Região:</strong> {bairro.regiao}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>População:</strong> {bairro.populacao.toLocaleString()} habitantes
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Cadastrado em:</strong> {new Date(bairro.dataCadastro).toLocaleDateString()}
                </p>
                {bairro.descricao && (
                  <p className="text-sm text-gray-600 mt-3">
                    {bairro.descricao}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {bairros.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum bairro cadastrado</h3>
            <p className="text-gray-600 mb-4">Comece cadastrando seu primeiro bairro</p>
            <button
              onClick={() => setBairrosView('cadastro')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cadastrar Primeiro Bairro
            </button>
          </div>
        )}
      </div>
    )
  }

  // Modal de Visualização de Matéria
  const ModalVisualizacaoMateria = () => {
    if (!materiaVisualizando) return null

    const estadoInfo = estadosTramitacao.find(e => e.id === materiaVisualizando.estadoTramitacao)

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Scale className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
                Detalhes da Matéria Legislativa
              </h2>
              <button
                onClick={() => setMateriaVisualizando(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-4 lg:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Número</label>
                <p className="text-lg font-semibold text-gray-900">{materiaVisualizando.numero}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Bairro</label>
                <p className="text-lg text-gray-900">{materiaVisualizando.bairro}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Tipo Legislativo</label>
                <p className="text-lg text-gray-900">{materiaVisualizando.tipoLegislativo}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Data do Protocolo</label>
                <p className="text-lg text-gray-900">
                  {new Date(materiaVisualizando.dataProtocolo).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Estado de Tramitação</label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${estadoInfo?.color}`}>
                  {estadoInfo?.label}
                </span>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Tema</label>
                <p className="text-lg text-gray-900 leading-relaxed">{materiaVisualizando.tema}</p>
              </div>

              {materiaVisualizando.observacoes && (
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Observações</label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 leading-relaxed">{materiaVisualizando.observacoes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => editarMateria(materiaVisualizando)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => setMateriaVisualizando(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Componente de Matérias Legislativas
  const MateriaLegislativaScreen = () => {
    const [formData, setFormData] = useState({
      numero: '',
      bairro: '',
      tipoLegislativo: '',
      tema: '',
      dataProtocolo: '',
      estadoTramitacao: 'protocolado' as const,
      observacoes: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      const novaMateria = await salvarMateriaLegislativaSupabase(formData)
      if (novaMateria) {
        setMateriasLegislativas([...materiasLegislativas, novaMateria])
        setFormData({
          numero: '',
          bairro: '',
          tipoLegislativo: '',
          tema: '',
          dataProtocolo: '',
          estadoTramitacao: 'protocolado',
          observacoes: ''
        })
        alert('Matéria legislativa cadastrada com sucesso!')
        setMateriaLegislativaView('lista')
      }
    }

    const materiasFiltradas = materiasLegislativas.filter(m => {
      const matchSearch = searchMateria === '' || 
        m.numero.toLowerCase().includes(searchMateria.toLowerCase()) ||
        m.tema.toLowerCase().includes(searchMateria.toLowerCase()) ||
        m.bairro.toLowerCase().includes(searchMateria.toLowerCase())
      
      const matchTipo = filtroTipoLegislativo === '' || m.tipoLegislativo === filtroTipoLegislativo
      const matchEstado = filtroEstadoTramitacao === '' || m.estadoTramitacao === filtroEstadoTramitacao
      const matchBairro = filtroBairroMateria === '' || m.bairro === filtroBairroMateria
      
      return matchSearch && matchTipo && matchEstado && matchBairro
    })

    if (materiaLegislativaView === 'cadastro') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Scale className="w-6 h-6 lg:w-8 lg:h-8 text-indigo-600" />
              Cadastrar Nova Matéria Legislativa
            </h1>
            <button
              onClick={() => setMateriaLegislativaView('lista')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Voltar
            </button>
          </div>

          <div className="bg-white p-4 lg:p-8 rounded-xl shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número da Matéria</label>
                  <input
                    type="text"
                    required
                    value={formData.numero}
                    onChange={(e) => setFormData({...formData, numero: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ex: PL-001/2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                  <select
                    required
                    value={formData.bairro}
                    onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Selecione o bairro</option>
                    {bairrosNomes.map(bairro => (
                      <option key={bairro} value={bairro}>{bairro}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Legislativo</label>
                  <select
                    required
                    value={formData.tipoLegislativo}
                    onChange={(e) => setFormData({...formData, tipoLegislativo: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Selecione o tipo</option>
                    {tiposLegislativos.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data do Protocolo</label>
                  <input
                    type="date"
                    required
                    value={formData.dataProtocolo}
                    onChange={(e) => setFormData({...formData, dataProtocolo: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado de Tramitação</label>
                  <select
                    required
                    value={formData.estadoTramitacao}
                    onChange={(e) => setFormData({...formData, estadoTramitacao: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {estadosTramitacao.map(estado => (
                      <option key={estado.id} value={estado.id}>{estado.label}</option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                  <input
                    type="text"
                    required
                    value={formData.tema}
                    onChange={(e) => setFormData({...formData, tema: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Descreva o tema da matéria legislativa"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Observações sobre a tramitação (opcional)"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar Matéria
                </button>
                <button
                  type="button"
                  onClick={() => setMateriaLegislativaView('lista')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Scale className="w-6 h-6 lg:w-8 lg:h-8 text-indigo-600" />
            Gestão de Matérias Legislativas
          </h1>
          <button
            onClick={() => setMateriaLegislativaView('cadastro')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Matéria
          </button>
        </div>

        {/* Filtros e Pesquisa */}
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Pesquisar por número, tema..."
                value={searchMateria}
                onChange={(e) => setSearchMateria(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <select
              value={filtroTipoLegislativo}
              onChange={(e) => setFiltroTipoLegislativo(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos os tipos</option>
              {tiposLegislativos.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>

            <select
              value={filtroEstadoTramitacao}
              onChange={(e) => setFiltroEstadoTramitacao(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos os estados</option>
              {estadosTramitacao.map(estado => (
                <option key={estado.id} value={estado.id}>{estado.label}</option>
              ))}
            </select>

            <select
              value={filtroBairroMateria}
              onChange={(e) => setFiltroBairroMateria(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos os bairros</option>
              {bairrosNomes.map(bairro => (
                <option key={bairro} value={bairro}>{bairro}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchMateria('')
                setFiltroTipoLegislativo('')
                setFiltroEstadoTramitacao('')
                setFiltroBairroMateria('')
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {estadosTramitacao.map(estado => {
            const count = materiasLegislativas.filter(m => m.estadoTramitacao === estado.id).length
            return (
              <div key={estado.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                <div className="text-center">
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{count}</p>
                  <p className={`text-xs font-medium px-2 py-1 rounded-full ${estado.color} mt-1`}>
                    {estado.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Lista de Matérias */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">
              Matérias Legislativas ({materiasFiltradas.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Tipo</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tema</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Bairro</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Data</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {materiasFiltradas.map((materia) => {
                  const estadoInfo = estadosTramitacao.find(e => e.id === materia.estadoTramitacao)
                  
                  return (
                    <tr key={materia.id} className="hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{materia.numero}</div>
                        <div className="text-xs text-gray-500 sm:hidden">{materia.tipoLegislativo}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 hidden sm:table-cell">
                        <div className="text-sm text-gray-900">{materia.tipoLegislativo}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={materia.tema}>
                          {materia.tema}
                        </div>
                        <div className="text-xs text-gray-500 lg:hidden">{materia.bairro}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 hidden lg:table-cell">
                        <div className="text-sm text-gray-900">{materia.bairro}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadoInfo?.color}`}>
                          {estadoInfo?.label}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 hidden sm:table-cell">
                        {new Date(materia.dataProtocolo).toLocaleDateString()}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm font-medium">
                        <div className="flex gap-1 lg:gap-2">
                          <button 
                            onClick={() => visualizarMateria(materia)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Visualizar detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => editarMateria(materia)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deletarMateria(materia.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {materiasFiltradas.length === 0 && (
            <div className="text-center py-12">
              <Scale className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma matéria encontrada</h3>
              <p className="text-gray-600 mb-4">
                {searchMateria || filtroTipoLegislativo || filtroEstadoTramitacao || filtroBairroMateria
                  ? 'Tente ajustar os filtros de pesquisa'
                  : 'Comece cadastrando sua primeira matéria legislativa'
                }
              </p>
              <button
                onClick={() => setMateriaLegislativaView('cadastro')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cadastrar Primeira Matéria
              </button>
            </div>
          )}
        </div>

        {/* Modal de Visualização */}
        <ModalVisualizacaoMateria />
      </div>
    )
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />
      case 'contatos':
        return <ContatosScreen />
      case 'pedidos':
        return <PedidosScreen />
      case 'bairros':
        return <BairrosScreen />
      case 'materia-legislativa':
        return <MateriaLegislativaScreen />
      case 'tarefas':
        return <TarefasScreen />
      case 'marketing':
        return <MarketingScreen />
      case 'agenda':
        return <AgendaScreen />
      case 'cadastro-assessor':
        return <CadastroAssessorScreen />
      case 'listagem-municipes':
        return <ListagemMunicipesScreen />
      case 'alertas':
        return <AlertasScreen />
      case 'assinatura':
        return <AssinaturaScreen />
      case 'relatorios':
        return <RelatoriosScreen />
      default:
        return <Dashboard />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Menu Lateral */}
      <div className="lg:w-64 bg-white shadow-lg border-r border-gray-200 lg:fixed lg:h-full">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900">Sistema Parlamentar</h2>
          <p className="text-sm text-gray-600 mt-1">Gestão de Mandato</p>
        </div>
        
        <nav className="mt-4 lg:mt-6 pb-4 lg:pb-0">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeScreen === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveScreen(item.id as ActiveScreen)
                  if (item.id === 'contatos') {
                    setContatosView('lista')
                  }
                  if (item.id === 'pedidos') {
                    setPedidosView('lista')
                  }
                  if (item.id === 'bairros') {
                    setBairrosView('lista')
                  }
                  if (item.id === 'materia-legislativa') {
                    setMateriaLegislativaView('lista')
                  }
                  if (item.id === 'tarefas') {
                    setTarefasView('lista')
                  }
                  if (item.id === 'marketing') {
                    setMarketingView('criador')
                  }
                  if (item.id === 'cadastro-assessor') {
                    setAssessorView('lista')
                  }
                  if (item.id === 'agenda') {
                    setAgendaView('lista')
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 lg:px-6 py-3 text-left hover:bg-gray-50 transition-colors text-sm lg:text-base ${
                  isActive ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' : 'text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <Header activeScreen={activeScreen} />

        {/* Conteúdo */}
        <main className="p-4 lg:p-6">
          {renderScreen()}
        </main>
      </div>
    </div>
  )
}

// Componente principal com autenticação
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const { isAuthenticated, loading, login } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />
  }

  return <SistemaGestaoParlamenta />
}