'use client'

import { useState, useEffect, useRef } from 'react'
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
  X
} from 'lucide-react'

type ActiveScreen = 'dashboard' | 'cadastro-assessor' | 'listagem-municipes' | 'contatos' | 'pedidos' | 'tarefas' | 'marketing' | 'relatorios' | 'alertas' | 'assinatura' | 'documentos' | 'bairros' | 'materia-legislativa'
type ContatosView = 'lista' | 'cadastro' | 'edicao'
type PedidosView = 'lista' | 'cadastro' | 'edicao' | 'detalhes'
type BairrosView = 'lista' | 'cadastro' | 'edicao'
type MarketingView = 'criador' | 'templates' | 'aniversarios' | 'calendario' | 'datas-comemorativas'
type MunicipesView = 'lista' | 'cadastro' | 'edicao'
type MateriaLegislativaView = 'lista' | 'cadastro' | 'edicao'

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
  avatar?: string
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

export default function SistemaGestaoParlamenta() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard')
  const [contatosView, setContatosView] = useState<ContatosView>('lista')
  const [pedidosView, setPedidosView] = useState<PedidosView>('lista')
  const [bairrosView, setBairrosView] = useState<BairrosView>('lista')
  const [marketingView, setMarketingView] = useState<MarketingView>('criador')
  const [materiaLegislativaView, setMateriaLegislativaView] = useState<MateriaLegislativaView>('lista')
  const [municipeEditando, setMunicipeEditando] = useState<Municipe | null>(null)
  const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null)
  const [bairroEditando, setBairroEditando] = useState<Bairro | null>(null)
  const [materiaEditando, setMateriaEditando] = useState<MateriaLegislativa | null>(null)
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

  // Estados para Assinatura Digital
  const [documentos, setDocumentos] = useState<DocumentoAssinatura[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [documentoSelecionado, setDocumentoSelecionado] = useState<DocumentoAssinatura | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Lista de assessores (simulando dados)
  const [assessores] = useState<Assessor[]>([
    {
      id: 1,
      nome: 'Carlos Silva',
      email: 'carlos@gabinete.com',
      cargo: 'Assessor Parlamentar'
    },
    {
      id: 2,
      nome: 'Ana Santos',
      email: 'ana@gabinete.com',
      cargo: 'Chefe de Gabinete'
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      email: 'pedro@gabinete.com',
      cargo: 'Assessor de Comunicação'
    },
    {
      id: 4,
      nome: 'Maria Oliveira',
      email: 'maria@gabinete.com',
      cargo: 'Assessor Jurídico'
    }
  ])

  // Templates de postagens (simulando dados)
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

  // Datas comemorativas (simulando dados)
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

  // Lista de tarefas (simulando dados)
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

  const [novaTarefa, setNovaTarefa] = useState('')

  // Lista de munícipes (simulando dados)
  const [municipes, setMunicipes] = useState<Municipe[]>([
    {
      id: 1,
      nome: 'Maria Silva Santos',
      email: 'maria.silva@email.com',
      whatsapp: '(11) 98765-4321',
      rua: 'Rua das Palmeiras, 456',
      bairro: 'Centro',
      nascimento: '1985-03-15',
      sexo: 'feminino'
    },
    {
      id: 2,
      nome: 'João Carlos Oliveira',
      email: 'joao.carlos@email.com',
      whatsapp: '(11) 97654-3210',
      rua: 'Av. Brasil, 789',
      bairro: 'Vila Nova',
      nascimento: '1978-07-22',
      sexo: 'masculino'
    },
    {
      id: 3,
      nome: 'Ana Paula Costa',
      email: 'ana.paula@email.com',
      whatsapp: '(11) 96543-2109',
      rua: 'Rua das Flores, 123',
      bairro: 'Jardim América',
      nascimento: '1992-11-08',
      sexo: 'feminino'
    },
    {
      id: 4,
      nome: 'Carlos Eduardo Santos',
      email: 'carlos.eduardo@email.com',
      whatsapp: '(11) 95432-1098',
      rua: 'Rua São José, 321',
      bairro: 'São José',
      nascimento: '1980-05-12',
      sexo: 'masculino'
    },
    {
      id: 5,
      nome: 'Fernanda Lima',
      email: 'fernanda.lima@email.com',
      whatsapp: '(11) 94321-0987',
      rua: 'Av. Santa Maria, 654',
      bairro: 'Santa Maria',
      nascimento: '1990-09-25',
      sexo: 'feminino'
    }
  ])

  // Lista de pedidos (simulando dados)
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

  // Lista de bairros (simulando dados)
  const [bairros, setBairros] = useState<Bairro[]>([
    {
      id: 1,
      nome: 'Centro',
      regiao: 'Central',
      populacao: 15000,
      descricao: 'Região central da cidade com comércio e serviços',
      dataCadastro: '2024-01-01'
    },
    {
      id: 2,
      nome: 'Vila Nova',
      regiao: 'Norte',
      populacao: 8500,
      descricao: 'Bairro residencial em expansão na zona norte',
      dataCadastro: '2024-01-02'
    },
    {
      id: 3,
      nome: 'Jardim América',
      regiao: 'Sul',
      populacao: 12000,
      descricao: 'Bairro residencial consolidado na zona sul',
      dataCadastro: '2024-01-03'
    },
    {
      id: 4,
      nome: 'São José',
      regiao: 'Leste',
      populacao: 6800,
      descricao: 'Bairro em desenvolvimento na zona leste',
      dataCadastro: '2024-01-04'
    },
    {
      id: 5,
      nome: 'Santa Maria',
      regiao: 'Oeste',
      populacao: 9200,
      descricao: 'Bairro misto com área residencial e comercial',
      dataCadastro: '2024-01-05'
    }
  ])

  // Lista de matérias legislativas (simulando dados)
  const [materiasLegislativas, setMateriasLegislativas] = useState<MateriaLegislativa[]>([
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

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'contatos', label: 'Contatos', icon: Users },
    { id: 'pedidos', label: 'Pedidos', icon: Phone },
    { id: 'bairros', label: 'Bairros', icon: MapPin },
    { id: 'materia-legislativa', label: 'Matéria Legislativa', icon: Scale },
    { id: 'tarefas', label: 'Tarefas', icon: CheckSquare },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart },
    { id: 'alertas', label: 'Alertas', icon: Bell },
    { id: 'assinatura', label: 'Assinatura', icon: PenTool },
    { id: 'documentos', label: 'Documentos', icon: FolderOpen },
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
        assessorId: assessores[0].id, // Atribui ao primeiro assessor por padrão
        dataCriacao: new Date().toISOString().split('T')[0],
        dataVencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 dias
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

  // Funções para Assinatura Digital
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type === 'application/pdf' || file.type.includes('document'))) {
      const novoDocumento: DocumentoAssinatura = {
        id: Math.max(...documentos.map(d => d.id), 0) + 1,
        nome: file.name,
        arquivo: file,
        assinatura: null,
        dataUpload: new Date().toISOString().split('T')[0],
        status: 'pendente',
        tipo: file.type === 'application/pdf' ? 'pdf' : 'doc'
      }
      setDocumentos([...documentos, novoDocumento])
    } else {
      alert('Por favor, selecione apenas arquivos PDF, DOC ou DOCX')
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
      }
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.stroke()
      }
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (canvas && documentoSelecionado) {
      const assinaturaDataURL = canvas.toDataURL()
      const documentoAtualizado = {
        ...documentoSelecionado,
        assinatura: assinaturaDataURL,
        dataAssinatura: new Date().toISOString().split('T')[0],
        status: 'assinado' as const
      }
      
      setDocumentos(documentos.map(doc => 
        doc.id === documentoSelecionado.id ? documentoAtualizado : doc
      ))
      
      setDocumentoSelecionado(null)
      clearSignature()
      alert('Documento assinado com sucesso!')
    }
  }

  // Configurar canvas para assinatura
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      }
    }
  }, [documentoSelecionado])

  // Componente Assinatura Digital
  const AssinaturaDigital = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <PenTool className="w-8 h-8 text-indigo-600" />
          Assinatura Digital
        </h1>
      </div>

      {/* Upload de Documentos */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileUp className="w-5 h-5 text-indigo-600" />
          Upload de Documentos
        </h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Clique para enviar ou arraste arquivos aqui
            </p>
            <p className="text-sm text-gray-600">
              Suporte para PDF, DOC e DOCX (máx. 10MB)
            </p>
          </label>
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documentos ({documentos.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {documentos.map((documento) => (
            <div key={documento.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{documento.nome}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      documento.status === 'assinado' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {documento.status === 'assinado' ? 'Assinado' : 'Pendente'}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {documento.tipo.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Upload:</span> {new Date(documento.dataUpload).toLocaleDateString('pt-BR')}
                    </div>
                    {documento.dataAssinatura && (
                      <div>
                        <span className="font-medium">Assinado em:</span> {new Date(documento.dataAssinatura).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Tamanho:</span> {documento.arquivo ? (documento.arquivo.size / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  {documento.status === 'pendente' && (
                    <button
                      onClick={() => setDocumentoSelecionado(documento)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Signature className="w-4 h-4" />
                      Assinar
                    </button>
                  )}
                  
                  {documento.status === 'assinado' && (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                      <Download className="w-4 h-4" />
                      Baixar
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir este documento?')) {
                        setDocumentos(documentos.filter(d => d.id !== documento.id))
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir documento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {documentos.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum documento enviado</h3>
              <p className="text-gray-600">
                Faça o upload do primeiro documento para começar a assinar digitalmente.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Assinatura */}
      {documentoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Signature className="w-5 h-5 text-indigo-600" />
                  Assinar Documento: {documentoSelecionado.nome}
                </h2>
                <button
                  onClick={() => setDocumentoSelecionado(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Desenhe sua assinatura:</h3>
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={200}
                    className="border border-gray-300 rounded bg-white cursor-crosshair w-full"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
                
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={clearSignature}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Limpar
                  </button>
                  
                  <button
                    onClick={saveSignature}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Confirmar Assinatura
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Informações da Assinatura:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><span className="font-medium">Data:</span> {new Date().toLocaleDateString('pt-BR')}</p>
                  <p><span className="font-medium">Hora:</span> {new Date().toLocaleTimeString('pt-BR')}</p>
                  <p><span className="font-medium">Usuário:</span> Vereador João Silva</p>
                  <p><span className="font-medium">IP:</span> 192.168.1.100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Documentos</p>
              <p className="text-3xl font-bold text-indigo-600">{documentos.length}</p>
            </div>
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documentos Assinados</p>
              <p className="text-3xl font-bold text-green-600">
                {documentos.filter(d => d.status === 'assinado').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-3xl font-bold text-yellow-600">
                {documentos.filter(d => d.status === 'pendente').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  )

  // Componente Matéria Legislativa
  const MateriaLegislativa = () => {
    const materiasFiltradas = materiasLegislativas.filter(materia => {
      const matchSearch = !searchMateria || 
        materia.numero.toLowerCase().includes(searchMateria.toLowerCase()) ||
        materia.tema.toLowerCase().includes(searchMateria.toLowerCase()) ||
        materia.bairro.toLowerCase().includes(searchMateria.toLowerCase())
      
      const matchTipo = !filtroTipoLegislativo || materia.tipoLegislativo === filtroTipoLegislativo
      const matchEstado = !filtroEstadoTramitacao || materia.estadoTramitacao === filtroEstadoTramitacao

      return matchSearch && matchTipo && matchEstado
    })

    const ListaMaterias = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Scale className="w-8 h-8 text-indigo-600" />
            Matéria Legislativa
          </h1>
          <button 
            onClick={() => setMateriaLegislativaView('cadastro')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Matéria
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Pesquisa
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Busca Geral</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Número, tema, bairro..."
                  value={searchMateria}
                  onChange={(e) => setSearchMateria(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Legislativo</label>
              <select
                value={filtroTipoLegislativo}
                onChange={(e) => setFiltroTipoLegislativo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todos os tipos</option>
                {tiposLegislativos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado da Tramitação</label>
              <select
                value={filtroEstadoTramitacao}
                onChange={(e) => setFiltroEstadoTramitacao(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todos os estados</option>
                {estadosTramitacao.map(estado => (
                  <option key={estado.id} value={estado.id}>{estado.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchMateria('')
                  setFiltroTipoLegislativo('')
                  setFiltroEstadoTramitacao('')
                }}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-indigo-600">{materiasLegislativas.length}</p>
              </div>
              <Scale className="w-8 h-8 text-indigo-600" />
            </div>
          </div>

          {estadosTramitacao.map(estado => {
            const count = materiasLegislativas.filter(m => m.estadoTramitacao === estado.id).length
            return (
              <div key={estado.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{estado.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{count}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${estado.color.split(' ')[0]}`}></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Lista de Matérias */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Lista de Matérias Legislativas ({materiasFiltradas.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {materiasFiltradas.map((materia) => {
              const estadoInfo = estadosTramitacao.find(e => e.id === materia.estadoTramitacao)
              
              return (
                <div key={materia.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{materia.numero}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${estadoInfo?.color}`}>
                          {estadoInfo?.label}
                        </span>
                      </div>
                      
                      <p className="text-gray-900 font-medium mb-2">{materia.tema}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Tipo:</span> {materia.tipoLegislativo}
                        </div>
                        <div>
                          <span className="font-medium">Bairro:</span> {materia.bairro}
                        </div>
                        <div>
                          <span className="font-medium">Protocolo:</span> {new Date(materia.dataProtocolo).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <span className="font-medium">Dias:</span> {Math.ceil((new Date().getTime() - new Date(materia.dataProtocolo).getTime()) / (1000 * 60 * 60 * 24))} dias
                        </div>
                      </div>

                      {materia.observacoes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Observações:</span> {materia.observacoes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setMateriaEditando(materia)
                          setMateriaLegislativaView('edicao')
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editar matéria"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir esta matéria legislativa?')) {
                            setMateriasLegislativas(materiasLegislativas.filter(m => m.id !== materia.id))
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir matéria"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {materiasFiltradas.length === 0 && (
              <div className="p-12 text-center">
                <Scale className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma matéria encontrada</h3>
                <p className="text-gray-600">
                  {searchMateria || filtroTipoLegislativo || filtroEstadoTramitacao ? 
                    'Tente ajustar os filtros de pesquisa.' : 
                    'Comece cadastrando a primeira matéria legislativa.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )

    const CadastroMateria = () => {
      const [formData, setFormData] = useState({
        numero: '',
        bairro: '',
        tipoLegislativo: '',
        tema: '',
        dataProtocolo: '',
        estadoTramitacao: 'protocolado' as 'protocolado' | 'em_tramitacao' | 'aprovado' | 'rejeitado' | 'arquivado',
        observacoes: ''
      })

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const novaMateria: MateriaLegislativa = {
          id: Math.max(...materiasLegislativas.map(m => m.id)) + 1,
          ...formData
        }
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
        setMateriaLegislativaView('lista')
      }

      return (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setMateriaLegislativaView('lista')}
              className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
            >
              ← Voltar à Lista
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-indigo-600" />
              Cadastro de Matéria Legislativa
            </h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Legislativo</label>
                <select
                  required
                  value={formData.tipoLegislativo}
                  onChange={(e) => setFormData({...formData, tipoLegislativo: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Selecione o tipo legislativo</option>
                  {tiposLegislativos.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado da Tramitação</label>
                <select
                  value={formData.estadoTramitacao}
                  onChange={(e) => setFormData({...formData, estadoTramitacao: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {estadosTramitacao.map(estado => (
                    <option key={estado.id} value={estado.id}>{estado.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  rows={4}
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Observações sobre a tramitação, pareceres, etc."
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Cadastrar Matéria Legislativa
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    const EdicaoMateria = () => {
      const [formData, setFormData] = useState({
        numero: materiaEditando?.numero || '',
        bairro: materiaEditando?.bairro || '',
        tipoLegislativo: materiaEditando?.tipoLegislativo || '',
        tema: materiaEditando?.tema || '',
        dataProtocolo: materiaEditando?.dataProtocolo || '',
        estadoTramitacao: materiaEditando?.estadoTramitacao || 'protocolado' as 'protocolado' | 'em_tramitacao' | 'aprovado' | 'rejeitado' | 'arquivado',
        observacoes: materiaEditando?.observacoes || ''
      })

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (materiaEditando) {
          setMateriasLegislativas(materiasLegislativas.map(m => 
            m.id === materiaEditando.id 
              ? { ...m, ...formData }
              : m
          ))
          setMateriaEditando(null)
          setMateriaLegislativaView('lista')
        }
      }

      return (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => {
                setMateriaLegislativaView('lista')
                setMateriaEditando(null)
              }}
              className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
            >
              ← Voltar à Lista
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Edit3 className="w-6 h-6 text-indigo-600" />
              Edição de Matéria Legislativa
            </h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                <input
                  type="text"
                  required
                  value={formData.numero}
                  onChange={(e) => setFormData({...formData, numero: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  {bairrosNomes.map(bairro => (
                    <option key={bairro} value={bairro}>{bairro}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Legislativo</label>
                <select
                  required
                  value={formData.tipoLegislativo}
                  onChange={(e) => setFormData({...formData, tipoLegislativo: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {tiposLegislativos.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                <input
                  type="text"
                  required
                  value={formData.tema}
                  onChange={(e) => setFormData({...formData, tema: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado da Tramitação</label>
                <select
                  value={formData.estadoTramitacao}
                  onChange={(e) => setFormData({...formData, estadoTramitacao: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {estadosTramitacao.map(estado => (
                    <option key={estado.id} value={estado.id}>{estado.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  rows={4}
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Observações sobre a tramitação, pareceres, etc."
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    switch (materiaLegislativaView) {
      case 'cadastro':
        return <CadastroMateria />
      case 'edicao':
        return <EdicaoMateria />
      default:
        return <ListaMaterias />
    }
  }

  // Componente de Listagem de Munícipes
  const ListagemMunicipes = () => {
    const filteredMunicipes = municipes.filter(municipe =>
      municipe.nome.toLowerCase().includes(searchMunicipes.toLowerCase()) ||
      municipe.email.toLowerCase().includes(searchMunicipes.toLowerCase()) ||
      municipe.bairro.toLowerCase().includes(searchMunicipes.toLowerCase()) ||
      municipe.whatsapp.includes(searchMunicipes)
    )

    const ListaMunicipes = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <List className="w-8 h-8 text-emerald-600" />
            Listagem de Munícipes
          </h1>
          <button 
            onClick={() => setMunicipesView('cadastro')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Munícipe
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisar por nome, email, bairro ou telefone..."
              value={searchMunicipes}
              onChange={(e) => setSearchMunicipes(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Munícipes</p>
                <p className="text-3xl font-bold text-emerald-600">{municipes.length}</p>
              </div>
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Masculino</p>
                <p className="text-3xl font-bold text-blue-600">
                  {municipes.filter(m => m.sexo === 'masculino').length}
                </p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Feminino</p>
                <p className="text-3xl font-bold text-pink-600">
                  {municipes.filter(m => m.sexo === 'feminino').length}
                </p>
              </div>
              <User className="w-8 h-8 text-pink-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bairros</p>
                <p className="text-3xl font-bold text-purple-600">
                  {new Set(municipes.map(m => m.bairro)).size}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Lista de Munícipes */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Lista de Munícipes ({filteredMunicipes.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredMunicipes.map((municipe) => (
              <div key={municipe.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{municipe.nome}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        municipe.sexo === 'feminino' 
                          ? 'bg-pink-100 text-pink-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {municipe.sexo === 'feminino' ? 'F' : 'M'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Email:</span> {municipe.email}
                      </div>
                      <div>
                        <span className="font-medium">WhatsApp:</span> {municipe.whatsapp}
                      </div>
                      <div>
                        <span className="font-medium">Bairro:</span> {municipe.bairro}
                      </div>
                      <div>
                        <span className="font-medium">Endereço:</span> {municipe.rua}
                      </div>
                      <div>
                        <span className="font-medium">Nascimento:</span> {new Date(municipe.nascimento).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <span className="font-medium">Idade:</span> {new Date().getFullYear() - new Date(municipe.nascimento).getFullYear()} anos
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setMunicipeEditando(municipe)
                        setMunicipesView('edicao')
                      }}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Editar munícipe"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir este munícipe?')) {
                          setMunicipes(municipes.filter(m => m.id !== municipe.id))
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir munícipe"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredMunicipes.length === 0 && (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum munícipe encontrado</h3>
                <p className="text-gray-600">
                  {searchMunicipes ? 'Tente ajustar os termos de pesquisa.' : 'Comece cadastrando o primeiro munícipe.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )

    const CadastroMunicipe = () => {
      const [formData, setFormData] = useState({
        nome: '',
        email: '',
        whatsapp: '',
        rua: '',
        bairro: '',
        nascimento: '',
        sexo: ''
      })

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const novoMunicipe: Municipe = {
          id: Math.max(...municipes.map(m => m.id)) + 1,
          ...formData
        }
        setMunicipes([...municipes, novoMunicipe])
        setFormData({
          nome: '',
          email: '',
          whatsapp: '',
          rua: '',
          bairro: '',
          nascimento: '',
          sexo: ''
        })
        setMunicipesView('lista')
      }

      return (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setMunicipesView('lista')}
              className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
            >
              ← Voltar à Lista
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-emerald-600" />
              Cadastro de Munícipe
            </h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                <select
                  required
                  value={formData.sexo}
                  onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rua e Número</label>
                <input
                  type="text"
                  required
                  value={formData.rua}
                  onChange={(e) => setFormData({...formData, rua: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Rua das Flores, 123"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                <input
                  type="date"
                  required
                  value={formData.nascimento}
                  onChange={(e) => setFormData({...formData, nascimento: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Cadastrar Munícipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    const EdicaoMunicipe = () => {
      const [formData, setFormData] = useState({
        nome: municipeEditando?.nome || '',
        email: municipeEditando?.email || '',
        whatsapp: municipeEditando?.whatsapp || '',
        rua: municipeEditando?.rua || '',
        bairro: municipeEditando?.bairro || '',
        nascimento: municipeEditando?.nascimento || '',
        sexo: municipeEditando?.sexo || ''
      })

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (municipeEditando) {
          setMunicipes(municipes.map(m => 
            m.id === municipeEditando.id 
              ? { ...m, ...formData }
              : m
          ))
          setMunicipeEditando(null)
          setMunicipesView('lista')
        }
      }

      return (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => {
                setMunicipesView('lista')
                setMunicipeEditando(null)
              }}
              className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
            >
              ← Voltar à Lista
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Edit3 className="w-6 h-6 text-emerald-600" />
              Edição de Munícipe
            </h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                  {bairrosNomes.map(bairro => (
                    <option key={bairro} value={bairro}>{bairro}</option>
                  ))}
                </select>
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rua e Número</label>
                <input
                  type="text"
                  required
                  value={formData.rua}
                  onChange={(e) => setFormData({...formData, rua: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                <input
                  type="date"
                  required
                  value={formData.nascimento}
                  onChange={(e) => setFormData({...formData, nascimento: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    switch (municipesView) {
      case 'cadastro':
        return <CadastroMunicipe />
      case 'edicao':
        return <EdicaoMunicipe />
      default:
        return <ListaMunicipes />
    }
  }

  const Marketing = () => {
    const CriadorPostagens = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-purple-600" />
            Criador de Postagens Automático
          </h2>
        </div>

        {/* Upload de Logo */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Image className="w-5 h-5" />
            Logo Padrão
          </h3>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="url"
                placeholder="Cole a URL do seu logo aqui..."
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors">
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
          
          {logoUrl && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Preview do Logo:</p>
              <img src={logoUrl} alt="Logo" className="h-16 w-auto rounded" />
            </div>
          )}
        </div>

        {/* Criador de Postagem */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Type className="w-5 h-5" />
            Criar Nova Postagem
          </h3>
          
          <div className="space-y-4">
            <textarea
              placeholder="Digite sua postagem aqui... Use [NOME], [BAIRRO], [DATA] para personalização automática"
              value={novaPostagem}
              onChange={(e) => setNovaPostagem(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            
            <div className="flex gap-3">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Wand2 className="w-4 h-4" />
                Gerar com IA
              </button>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Save className="w-4 h-4" />
                Salvar Template
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Send className="w-4 h-4" />
                Publicar Agora
              </button>
            </div>
          </div>
        </div>

        {/* Templates Salvos */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Templates Salvos ({templates.length})
          </h3>
          
          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{template.titulo}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        template.categoria === 'politica' ? 'bg-blue-100 text-blue-800' :
                        template.categoria === 'social' ? 'bg-green-100 text-green-800' :
                        template.categoria === 'aniversario' ? 'bg-pink-100 text-pink-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {template.categoria}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{template.conteudo}</p>
                    <p className="text-xs text-gray-500">
                      Última edição: {new Date(template.dataUltimaEdicao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Usar template">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )

    const TemplatesAniversario = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Cake className="w-7 h-7 text-pink-600" />
            Templates de Aniversário
          </h2>
        </div>

        {/* Template Masculino */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Template Masculino
          </h3>
          
          <div className="space-y-4">
            <textarea
              placeholder="Template para aniversários masculinos... Use [NOME] para personalização"
              value={templateAniversarioMasc}
              onChange={(e) => setTemplateAniversarioMasc(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <div className="flex gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Wand2 className="w-4 h-4" />
                Gerar com IA
              </button>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Save className="w-4 h-4" />
                Salvar Template
              </button>
            </div>
          </div>
        </div>

        {/* Template Feminino */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-pink-600" />
            Template Feminino
          </h3>
          
          <div className="space-y-4">
            <textarea
              placeholder="Template para aniversários femininos... Use [NOME] para personalização"
              value={templateAniversarioFem}
              onChange={(e) => setTemplateAniversarioFem(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            
            <div className="flex gap-3">
              <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Wand2 className="w-4 h-4" />
                Gerar com IA
              </button>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Save className="w-4 h-4" />
                Salvar Template
              </button>
            </div>
          </div>
        </div>

        {/* Configurações de Envio Automático */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-600" />
            Envio Automático por Email
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="envio-auto" className="w-4 h-4 text-emerald-600" />
                <label htmlFor="envio-auto" className="text-sm font-medium text-gray-700">
                  Ativar envio automático
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Envio</label>
                <input
                  type="time"
                  defaultValue="09:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dias de Antecedência</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="0">No dia do aniversário</option>
                  <option value="1">1 dia antes</option>
                  <option value="2">2 dias antes</option>
                  <option value="7">1 semana antes</option>
                </select>
              </div>
              
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Save className="w-4 h-4" />
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      </div>
    )

    const CalendarioPostagens = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-indigo-600" />
            Calendário de Postagens Políticas
          </h2>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Atualizar com IA
          </button>
        </div>

        {/* Calendário Visual */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
              <div key={dia} className="p-2 text-center font-medium text-gray-600 bg-gray-50 rounded">
                {dia}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const dia = i - 5 + 1 // Simulando janeiro 2024
              const temPostagem = Math.random() > 0.7
              
              return (
                <div
                  key={i}
                  className={`p-3 text-center border rounded-lg cursor-pointer transition-colors ${
                    dia > 0 && dia <= 31
                      ? temPostagem
                        ? 'bg-indigo-100 border-indigo-300 hover:bg-indigo-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                      : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  {dia > 0 && dia <= 31 && (
                    <>
                      <div className="font-medium text-gray-900">{dia}</div>
                      {temPostagem && (
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mx-auto mt-1"></div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Sugestões de IA */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Sugestões de Postagens por IA
          </h3>
          
          <div className="space-y-4">
            {[
              {
                data: '2024-01-20',
                titulo: 'Reunião sobre Mobilidade Urbana',
                conteudo: 'Que tal uma postagem sobre os avanços no transporte público da cidade? A IA sugere abordar as melhorias recentes.',
                categoria: 'Política'
              },
              {
                data: '2024-01-22',
                titulo: 'Dia da Educação',
                conteudo: 'Oportunidade para falar sobre investimentos em educação e as novas escolas que serão construídas.',
                categoria: 'Social'
              },
              {
                data: '2024-01-25',
                titulo: 'Aniversário da Cidade',
                conteudo: 'Post especial sobre a história da cidade e os projetos futuros para o desenvolvimento local.',
                categoria: 'Evento'
              }
            ].map((sugestao, index) => (
              <div key={index} className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-purple-800">
                        {new Date(sugestao.data).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {sugestao.categoria}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{sugestao.titulo}</h4>
                    <p className="text-sm text-gray-600">{sugestao.conteudo}</p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Aceitar sugestão">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Rejeitar">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )

    const DatasComemorativos = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Gift className="w-7 h-7 text-red-600" />
            Datas Comemorativas
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {datasComemorativos.map((data) => {
            const icones = {
              natal: TreePine,
              pascoa: Heart,
              'ano-novo': Sparkles,
              independencia: Flag,
              trabalho: Briefcase
            }
            
            const cores = {
              natal: 'text-green-600 bg-green-100',
              pascoa: 'text-purple-600 bg-purple-100',
              'ano-novo': 'text-yellow-600 bg-yellow-100',
              independencia: 'text-blue-600 bg-blue-100',
              trabalho: 'text-orange-600 bg-orange-100'
            }
            
            const IconeData = icones[data.tipo]
            
            return (
              <div key={data.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${cores[data.tipo]}`}>
                    <IconeData className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{data.nome}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(data.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Tipo de Mídia:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      data.tipoMidia === 'imagem' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {data.tipoMidia === 'imagem' ? 'Imagem' : 'Vídeo'}
                    </span>
                    {data.geradoPorIA && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        IA
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                      <Wand2 className="w-4 h-4" />
                      Gerar com IA
                    </button>
                    <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                      <Save className="w-4 h-4" />
                      Salvar
                    </button>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                      <Edit3 className="w-4 h-4" />
                      Editar
                    </button>
                  </div>
                  
                  {data.midia && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Mídia atual:</p>
                      {data.tipoMidia === 'imagem' ? (
                        <img src={data.midia} alt={data.nome} className="w-full h-32 object-cover rounded" />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Video className="w-4 h-4" />
                          <span className="text-sm">Vídeo anexado</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )

    const menuMarketing = [
      { id: 'criador', label: 'Criador de Postagens', icon: Sparkles },
      { id: 'templates', label: 'Templates', icon: Layout },
      { id: 'aniversarios', label: 'Aniversários', icon: Cake },
      { id: 'calendario', label: 'Calendário', icon: Calendar },
      { id: 'datas-comemorativas', label: 'Datas Comemorativas', icon: Gift }
    ]

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-purple-600" />
            Marketing Político
          </h1>
        </div>

        {/* Menu de Navegação do Marketing */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-wrap gap-2">
            {menuMarketing.map((item) => {
              const Icon = item.icon
              const isActive = marketingView === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => setMarketingView(item.id as MarketingView)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-purple-100 text-purple-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Conteúdo baseado na view ativa */}
        {marketingView === 'criador' && <CriadorPostagens />}
        {marketingView === 'templates' && <CriadorPostagens />}
        {marketingView === 'aniversarios' && <TemplatesAniversario />}
        {marketingView === 'calendario' && <CalendarioPostagens />}
        {marketingView === 'datas-comemorativas' && <DatasComemorativos />}
      </div>
    )
  }

  const Tarefas = () => {
    // Estatísticas das tarefas
    const tarefasPendentes = tarefas.filter(t => t.status === 'pendente').length
    const tarefasEmAndamento = tarefas.filter(t => t.status === 'em_andamento').length
    const tarefasConcluidas = tarefas.filter(t => t.status === 'concluida').length
    const tarefasUrgentes = tarefas.filter(t => t.prioridade === 'urgente' && t.status !== 'concluida').length

    // Estatísticas por assessor
    const estatisticasPorAssessor = assessores.map(assessor => {
      const tarefasAssessor = tarefas.filter(t => t.assessorId === assessor.id)
      const concluidas = tarefasAssessor.filter(t => t.status === 'concluida').length
      const pendentes = tarefasAssessor.filter(t => t.status === 'pendente').length
      const emAndamento = tarefasAssessor.filter(t => t.status === 'em_andamento').length
      const total = tarefasAssessor.length
      const percentualConclusao = total > 0 ? Math.round((concluidas / total) * 100) : 0

      return {
        assessor,
        total,
        concluidas,
        pendentes,
        emAndamento,
        percentualConclusao
      }
    })

    // Estatísticas por tipo de tarefa
    const estatisticasPorTipo = tiposTarefa.map(tipo => {
      const tarefasTipo = tarefas.filter(t => t.tipo === tipo.id)
      const concluidas = tarefasTipo.filter(t => t.status === 'concluida').length
      const total = tarefasTipo.length
      const percentualConclusao = total > 0 ? Math.round((concluidas / total) * 100) : 0

      return {
        tipo,
        total,
        concluidas,
        percentualConclusao
      }
    })

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-emerald-600" />
            Gestão de Tarefas
          </h1>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tarefas Pendentes</p>
                <p className="text-3xl font-bold text-orange-600">{tarefasPendentes}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-3xl font-bold text-blue-600">{tarefasEmAndamento}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-3xl font-bold text-green-600">{tarefasConcluidas}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgentes</p>
                <p className="text-3xl font-bold text-red-600">{tarefasUrgentes}</p>
              </div>
              <Zap className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Gráficos de Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance por Assessor */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Performance por Assessor
            </h2>
            
            <div className="space-y-4">
              {estatisticasPorAssessor.map(({ assessor, total, concluidas, percentualConclusao }) => (
                <div key={assessor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{assessor.nome}</p>
                      <p className="text-sm text-gray-600">{assessor.cargo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{concluidas}/{total}</p>
                      <p className="text-xs text-gray-600">tarefas</p>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full" 
                        style={{width: `${percentualConclusao}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-emerald-600 w-12">
                      {percentualConclusao}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance por Tipo de Tarefa */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Performance por Tipo
            </h2>
            
            <div className="space-y-4">
              {estatisticasPorTipo.map(({ tipo, total, concluidas, percentualConclusao }) => (
                <div key={tipo.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${tipo.color}`}>
                      {tipo.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{concluidas}/{total}</p>
                      <p className="text-xs text-gray-600">tarefas</p>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full" 
                        style={{width: `${percentualConclusao}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-emerald-600 w-12">
                      {percentualConclusao}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Tarefas */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ListTodo className="w-5 h-5" />
              Lista de Tarefas ({tarefas.length})
            </h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {tarefas
                .sort((a, b) => {
                  // Ordenar por: urgentes primeiro, depois por data de vencimento
                  if (a.prioridade === 'urgente' && b.prioridade !== 'urgente') return -1
                  if (b.prioridade === 'urgente' && a.prioridade !== 'urgente') return 1
                  return new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime()
                })
                .map((tarefa) => {
                  const assessor = assessores.find(a => a.id === tarefa.assessorId)
                  const tipoInfo = tiposTarefa.find(t => t.id === tarefa.tipo)
                  const isVencida = new Date(tarefa.dataVencimento) < new Date() && !tarefa.concluida
                  
                  const prioridadeColors = {
                    baixa: 'border-l-blue-500',
                    media: 'border-l-yellow-500',
                    alta: 'border-l-orange-500',
                    urgente: 'border-l-red-500'
                  }

                  const statusColors = {
                    pendente: 'bg-orange-100 text-orange-800',
                    em_andamento: 'bg-blue-100 text-blue-800',
                    concluida: 'bg-green-100 text-green-800',
                    cancelada: 'bg-gray-100 text-gray-800'
                  }

                  return (
                    <div 
                      key={tarefa.id} 
                      className={`p-4 border-l-4 ${prioridadeColors[tarefa.prioridade]} bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-colors ${
                        tarefa.concluida ? 'opacity-60' : ''
                      } ${isVencida ? 'bg-red-50' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => toggleTarefa(tarefa.id)}
                            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              tarefa.concluida 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'border-gray-300 hover:border-emerald-500'
                            }`}
                          >
                            {tarefa.concluida && <CheckCircle className="w-3 h-3" />}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className={`font-semibold ${tarefa.concluida ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {tarefa.titulo}
                              </h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${tipoInfo?.color}`}>
                                {tipoInfo?.label}
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[tarefa.status]}`}>
                                {tarefa.status.replace('_', ' ').toUpperCase()}
                              </span>
                              {isVencida && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  VENCIDA
                                </span>
                              )}
                            </div>
                            
                            <p className={`text-sm mb-3 ${tarefa.concluida ? 'text-gray-400' : 'text-gray-600'}`}>
                              {tarefa.descricao}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {assessor?.nome}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Vence: {new Date(tarefa.dataVencimento).toLocaleDateString('pt-BR')}
                              </div>
                              {tarefa.dataConclusao && (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Concluída: {new Date(tarefa.dataConclusao).toLocaleDateString('pt-BR')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                                setTarefas(tarefas.filter(t => t.id !== tarefa.id))
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir tarefa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Input para Nova Tarefa (estilo Microsoft To Do) */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3">
            <Plus className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={novaTarefa}
              onChange={(e) => setNovaTarefa(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  adicionarTarefa()
                }
              }}
              placeholder="Adicionar uma tarefa..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
            />
            <button
              onClick={adicionarTarefa}
              disabled={!novaTarefa.trim()}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              title="Adicionar tarefa"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard - Visão Geral do Mandato</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveScreen('cadastro-assessor')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Cadastrar Assessor
          </button>
          <button 
            onClick={() => setActiveScreen('listagem-municipes')}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <List className="w-4 h-4" />
            Listar Munícipe
          </button>
        </div>
      </div>

      {/* Termômetro de Pedidos Antigos */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-red-800 flex items-center gap-2">
            <Thermometer className="w-6 h-6" />
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
              <div key={pedido.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-100">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${intensidade}`}></div>
                    <h3 className="font-semibold text-gray-900">{pedido.titulo}</h3>
                    <span className="text-sm text-gray-600">- {municipe?.nome}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{pedido.bairro} • {pedido.categoria}</p>
                </div>
                <div className="text-right">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
              <p className="text-3xl font-bold text-emerald-600">{pedidos.length}</p>
            </div>
            <Phone className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos Pendentes</p>
              <p className="text-3xl font-bold text-red-600">{pedidos.filter(p => p.status === 'pendente').length}</p>
            </div>
            <Clock className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos Resolvidos</p>
              <p className="text-3xl font-bold text-green-600">{pedidos.filter(p => p.status === 'resolvido').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Matérias Legislativas</p>
              <p className="text-3xl font-bold text-indigo-600">{materiasLegislativas.length}</p>
            </div>
            <Scale className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Gráfico de Atividades */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Status dos Pedidos por Categoria
        </h2>
        
        <div className="space-y-4">
          {categoriasPedido.slice(0, 4).map(categoria => {
            const pedidosCategoria = pedidos.filter(p => p.categoria === categoria)
            const porcentagem = pedidosCategoria.length > 0 ? (pedidosCategoria.length / pedidos.length) * 100 : 0
            
            return (
              <div key={categoria} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                  <span className="font-medium">{categoria}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-64 bg-gray-200 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full" style={{width: `${porcentagem}%`}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{pedidosCategoria.length} pedidos</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const Bairros = () => {
    const filteredBairros = bairros.filter(bairro =>
      bairro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bairro.regiao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bairro.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const ListaBairros = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Bairros</h1>
          <button 
            onClick={() => setBairrosView('cadastro')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Bairro
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisar por nome, região ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Estatísticas dos Bairros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Bairros</p>
                <p className="text-3xl font-bold text-emerald-600">{bairros.length}</p>
              </div>
              <MapPin className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">População Total</p>
                <p className="text-3xl font-bold text-blue-600">
                  {bairros.reduce((total, bairro) => total + bairro.populacao, 0).toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Regiões</p>
                <p className="text-3xl font-bold text-purple-600">{regioes.length}</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Lista de Bairros */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Lista de Bairros ({filteredBairros.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredBairros.map((bairro) => (
              <div key={bairro.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{bairro.nome}</h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                        {bairro.regiao}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{bairro.descricao}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">População:</span> {bairro.populacao.toLocaleString()} habitantes
                      </div>
                      <div>
                        <span className="font-medium">Região:</span> {bairro.regiao}
                      </div>
                      <div>
                        <span className="font-medium">Cadastrado em:</span> {new Date(bairro.dataCadastro).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setBairroEditando(bairro)
                        setBairrosView('edicao')
                      }}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Editar bairro"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir este bairro?')) {
                          setBairros(bairros.filter(b => b.id !== bairro.id))
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir bairro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredBairros.length === 0 && (
              <div className="p-12 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum bairro encontrado</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Tente ajustar os termos de pesquisa.' : 'Comece cadastrando o primeiro bairro.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )

    const CadastroBairro = () => {
      const [formData, setFormData] = useState({
        nome: '',
        regiao: '',
        populacao: '',
        descricao: ''
      })

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const novoBairro: Bairro = {
          id: Math.max(...bairros.map(b => b.id)) + 1,
          nome: formData.nome,
          regiao: formData.regiao,
          populacao: parseInt(formData.populacao),
          descricao: formData.descricao,
          dataCadastro: new Date().toISOString().split('T')[0]
        }
        setBairros([...bairros, novoBairro])
        setFormData({
          nome: '',
          regiao: '',
          populacao: '',
          descricao: ''
        })
        setBairrosView('lista')
      }

      return (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setBairrosView('lista')}
              className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
            >
              ← Voltar à Lista
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-emerald-600" />
              Cadastro de Bairro
            </h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  min="1"
                  value={formData.populacao}
                  onChange={(e) => setFormData({...formData, populacao: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Ex: 10000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  required
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Descreva as características do bairro..."
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Cadastrar Bairro
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    const EdicaoBairro = () => {
      const [formData, setFormData] = useState({
        nome: bairroEditando?.nome || '',
        regiao: bairroEditando?.regiao || '',
        populacao: bairroEditando?.populacao.toString() || '',
        descricao: bairroEditando?.descricao || ''
      })

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (bairroEditando) {
          setBairros(bairros.map(b => 
            b.id === bairroEditando.id 
              ? { 
                  ...b, 
                  nome: formData.nome,
                  regiao: formData.regiao,
                  populacao: parseInt(formData.populacao),
                  descricao: formData.descricao
                }
              : b
          ))
          setBairroEditando(null)
          setBairrosView('lista')
        }
      }

      return (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => {
                setBairrosView('lista')
                setBairroEditando(null)
              }}
              className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
            >
              ← Voltar à Lista
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Edit3 className="w-6 h-6 text-emerald-600" />
              Edição de Bairro
            </h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Bairro</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                  min="1"
                  value={formData.populacao}
                  onChange={(e) => setFormData({...formData, populacao: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  required
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    switch (bairrosView) {
      case 'cadastro':
        return <CadastroBairro />
      case 'edicao':
        return <EdicaoBairro />
      default:
        return <ListaBairros />
    }
  }

  const Pedidos = () => {
    // Filtros aplicados
    const pedidosFiltrados = pedidos.filter(pedido => {
      const municipe = municipes.find(m => m.id === pedido.municipeId)
      const matchMorador = !filtroMorador || (municipe?.nome.toLowerCase().includes(filtroMorador.toLowerCase()))
      const matchBairro = !filtroBairro || pedido.bairro.toLowerCase().includes(filtroBairro.toLowerCase())
      const matchRua = !filtroRua || pedido.rua.toLowerCase().includes(filtroRua.toLowerCase())
      const matchStatus = !filtroStatus || pedido.status === filtroStatus
      const matchSearch = !searchTerm || 
        pedido.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (municipe?.nome.toLowerCase().includes(searchTerm.toLowerCase()))

      return matchMorador && matchBairro && matchRua && matchStatus && matchSearch
    })

    const ListaPedidos = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Pedidos</h1>
          <button 
            onClick={() => setPedidosView('cadastro')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Pedido
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Pesquisa
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Busca Geral</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Título, descrição, morador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Morador</label>
              <select
                value={filtroMorador}
                onChange={(e) => setFiltroMorador(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Todos os moradores</option>
                {municipes.map(municipe => (
                  <option key={municipe.id} value={municipe.nome}>{municipe.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
              <select
                value={filtroBairro}
                onChange={(e) => setFiltroBairro(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Todos os bairros</option>
                {bairrosNomes.map(bairro => (
                  <option key={bairro} value={bairro}>{bairro}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="resolvido">Resolvido</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFiltroMorador('')
                  setFiltroBairro('')
                  setFiltroRua('')
                  setFiltroStatus('')
                }}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Lista de Pedidos ({pedidosFiltrados.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {pedidosFiltrados.map((pedido) => {
              const municipe = municipes.find(m => m.id === pedido.municipeId)
              const diasSemResposta = calcularDiasSemResposta(pedido.dataAbertura, pedido.status)
              
              const statusColors = {
                pendente: 'bg-red-100 text-red-800',
                em_andamento: 'bg-yellow-100 text-yellow-800',
                resolvido: 'bg-green-100 text-green-800',
                cancelado: 'bg-gray-100 text-gray-800'
              }

              const prioridadeColors = {
                baixa: 'bg-blue-100 text-blue-800',
                media: 'bg-yellow-100 text-yellow-800',
                alta: 'bg-orange-100 text-orange-800',
                urgente: 'bg-red-100 text-red-800'
              }

              return (
                <div key={pedido.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{pedido.titulo}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[pedido.status]}`}>
                          {pedido.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${prioridadeColors[pedido.prioridade]}`}>
                          {pedido.prioridade.toUpperCase()}
                        </span>
                        {pedido.status === 'pendente' && diasSemResposta > 7 && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {diasSemResposta} dias
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{pedido.descricao}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Solicitante:</span> {municipe?.nome}
                        </div>
                        <div>
                          <span className="font-medium">Bairro:</span> {pedido.bairro}
                        </div>
                        <div>
                          <span className="font-medium">Categoria:</span> {pedido.categoria}
                        </div>
                        <div>
                          <span className="font-medium">Data:</span> {new Date(pedido.dataAbertura).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setPedidoDetalhes(pedido)
                          setPedidosView('detalhes')
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setPedidoEditando(pedido)
                          setPedidosView('edicao')
                        }}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Editar pedido"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este pedido?')) {
                            setPedidos(pedidos.filter(p => p.id !== pedido.id))
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir pedido"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {pedidosFiltrados.length === 0 && (
              <div className="p-12 text-center">
                <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                <p className="text-gray-600">
                  {searchTerm || filtroMorador || filtroBairro || filtroStatus ? 
                    'Tente ajustar os filtros de pesquisa.' : 
                    'Comece cadastrando o primeiro pedido.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )

    const CadastroPedido = () => {
      const [formData, setFormData] = useState({
        municipeId: '',
        titulo: '',
        descricao: '',
        categoria: '',
        prioridade: 'media' as 'baixa' | 'media' | 'alta' | 'urgente',
        bairro: '',
        rua: ''
      })

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const novoPedido: Pedido = {
          id: Math.max(...pedidos.map(p => p.id)) + 1,
          ...formData,
          municipeId: parseInt(formData.municipeId),
          status: 'pendente',
          dataAbertura: new Date().toISOString().split('T')[0]
        }
        setPedidos([...pedidos, novoPedido])
        setFormData({
          municipeId: '',
          titulo: '',
          descricao: '',
          categoria: '',
          prioridade: 'media',
          bairro: '',
          rua: ''
        })
        setPedidosView('lista')
      }

      return (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setPedidosView('lista')}
              className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
            >
              ← Voltar à Lista
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-emerald-600" />
              Cadastro de Pedido
            </h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Solicitante</label>
                <select
                  required
                  value={formData.municipeId}
                  onChange={(e) => setFormData({...formData, municipeId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Selecione o munícipe</option>
                  {municipes.map(municipe => (
                    <option key={municipe.id} value={municipe.id}>{municipe.nome}</option>
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Título do Pedido</label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Digite um título claro para o pedido"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Detalhada</label>
                <textarea
                  required
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Descreva detalhadamente o problema ou solicitação"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                <select
                  value={formData.prioridade}
                  onChange={(e) => setFormData({...formData, prioridade: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rua/Endereço</label>
                <input
                  type="text"
                  required
                  value={formData.rua}
                  onChange={(e) => setFormData({...formData, rua: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Rua, avenida ou local específico"
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Cadastrar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    const EdicaoPedido = () => {
      const [formData, setFormData] = useState({
        municipeId: pedidoEditando?.municipeId.toString() || '',
        titulo: pedidoEditando?.titulo || '',
        descricao: pedidoEditando?.descricao || '',
        categoria: pedidoEditando?.categoria || '',
        prioridade: pedidoEditando?.prioridade || 'media' as 'baixa' | 'media' | 'alta' | 'urgente',
        status: pedidoEditando?.status || 'pendente',
        bairro: pedidoEditando?.bairro || '',
        rua: pedidoEditando?.rua || '',
        resposta: pedidoEditando?.resposta || ''
      })

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (pedidoEditando) {
          const pedidoAtualizado = {
            ...pedidoEditando,
            ...formData,
            municipeId: parseInt(formData.municipeId),
            dataResposta: formData.resposta && !pedidoEditando.dataResposta ? 
              new Date().toISOString().split('T')[0] : pedidoEditando.dataResposta
          }
          
          setPedidos(pedidos.map(p => 
            p.id === pedidoEditando.id ? pedidoAtualizado : p
          ))
          setPedidoEditando(null)
          setPedidosView('lista')
        }
      }

      return (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => {
                setPedidosView('lista')
                setPedidoEditando(null)
              }}
              className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
            >
              ← Voltar à Lista
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Edit3 className="w-6 h-6 text-emerald-600" />
              Edição de Pedido
            </h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Solicitante</label>
                <select
                  required
                  value={formData.municipeId}
                  onChange={(e) => setFormData({...formData, municipeId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {municipes.map(municipe => (
                    <option key={municipe.id} value={municipe.id}>{municipe.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="pendente">Pendente</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="resolvido">Resolvido</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Título do Pedido</label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  required
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {categoriasPedido.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                <select
                  value={formData.prioridade}
                  onChange={(e) => setFormData({...formData, prioridade: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                <select
                  required
                  value={formData.bairro}
                  onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
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
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Resposta/Andamento</label>
                <textarea
                  rows={3}
                  value={formData.resposta}
                  onChange={(e) => setFormData({...formData, resposta: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Digite a resposta ou andamento do pedido..."
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    const DetalhesPedido = () => {
      if (!pedidoDetalhes) return null
      
      const municipe = municipes.find(m => m.id === pedidoDetalhes.municipeId)
      const diasSemResposta = calcularDiasSemResposta(pedidoDetalhes.dataAbertura, pedidoDetalhes.status)

      return (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => {
                setPedidosView('lista')
                setPedidoDetalhes(null)
              }}
              className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
            >
              ← Voltar à Lista
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Eye className="w-6 h-6 text-emerald-600" />
                Detalhes do Pedido
              </h1>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPedidoEditando(pedidoDetalhes)
                    setPedidosView('edicao')
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informações do Pedido */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Pedido</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Título</label>
                      <p className="text-gray-900 font-medium">{pedidoDetalhes.titulo}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descrição</label>
                      <p className="text-gray-900">{pedidoDetalhes.descricao}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Categoria</label>
                        <p className="text-gray-900">{pedidoDetalhes.categoria}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          pedidoDetalhes.prioridade === 'urgente' ? 'bg-red-100 text-red-800' :
                          pedidoDetalhes.prioridade === 'alta' ? 'bg-orange-100 text-orange-800' :
                          pedidoDetalhes.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {pedidoDetalhes.prioridade.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Localização */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Localização</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bairro</label>
                      <p className="text-gray-900">{pedidoDetalhes.bairro}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rua</label>
                      <p className="text-gray-900">{pedidoDetalhes.rua}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do Solicitante e Status */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Solicitante</h2>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="font-medium text-gray-900">{municipe?.nome}</p>
                    <p className="text-sm text-gray-600">{municipe?.email}</p>
                    <p className="text-sm text-gray-600">{municipe?.whatsapp}</p>
                    <p className="text-sm text-gray-600">{municipe?.rua}, {municipe?.bairro}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Status e Datas</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status Atual</label>
                      <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        pedidoDetalhes.status === 'pendente' ? 'bg-red-100 text-red-800' :
                        pedidoDetalhes.status === 'em_andamento' ? 'bg-yellow-100 text-yellow-800' :
                        pedidoDetalhes.status === 'resolvido' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {pedidoDetalhes.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data de Abertura</label>
                      <p className="text-gray-900">{new Date(pedidoDetalhes.dataAbertura).toLocaleDateString('pt-BR')}</p>
                    </div>
                    
                    {pedidoDetalhes.dataResposta && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Data de Resposta</label>
                        <p className="text-gray-900">{new Date(pedidoDetalhes.dataResposta).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                    
                    {pedidoDetalhes.status === 'pendente' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dias sem Resposta</label>
                        <p className={`font-bold ${diasSemResposta > 7 ? 'text-red-600' : 'text-gray-900'}`}>
                          {diasSemResposta} dias
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {pedidoDetalhes.resposta && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Resposta/Andamento</h2>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <p className="text-gray-900">{pedidoDetalhes.resposta}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    switch (pedidosView) {
      case 'cadastro':
        return <CadastroPedido />
      case 'edicao':
        return <EdicaoPedido />
      case 'detalhes':
        return <DetalhesPedido />
      default:
        return <ListaPedidos />
    }
  }

  const Contatos = () => {
    const filteredMunicipes = municipes.filter(municipe =>
      municipe.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      municipe.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      municipe.bairro.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const ListaMunicipes = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Contatos - Munícipes</h1>
          <button 
            onClick={() => setContatosView('cadastro')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Munícipe
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
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

        {/* Lista de Munícipes */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Lista de Munícipes ({filteredMunicipes.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredMunicipes.map((municipe) => (
              <div key={municipe.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{municipe.nome}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        municipe.sexo === 'feminino' 
                          ? 'bg-pink-100 text-pink-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {municipe.sexo === 'feminino' ? 'F' : 'M'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Email:</span> {municipe.email}
                      </div>
                      <div>
                        <span className="font-medium">WhatsApp:</span> {municipe.whatsapp}
                      </div>
                      <div>
                        <span className="font-medium">Bairro:</span> {municipe.bairro}
                      </div>
                      <div>
                        <span className="font-medium">Endereço:</span> {municipe.rua}
                      </div>
                      <div>
                        <span className="font-medium">Nascimento:</span> {new Date(municipe.nascimento).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setMunicipeEditando(municipe)
                        setContatosView('edicao')
                      }}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Editar munícipe"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir este munícipe?')) {
                          setMunicipes(municipes.filter(m => m.id !== municipe.id))
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir munícipe"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredMunicipes.length === 0 && (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum munícipe encontrado</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Tente ajustar os termos de pesquisa.' : 'Comece cadastrando o primeiro munícipe.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )

    const CadastroMunicipe = () => {
      const [formData, setFormData] = useState({
        nome: '',
        email: '',
        whatsapp: '',
        rua: '',
        bairro: '',
        nascimento: '',
        sexo: ''
      })

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const novoMunicipe: Municipe = {
          id: Math.max(...municipes.map(m => m.id)) + 1,
          ...formData
        }
        setMunicipes([...municipes, novoMunicipe])
        setFormData({
          nome: '',
          email: '',
          whatsapp: '',
          rua: '',
          bairro: '',
          nascimento: '',
          sexo: ''
        })
        setContatosView('lista')
      }

      return (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setContatosView('lista')}
              className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
            >
              ← Voltar à Lista
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-emerald-600" />
              Cadastro de Munícipe
            </h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                <select
                  required
                  value={formData.sexo}
                  onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rua e Número</label>
                <input
                  type="text"
                  required
                  value={formData.rua}
                  onChange={(e) => setFormData({...formData, rua: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Rua das Flores, 123"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                <input
                  type="date"
                  required
                  value={formData.nascimento}
                  onChange={(e) => setFormData({...formData, nascimento: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Cadastrar Munícipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    const EdicaoMunicipe = () => {
      const [formData, setFormData] = useState({
        nome: municipeEditando?.nome || '',
        email: municipeEditando?.email || '',
        whatsapp: municipeEditando?.whatsapp || '',
        rua: municipeEditando?.rua || '',
        bairro: municipeEditando?.bairro || '',
        nascimento: municipeEditando?.nascimento || '',
        sexo: municipeEditando?.sexo || ''
      })

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (municipeEditando) {
          setMunicipes(municipes.map(m => 
            m.id === municipeEditando.id 
              ? { ...m, ...formData }
              : m
          ))
          setMunicipeEditando(null)
          setContatosView('lista')
        }
      }

      return (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => {
                setContatosView('lista')
                setMunicipeEditando(null)
              }}
              className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
            >
              ← Voltar à Lista
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Edit3 className="w-6 h-6 text-emerald-600" />
              Edição de Munícipe
            </h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                  {bairrosNomes.map(bairro => (
                    <option key={bairro} value={bairro}>{bairro}</option>
                  ))}
                </select>
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rua e Número</label>
                <input
                  type="text"
                  required
                  value={formData.rua}
                  onChange={(e) => setFormData({...formData, rua: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                <input
                  type="date"
                  required
                  value={formData.nascimento}
                  onChange={(e) => setFormData({...formData, nascimento: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    switch (contatosView) {
      case 'cadastro':
        return <CadastroMunicipe />
      case 'edicao':
        return <EdicaoMunicipe />
      default:
        return <ListaMunicipes />
    }
  }

  // Componentes das outras abas (implementação básica)
  const TelaGenerica = ({ titulo, icone: Icone, descricao }: { titulo: string, icone: any, descricao: string }) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Icone className="w-8 h-8 text-emerald-600" />
          {titulo}
        </h1>
      </div>

      <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
        <Icone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{titulo}</h2>
        <p className="text-gray-600 mb-6">{descricao}</p>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Em Desenvolvimento
        </button>
      </div>
    </div>
  )

  const CadastroAssessor = () => {
    const [formData, setFormData] = useState({
      nome: '',
      email: '',
      whatsapp: '',
      cargo: '',
      rua: '',
      bairro: '',
      nascimento: '',
      senha: '',
      sexo: ''
    })

    const cargos = [
      'Assessor Parlamentar',
      'Chefe de Gabinete',
      'Assessor de Comunicação',
      'Assessor Jurídico',
      'Assessor Técnico',
      'Secretário(a)'
    ]

    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setActiveScreen('dashboard')}
            className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
          >
            ← Voltar ao Dashboard
          </button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-emerald-600" />
            Cadastro de Assessor Parlamentar
          </h1>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
              <input
                type="text"
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
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
              <select
                value={formData.cargo}
                onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Selecione o cargo</option>
                {cargos.map(cargo => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
              <select
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rua e Número</label>
              <input
                type="text"
                value={formData.rua}
                onChange={(e) => setFormData({...formData, rua: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Rua das Flores, 123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
              <input
                type="date"
                value={formData.nascimento}
                onChange={(e) => setFormData({...formData, nascimento: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
              <select
                value={formData.sexo}
                onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <input
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData({...formData, senha: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Digite uma senha segura"
              />
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Cadastrar Assessor
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />
      case 'contatos':
        return <Contatos />
      case 'pedidos':
        return <Pedidos />
      case 'bairros':
        return <Bairros />
      case 'materia-legislativa':
        return <MateriaLegislativa />
      case 'tarefas':
        return <Tarefas />
      case 'marketing':
        return <Marketing />
      case 'relatorios':
        return <TelaGenerica titulo="Relatórios" icone={BarChart} descricao="Relatórios e análises de desempenho" />
      case 'alertas':
        return <TelaGenerica titulo="Alertas" icone={Bell} descricao="Sistema de notificações e alertas" />
      case 'assinatura':
        return <AssinaturaDigital />
      case 'documentos':
        return <TelaGenerica titulo="Documentos" icone={FolderOpen} descricao="Arquivo e gestão de documentos" />
      case 'cadastro-assessor':
        return <CadastroAssessor />
      case 'listagem-municipes':
        return <ListagemMunicipes />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Menu Lateral */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Sistema Parlamentar</h2>
          <p className="text-sm text-gray-600 mt-1">Gestão de Mandato</p>
        </div>
        
        <nav className="mt-6">
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
                  if (item.id === 'marketing') {
                    setMarketingView('criador')
                  }
                }}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  isActive ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' : 'text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {activeScreen === 'dashboard' && 'Dashboard'}
                {activeScreen === 'contatos' && 'Contatos'}
                {activeScreen === 'pedidos' && 'Pedidos'}
                {activeScreen === 'bairros' && 'Bairros'}
                {activeScreen === 'materia-legislativa' && 'Matéria Legislativa'}
                {activeScreen === 'tarefas' && 'Tarefas'}
                {activeScreen === 'marketing' && 'Marketing'}
                {activeScreen === 'relatorios' && 'Relatórios'}
                {activeScreen === 'alertas' && 'Alertas'}
                {activeScreen === 'assinatura' && 'Assinatura'}
                {activeScreen === 'documentos' && 'Documentos'}
                {activeScreen === 'cadastro-assessor' && 'Cadastro de Assessor'}
                {activeScreen === 'listagem-municipes' && 'Listagem de Munícipes'}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Vereador João Silva</span>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="p-6">
          {renderScreen()}
        </main>
      </div>
    </div>
  )
}