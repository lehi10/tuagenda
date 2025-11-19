import type { Translations } from "./en";

export const pt: Translations = {
  common: {
    language: "Idioma",
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    edit: "Editar",
    add: "Adicionar",
    search: "Buscar",
    filter: "Filtrar",
    actions: "Ações",
    myProfile: "Meu Perfil",
    myDashboard: "Meu Painel",
    client: "Cliente",
    platform: "Plataforma",
    product: "Produto",
    legal: "Legal",
    allRightsReserved: "Todos os direitos reservados",
    noOrganizationSelected: "Nenhuma organização selecionada",
    noOrganizationMessage:
      "Você não tem uma organização atribuída. Por favor, entre em contato com seu administrador.",
    placeholders: {
      search: "Buscar...",
      searchByEmail: "Buscar por e-mail ou nome...",
      searchByNameOrEmail: "Buscar por nome ou e-mail...",
      searchBusiness: "Buscar negócio...",
      selectRole: "Selecione uma função",
      selectUserType: "Tipo de Usuário",
      selectStatus: "Status",
      selectTimezone: "Selecione o fuso horário",
      firstName: "João",
      lastName: "Silva",
      countryCode: "Código",
      phone: "987654321",
      currentPassword: "Digite sua senha atual",
      newPassword: "Digite sua nova senha",
      confirmNewPassword: "Confirme sua nova senha",
    },
  },
  navigation: {
    dashboard: "Painel",
    employees: "Funcionários",
    calendar: "Calendário",
    appointments: "Agendamentos",
    services: "Serviços",
    locations: "Locais",
    clients: "Clientes",
    payments: "Pagamentos",
    notifications: "Notificações",
    settings: "Configurações",
    business: "Negócios",
    users: "Usuários",
    aboutUs: "Sobre Nós",
    pricing: "Preços",
    features: "Recursos",
    industries: "Casos de Uso",
    contact: "Contato",
    integrations: "Integrações",
  },
  auth: {
    login: "Entrar",
    logout: "Sair",
    email: "E-mail",
    password: "Senha",
    confirmPassword: "Confirmar Senha",
    fullName: "Nome Completo",
    companyName: "Nome da Empresa",
    forgotPassword: "Esqueceu sua senha?",
    dontHaveAccount: "Não tem uma conta?",
    alreadyHaveAccount: "Já tem uma conta?",
    signUp: "Cadastre-se",
    createAccount: "Criar uma conta",
    creatingAccount: "Criando conta...",
    signingIn: "Entrando...",
    getStarted: "Comece com TuAgenda",
    welcomeBack: "Bem-vindo de volta",
    loginWith: "Entre com sua conta Apple ou Google",
    signUpWith: "Cadastre-se com sua conta Apple ou Google",
    orContinueWith: "Ou continue com",
    loginWithApple: "Entrar com Apple",
    loginWithGoogle: "Entrar com Google",
    signUpWithApple: "Cadastrar com Apple",
    signUpWithGoogle: "Cadastrar com Google",
    termsAndPrivacy: "Ao clicar em continuar, você concorda com nossos",
    and: "e",
    resetPassword: "Redefinir senha",
    resetPasswordDescription:
      "Digite seu endereço de e-mail e enviaremos um link para redefinir sua senha.",
    sendResetLink: "Enviar link",
    backToLogin: "Voltar ao login",
    checkYourEmail: "Verifique seu e-mail",
    resetLinkSent:
      "Enviamos um link de redefinição de senha para seu endereço de e-mail.",
    errors: {
      signInFailed: "Falha ao entrar. Por favor, tente novamente.",
      signUpFailed: "Falha ao criar conta. Por favor, tente novamente.",
      googleSignInFailed:
        "Falha ao entrar com Google. Por favor, tente novamente.",
      googleSignUpFailed:
        "Falha ao cadastrar com Google. Por favor, tente novamente.",
      passwordsDoNotMatch: "As senhas não coincidem",
      passwordTooShort: "A senha deve ter pelo menos 6 caracteres",
    },
    messages: {
      signingInWithGoogle: "Entrando com Google...",
      signingUpWithGoogle: "Cadastrando com Google...",
      creatingAccount: "Criando sua conta...",
      welcome: "Bem-vindo! 🎉",
      accountCreated: "Conta criada com sucesso! 🎉",
    },
    placeholders: {
      email: "email@exemplo.com",
      name: "João Silva",
      password: "••••••••",
    },
  },
  legal: {
    termsOfService: "Termos de Serviço",
    privacyPolicy: "Política de Privacidade",
    lastUpdated: "Última atualização",
  },
  booking: {
    title: "Agendar uma Consulta",
    steps: {
      service: "Selecionar Serviço",
      professional: "Selecionar Profissional",
      date: "Selecionar Data",
      time: "Selecionar Horário",
      confirm: "Confirmar",
    },
    service: {
      title: "Qual serviço você precisa?",
      filterByLocation: "Filtrar por local",
      filterByCategory: "Filtrar por categoria",
      locationInPerson: "Presencial",
      locationVirtual: "Virtual",
      allCategories: "Todas as Categorias",
      noServices: "Nenhum serviço disponível",
    },
    professional: {
      title: "Com quem você gostaria de agendar?",
      available: "Disponível",
      noStaff: "Nenhum profissional disponível",
    },
    date: {
      title: "Quando você gostaria de sua consulta?",
      selectDate: "Selecione uma data",
    },
    time: {
      title: "Qual horário é melhor para você?",
      available: "disponível",
      noSlots: "Nenhum horário disponível para esta data",
    },
    summary: {
      title: "Sua Seleção",
      service: "Serviço",
      professional: "Profissional",
      date: "Data",
      time: "Horário",
      duration: "Duração",
      price: "Preço",
      clear: "Limpar",
      continue: "Continuar",
      minutes: "min",
    },
    contact: {
      phone: "Telefone",
      email: "E-mail",
      location: "Local",
      title: "Informações de Contato",
      description: "Complete seus dados para confirmar a reserva",
      alreadyHaveAccount: "Já tem uma conta?",
      fullName: "Nome Completo *",
      phoneNumber: "Telefone *",
      emailAddress: "E-mail *",
      createAccountOption: "Criar uma conta para futuras reservas",
      currentPassword: "Senha *",
      confirmPassword: "Confirmar Senha *",
      passwordHelp: "Mínimo 6 caracteres",
      placeholders: {
        fullName: "João Silva",
        phone: "+55 999 888 777",
        email: "email@exemplo.com",
        password: "••••••••",
      },
    },
    payment: {
      title: "Método de Pagamento",
      description: "Selecione como você gostaria de pagar",
      methods: {
        card: "Cartão de Crédito/Débito",
        cardDescription: "Pagamento seguro com seu cartão",
        cash: "Pagar no Local",
        cashDescription: "Pague quando chegar para seu agendamento",
        wallet: "Carteira Digital",
        walletDescription: "Pague com carteiras digitais",
      },
    },
    confirmation: {
      title: "Reserva Confirmada!",
      subtitle: "Seu agendamento foi realizado com sucesso",
      detailsTitle: "Detalhes da sua Reserva",
      paymentMethod: "Método de pagamento",
      confirmationSent: "Confirmação enviada",
      confirmationEmail:
        "Enviamos um e-mail com todos os detalhes da sua reserva para",
      calendarInvitation:
        "com o convite para a videochamada. Você pode aceitar o convite para que apareça no seu calendário.",
      importantInfo: "Informações importantes sobre seu agendamento virtual",
      locationTitle: "Localização",
      howToGetThere: "Como chegar (Google Maps)",
      needToReschedule: "Precisa reagendar ou cancelar?",
      contactUs: "Entre em contato conosco em",
      makeAnotherBooking: "Fazer Outra Reserva",
      viewMyBookings: "Ver Minhas Reservas",
      needToCancelOrModify:
        "Precisa cancelar ou modificar seu agendamento? Entre em contato conosco em",
      virtualInfo: {
        punctuality: "Entre pontualmente:",
        punctualityDescription:
          "Agendamentos virtuais não podem ser estendidos além do horário programado.",
        duration: "Duração:",
        durationDescription:
          "O profissional estará disponível apenas durante o",
        videoCallLink: "Link da videochamada:",
        videoCallDescription:
          "Verifique seu e-mail para acessar o link da videochamada.",
        calendar: "Calendário:",
        calendarDescription:
          "Aceite o convite do calendário para receber lembretes automáticos.",
      },
    },
  },
  landing: {
    footer: {
      description:
        "A plataforma profissional para gerenciar seu negócio de forma eficiente.",
      copyright: "© 2025 TuAgenda. Todos os direitos reservados.",
    },
    hero: {
      title: "Gerencie seus agendamentos com facilidade",
      subtitle:
        "A plataforma completa para gerenciar seu negócio de serviços. Agendamentos, clientes, funcionários e muito mais em um só lugar.",
      cta: "Começar gratuitamente",
      ctaSecondary: "Ver demonstração",
      badge: "Plataforma profissional de gestão",
      badgeAlt: "Software profissional",
      trustBadges: {
        freeTrial: "14 dias grátis",
        noCard: "Sem cartão",
        cancelAnytime: "Cancele quando quiser",
      },
      stats: {
        activeUsers: "Usuários ativos",
        uptime: "Tempo ativo",
        support: "Suporte",
      },
    },
    features: {
      title: "Tudo o que você precisa para crescer seu negócio",
      subtitle: "Ferramentas poderosas projetadas para negócios de serviços",
      badge: "Por que nos escolher?",
      sectionTitle: "A solução completa para seu negócio",
      sectionDescription:
        "Ajudamos negócios de serviços, salões de beleza, profissionais de saúde e consultores a otimizar seu tempo e aumentar sua receita.",
      appointments: {
        title: "Agendamentos Inteligentes",
        description:
          "Gerencie sua agenda de forma eficiente. Disponibilidade em tempo real e lembretes automáticos.",
      },
      clients: {
        title: "Gestão de Clientes",
        description:
          "Mantenha o controle de seus clientes, suas preferências e histórico completo de agendamentos.",
      },
      team: {
        title: "Colaboração em Equipe",
        description:
          "Coordene sua equipe, atribua serviços e otimize o tempo de todos.",
      },
      analytics: {
        title: "Relatórios e Análises",
        description:
          "Tome decisões informadas com relatórios detalhados sobre o desempenho do seu negócio.",
      },
      multiLocation: {
        title: "Múltiplos Locais",
        description:
          "Gerencie múltiplos locais a partir de uma única plataforma centralizada.",
      },
      payments: {
        title: "Controle de Pagamentos",
        description:
          "Rastreie pagamentos, gere faturas e gerencie as finanças do seu negócio.",
      },
      quickFeatures: {
        fast: "Rápido e fácil",
        fastDescription:
          "Configure sua conta em minutos. Interface intuitiva que não requer treinamento.",
        secure: "Dados seguros",
        secureDescription:
          "Criptografia de nível empresarial. Seus dados e os de seus clientes estão protegidos.",
        grow: "Cresça mais rápido",
        growDescription:
          "Análises em tempo real para tomar melhores decisões e aumentar sua receita.",
        saveTime: "Economize tempo",
        saveTimeDescription:
          "Automatize lembretes, pagamentos e confirmações. Foque no que importa.",
      },
      powerfullBadge: "Recursos poderosos",
      whyChooseUs: {
        badge: "Por que nos escolher?",
        title: "A solução completa para seu negócio",
        description:
          "Projetado especificamente para salões de beleza, spas, clínicas, academias e qualquer negócio baseado em agendamentos. Aumente sua produtividade e melhore a satisfação do cliente.",
      },
      heroDescription:
        "Otimize o gerenciamento de agendamentos, clientes e pagamentos do seu negócio. Economize tempo, aumente sua receita e ofereça uma experiência excepcional aos seus clientes.",
    },
    howItWorks: {
      badge: "Processo simples",
      title: "Como funciona",
      description:
        "Comece em minutos com nosso processo simples e guiado. Não precisa de conhecimento técnico, tudo é intuitivo e fácil de usar.",
      steps: {
        createAccount: {
          title: "Crie sua conta",
          description:
            "Cadastre-se gratuitamente em menos de 2 minutos. Sem necessidade de cartão de crédito. Acesse imediatamente todos os recursos premium durante seu teste gratuito.",
        },
        setupBusiness: {
          title: "Configure seu negócio",
          description:
            "Personalize serviços, horários e equipe de acordo com suas necessidades. Configure seus métodos de pagamento, horário de funcionamento e marca. Tudo a partir de um painel intuitivo.",
        },
        startManaging: {
          title: "Comece a gerenciar",
          description:
            "Receba reservas, gerencie clientes e faça seu negócio crescer. Compartilhe seu link de reservas com seus clientes e deixe o sistema trabalhar por você.",
        },
      },
      illustrationPlaceholder: "Ilustração passo",
    },
    cta: {
      badge: "Comece hoje",
      title: "Pronto para transformar seu negócio?",
      subtitle: "Junte-se a milhares de negócios que já confiam no TuAgenda",
      button: "Começar agora",
      trustIndicators: {
        noCard: "Sem cartão de crédito",
        freeTrial: "Teste gratuito de 14 dias",
        cancelAnytime: "Cancele quando quiser",
      },
    },
    testimonials: {
      badge: "Depoimentos",
      title: "O que nossos clientes dizem",
      subtitle:
        "Milhares de profissionais confiam no TuAgenda para gerenciar seus negócios",
      testimonial1: {
        quote:
          "TuAgenda transformou como gerencio meus agendamentos. Meus pacientes adoram os lembretes automáticos!",
        name: "Dra. Ana García",
        role: "Psicóloga",
      },
      testimonial2: {
        quote:
          "Gerenciar múltiplos locais era um pesadelo. Agora tudo está centralizado e eficiente.",
        name: "Carlos Mendoza",
        role: "Dono de Salão",
      },
      testimonial3: {
        quote:
          "Os relatórios me ajudam a tomar melhores decisões para meu negócio. Altamente recomendado!",
        name: "Laura Torres",
        role: "Nutricionista",
      },
    },
  },
  pages: {
    aboutUs: {
      title: "Sobre Nós",
      subtitle: "Saiba mais sobre o TuAgenda e nossa missão",
      mission: {
        title: "Nossa Missão",
        description:
          "No TuAgenda, acreditamos que gerenciar agendamentos deve ser simples e eficiente. Nossa missão é fornecer aos negócios de serviços as melhores ferramentas para gerenciar seu tempo, clientes e equipe de forma eficaz.",
      },
      story: {
        title: "Nossa História",
        description:
          "Fundado em 2024, o TuAgenda nasceu da necessidade de simplificar o gerenciamento de agendamentos para profissionais de serviços. Começamos com uma ideia simples: criar uma plataforma que combine poder e simplicidade, permitindo que os proprietários de negócios se concentrem no que fazem de melhor - servir seus clientes.",
      },
      values: {
        title: "Nossos Valores",
        value1: {
          title: "Simplicidade",
          description:
            "Acreditamos que o software deve ser intuitivo e fácil de usar.",
        },
        value2: {
          title: "Inovação",
          description:
            "Melhoramos constantemente nossa plataforma com recursos de ponta.",
        },
        value3: {
          title: "Suporte",
          description:
            "Nossa equipe está sempre pronta para ajudá-lo a ter sucesso.",
        },
      },
    },
    pricing: {
      title: "Preços",
      subtitle: "Escolha o plano perfeito para seu negócio",
      monthly: "Mensal",
      annual: "Anual",
      save20: "Economize 20%",
      perMonth: "/mês",
      getStarted: "Começar",
      free: {
        name: "Grátis",
        price: "0",
        description: "Perfeito para começar",
        feature1: "Até 50 agendamentos/mês",
        feature2: "1 local",
        feature3: "Relatórios básicos",
        feature4: "Suporte por e-mail",
      },
      pro: {
        name: "Pro",
        price: "29",
        description: "Para negócios em crescimento",
        feature1: "Agendamentos ilimitados",
        feature2: "Até 3 locais",
        feature3: "Relatórios avançados",
        feature4: "Suporte prioritário",
        feature5: "Marca personalizada",
        feature6: "Integrações",
      },
      enterprise: {
        name: "Enterprise",
        price: "99",
        description: "Para grandes negócios",
        feature1: "Tudo no Pro",
        feature2: "Locais ilimitados",
        feature3: "Gerente de conta dedicado",
        feature4: "Suporte telefônico 24/7",
        feature5: "Desenvolvimento personalizado",
        feature6: "Garantia SLA",
      },
      comparison: {
        title: "Comparar Planos",
        subtitle: "Veja o que está incluído em cada plano",
        unlimited: "Ilimitado",
        perMonth: "/mês",
        categories: {
          coreFeatures: "Recursos Principais",
          advancedFeatures: "Recursos Avançados",
          support: "Suporte",
        },
        features: {
          appointments: "Agendamentos",
          locations: "Locais",
          staffMembers: "Membros da equipe",
          clientDatabase: "Base de dados de clientes",
          calendarSync: "Sincronização de calendário",
          customBranding: "Marca personalizada",
          integrations: "Integrações",
          apiAccess: "Acesso à API",
          advancedAnalytics: "Análises avançadas",
          customDevelopment: "Desenvolvimento personalizado",
          emailSupport: "Suporte por e-mail",
          prioritySupport: "Suporte prioritário",
          phoneSupport: "Suporte telefônico",
          dedicatedManager: "Gerente dedicado",
        },
      },
    },
    dashboard: {
      title: "Painel",
      welcome: "Bem-vindo ao seu painel",
    },
    employees: {
      title: "Funcionários",
      addEmployee: "Adicionar Funcionário",
      employeeList: "Lista de Funcionários",
    },
    calendar: {
      title: "Calendário",
      today: "Hoje",
      month: "Mês",
      week: "Semana",
      day: "Dia",
    },
    appointments: {
      title: "Agendamentos",
      newAppointment: "Novo Agendamento",
      upcoming: "Próximos",
      past: "Anteriores",
    },
    services: {
      title: "Serviços",
      addService: "Adicionar Serviço",
      serviceName: "Nome do Serviço",
      duration: "Duração",
      price: "Preço",
    },
    locations: {
      title: "Locais",
      addLocation: "Adicionar Local",
      address: "Endereço",
      phone: "Telefone",
    },
    clients: {
      title: "Clientes",
      addClient: "Adicionar Cliente",
      clientList: "Lista de Clientes",
      name: "Nome",
      email: "E-mail",
      phone: "Telefone",
    },
    business: {
      title: "Negócios",
      addBusiness: "Criar Negócio",
      editBusiness: "Editar Negócio",
      businessList: "Gerencie seus negócios",
      noBusiness: "Você não tem nenhum negócio registrado",
      createFirst: "Crie seu primeiro negócio para começar",
      form: {
        title: "Título",
        slug: "Identificador único",
        description: "Descrição",
        email: "E-mail",
        phone: "Telefone",
        website: "Site",
        address: "Endereço",
        city: "Cidade",
        state: "Estado/Província",
        country: "País",
        postalCode: "Código postal",
        timeZone: "Fuso horário",
        locale: "Idioma",
        currency: "Moeda",
        status: "Status",
        basicInfo: "Informações Básicas",
        contactInfo: "Informações de Contato",
        locationInfo: "Localização",
        regionalSettings: "Configurações Regionais",
      },
      status: {
        active: "Ativo",
        inactive: "Inativo",
        suspended: "Suspenso",
      },
      actions: {
        save: "Salvar Negócio",
        cancel: "Cancelar",
        delete: "Excluir Negócio",
        confirmDelete: "Tem certeza que deseja excluir este negócio?",
      },
    },
    payments: {
      title: "Pagamentos",
      amount: "Valor",
      status: "Status",
      date: "Data",
      pending: "Pendente",
      completed: "Concluído",
      failed: "Falhou",
    },
    notifications: {
      title: "Notificações",
      markAsRead: "Marcar como lido",
      markAllAsRead: "Marcar tudo como lido",
      noNotifications: "Sem notificações",
    },
    settings: {
      title: "Configurações",
      general: "Geral",
      profile: "Perfil",
      preferences: "Preferências",
      language: "Idioma",
      theme: "Tema",
      notifications: "Notificações",
      account: "Conta",
    },
    profile: {
      title: "Configurações do Perfil",
      subtitle: "Gerencie as configurações e preferências da sua conta",
      sections: {
        photo: "Foto do Perfil",
        photoDescription: "Sua foto de perfil é exibida em todo o TuAgenda",
        personalInfo: "Informações Pessoais",
        personalInfoDescription:
          "Atualize suas informações pessoais e dados de contato",
        security: "Alterar Senha",
        securityDescription: "Atualize sua senha para manter sua conta segura",
      },
      fields: {
        firstName: "Nome",
        lastName: "Sobrenome",
        email: "E-mail",
        emailReadonly: "O e-mail não pode ser alterado",
        phone: "Número de Telefone",
        phoneHelp: "Digite 9 dígitos sem espaços",
        birthday: "Data de Nascimento",
        birthdayHelp: "Você deve ter pelo menos 16 anos",
        timezone: "Fuso Horário",
        currentPassword: "Senha Atual",
        newPassword: "Nova Senha",
        newPasswordHelp: "Deve ter pelo menos 8 caracteres",
        confirmPassword: "Confirmar Nova Senha",
      },
      actions: {
        saveChanges: "Salvar Alterações",
        changePassword: "Alterar Senha",
      },
      messages: {
        profileUpdated: "Perfil atualizado com sucesso",
        passwordChanged: "Senha alterada com sucesso",
      },
    },
    features: {
      title: "Todos os Recursos",
      subtitle:
        "Tudo o que você precisa para gerenciar seu negócio eficientemente",
      badge: "Plataforma Completa",
      categories: {
        scheduling: {
          title: "Agendamento Inteligente",
          description: "Gestão inteligente de compromissos",
          features: {
            calendar: {
              title: "Calendário Interativo",
              description:
                "Visualize e gerencie todos os seus compromissos em um só lugar com funcionalidade de arrastar e soltar",
            },
            autoReminders: {
              title: "Lembretes Automáticos",
              description:
                "Reduza faltas com lembretes automáticos por e-mail e SMS",
            },
            multiLocation: {
              title: "Suporte Multi-localização",
              description:
                "Gerencie compromissos em múltiplas localizações do negócio",
            },
            recurring: {
              title: "Compromissos Recorrentes",
              description:
                "Configure compromissos semanais, mensais ou personalizados recorrentes",
            },
          },
        },
        clients: {
          title: "Gestão de Clientes",
          description: "Construa relacionamentos duradouros",
          features: {
            database: {
              title: "Banco de Dados de Clientes",
              description:
                "Armazene e organize todas as informações dos clientes em um lugar seguro",
            },
            history: {
              title: "Histórico de Compromissos",
              description:
                "Acompanhe o histórico completo de compromissos e serviços de cada cliente",
            },
            notes: {
              title: "Notas de Clientes",
              description:
                "Adicione notas privadas e preferências para atendimento personalizado",
            },
            communication: {
              title: "Comunicação Automatizada",
              description:
                "Envie confirmações de reserva e acompanhamentos automáticos",
            },
          },
        },
        team: {
          title: "Colaboração em Equipe",
          description: "Capacite sua equipe",
          features: {
            roles: {
              title: "Acesso Baseado em Funções",
              description:
                "Controle o que cada membro da equipe pode ver e fazer",
            },
            scheduling: {
              title: "Programação de Pessoal",
              description:
                "Gerencie disponibilidade e horários de trabalho da equipe",
            },
            performance: {
              title: "Acompanhamento de Desempenho",
              description:
                "Monitore métricas de desempenho individual e da equipe",
            },
            mobile: {
              title: "Acesso Móvel",
              description:
                "Membros da equipe podem acessar agendas de qualquer lugar",
            },
          },
        },
        analytics: {
          title: "Análises e Relatórios",
          description: "Decisões baseadas em dados",
          features: {
            dashboard: {
              title: "Painel em Tempo Real",
              description: "Veja suas métricas principais de relance",
            },
            revenue: {
              title: "Relatórios de Receita",
              description: "Acompanhe receitas, despesas e lucratividade",
            },
            clients: {
              title: "Análise de Clientes",
              description: "Entenda retenção, aquisição e comportamento",
            },
            export: {
              title: "Exportar Relatórios",
              description: "Baixe relatórios em formato CSV, PDF ou Excel",
            },
          },
        },
        payments: {
          title: "Processamento de Pagamentos",
          description: "Receba mais rápido",
          features: {
            online: {
              title: "Pagamentos Online",
              description:
                "Aceite cartões de crédito, débito e carteiras digitais",
            },
            deposits: {
              title: "Gestão de Depósitos",
              description: "Exija depósitos para reduzir faltas",
            },
            invoicing: {
              title: "Faturamento Automatizado",
              description: "Gere e envie faturas profissionais automaticamente",
            },
            tracking: {
              title: "Acompanhamento de Pagamentos",
              description: "Monitore todas as transações em tempo real",
            },
          },
        },
        integrations: {
          title: "Integrações",
          description: "Conecte suas ferramentas",
          features: {
            calendar: {
              title: "Sincronização de Calendário",
              description: "Sincronize com Google Calendar, Outlook e mais",
            },
            payments: {
              title: "Gateways de Pagamento",
              description: "Integre com Stripe, PayPal e outros",
            },
            marketing: {
              title: "Ferramentas de Marketing",
              description: "Conecte com Mailchimp, HubSpot e mais",
            },
            api: {
              title: "API Aberta",
              description: "Construa integrações personalizadas com nossa API",
            },
          },
        },
      },
      cta: {
        title: "Pronto para começar?",
        description: "Junte-se a milhares de negócios que já usam TuAgenda",
        button: "Iniciar Teste Gratuito",
      },
      imagePlaceholder: "Ilustração de recurso",
    },
    industries: {
      title: "Casos de Uso Reais",
      subtitle: "Soluções personalizadas para cada tipo de negócio",
      badge: "Casos de Uso",
      industries: {
        salons: {
          title: "Salões de Beleza e Barbearias",
          description: "Perfeito para negócios de estilismo",
          features: [
            "Gestão de menu de serviços",
            "Agendamento de estilistas",
            "Inventário de produtos",
            "Galeria de fotos de clientes",
          ],
          stats: "Usado por mais de 5.000 salões em todo o mundo",
        },
        spas: {
          title: "Spas e Bem-estar",
          description: "Relaxe e faça seu negócio de spa crescer",
          features: [
            "Pacotes de tratamentos",
            "Gestão de salas",
            "Programas de associação",
            "Certificados de presente",
          ],
          stats: "Confiado por mais de 3.000 spas",
        },
        medical: {
          title: "Médico e Odontológico",
          description: "Agendamento compatível com HIPAA",
          features: [
            "Registros de pacientes",
            "Rastreamento de seguros",
            "Gestão de prescrições",
            "Mensagens seguras",
          ],
          stats: "Atendendo mais de 2.000 prestadores de saúde",
        },
        fitness: {
          title: "Fitness e Yoga",
          description: "Energize seu negócio de fitness",
          features: [
            "Agendamento de aulas",
            "Gestão de associações",
            "Atribuição de treinadores",
            "Acompanhamento de progresso",
          ],
          stats: "Impulsionando mais de 4.000 estúdios de fitness",
        },
        beauty: {
          title: "Beleza e Cosméticos",
          description: "Fique bem, sinta-se ótimo",
          features: [
            "Personalização de serviços",
            "Fotos antes/depois",
            "Recomendações de produtos",
            "Programas de fidelidade",
          ],
          stats: "Escolhido por mais de 6.000 profissionais de beleza",
        },
        consulting: {
          title: "Consultoria e Coaching",
          description: "Agendamento de serviços profissionais",
          features: [
            "Reuniões virtuais",
            "Notas de sessão",
            "Compartilhamento de arquivos",
            "Pacotes de serviços",
          ],
          stats: "Usado por mais de 1.500 consultores",
        },
      },
      testimonials: {
        title: "Histórias de Sucesso",
        subtitle: "Veja como negócios como o seu estão prosperando",
      },
      cta: {
        title: "Encontre sua solução por indústria",
        button: "Começar Grátis",
      },
      imagePlaceholder: "Vitrine da indústria",
    },
    contact: {
      title: "Entre em Contato",
      subtitle: "Estamos aqui para ajudá-lo a ter sucesso",
      badge: "Fale Conosco",
      form: {
        title: "Envie-nos uma mensagem",
        description:
          "Preencha o formulário e nossa equipe responderá em 24 horas",
        name: "Nome Completo",
        namePlaceholder: "João Silva",
        email: "E-mail",
        emailPlaceholder: "joao@exemplo.com",
        subject: "Assunto",
        subjectPlaceholder: "Como podemos ajudar?",
        message: "Mensagem",
        messagePlaceholder: "Conte-nos mais sobre suas necessidades...",
        send: "Enviar Mensagem",
        sending: "Enviando...",
        success: "Mensagem enviada com sucesso!",
        error: "Falha ao enviar mensagem. Por favor, tente novamente.",
      },
      channels: {
        title: "Outras formas de nos contatar",
        email: {
          title: "E-mail",
          value: "support@tuagenda.com",
          description: "Respondemos em 24 horas",
        },
        phone: {
          title: "Telefone",
          value: "+1 (555) 123-4567",
          description: "Seg-Sex das 9h às 18h",
        },
        chat: {
          title: "Chat ao Vivo",
          value: "Disponível agora",
          description: "Converse com nossa equipe de suporte",
        },
      },
      faq: {
        title: "Perguntas Frequentes",
        subtitle: "Encontre respostas rápidas para perguntas comuns",
        questions: {
          trial: {
            question: "Como funciona o teste gratuito?",
            answer:
              "Nosso teste gratuito de 14 dias oferece acesso completo a todos os recursos. Não é necessário cartão de crédito. Você pode atualizar, fazer downgrade ou cancelar a qualquer momento.",
          },
          setup: {
            question: "Quanto tempo leva a configuração?",
            answer:
              "A maioria dos negócios está funcionando em menos de 15 minutos. Nosso assistente de integração o guia em cada etapa.",
          },
          support: {
            question: "Que tipo de suporte vocês oferecem?",
            answer:
              "Todos os planos incluem suporte por e-mail. Planos Pro e Enterprise têm suporte prioritário e telefônico respectivamente. Também temos documentação extensa e tutoriais em vídeo.",
          },
          data: {
            question: "Meus dados estão seguros?",
            answer:
              "Absolutamente. Usamos criptografia de nível bancário, backups regulares e cumprimos com GDPR e outras regulamentações de proteção de dados.",
          },
          migration: {
            question: "Vocês podem me ajudar a migrar de outra plataforma?",
            answer:
              "Sim! Nossa equipe pode ajudá-lo a migrar seus dados da maioria das principais plataformas. Entre em contato para um plano de migração personalizado.",
          },
          pricing: {
            question: "Posso mudar de plano depois?",
            answer:
              "Sim, você pode atualizar ou fazer downgrade do seu plano a qualquer momento. As alterações entram em vigor imediatamente e faremos o rateio da diferença.",
          },
        },
      },
      hours: {
        title: "Horário de Atendimento",
        timezone: "EST (Horário Padrão do Leste)",
        schedule: {
          weekdays: "Segunda - Sexta",
          weekdaysHours: "9:00 - 18:00",
          saturday: "Sábado",
          saturdayHours: "10:00 - 16:00",
          sunday: "Domingo",
          sundayHours: "Fechado",
        },
      },
    },
    integrations: {
      title: "Integrações",
      subtitle: "Conecte TuAgenda com suas ferramentas favoritas",
      badge: "Mais de 100 Integrações",
      categories: {
        all: "Todas",
        calendar: "Calendário",
        payments: "Pagamentos",
        marketing: "Marketing",
        communication: "Comunicação",
        productivity: "Produtividade",
      },
      featured: {
        title: "Integrações em Destaque",
        description: "Nossas conexões mais populares",
      },
      list: {
        googleCalendar: {
          name: "Google Calendar",
          description:
            "Sincronize compromissos com seu Google Calendar automaticamente",
          category: "calendar",
        },
        outlook: {
          name: "Microsoft Outlook",
          description:
            "Sincronização bidirecional com calendário e contatos do Outlook",
          category: "calendar",
        },
        stripe: {
          name: "Stripe",
          description: "Aceite pagamentos com segurança com Stripe",
          category: "payments",
        },
        paypal: {
          name: "PayPal",
          description: "Processe pagamentos através do PayPal",
          category: "payments",
        },
        mailchimp: {
          name: "Mailchimp",
          description: "Sincronize clientes com suas listas de e-mail",
          category: "marketing",
        },
        zoom: {
          name: "Zoom",
          description:
            "Crie reuniões Zoom automaticamente para compromissos virtuais",
          category: "communication",
        },
        slack: {
          name: "Slack",
          description: "Receba notificações de compromissos no Slack",
          category: "communication",
        },
        zapier: {
          name: "Zapier",
          description:
            "Conecte-se a mais de 3.000 aplicativos através do Zapier",
          category: "productivity",
        },
        hubspot: {
          name: "HubSpot",
          description: "Sincronize dados de clientes com HubSpot CRM",
          category: "marketing",
        },
        quickbooks: {
          name: "QuickBooks",
          description: "Sincronize faturas e pagamentos com QuickBooks",
          category: "payments",
        },
      },
      api: {
        title: "API para Desenvolvedores",
        description:
          "Construa integrações personalizadas com nossa poderosa API REST",
        features: [
          "Documentação abrangente",
          "Webhooks para atualizações em tempo real",
          "SDKs para linguagens populares",
          "Ambiente sandbox",
        ],
        cta: "Ver Documentação da API",
      },
      cta: {
        title: "Não encontrou sua ferramenta?",
        description:
          "Solicite uma nova integração ou construa a sua própria com nossa API",
        button: "Solicitar Integração",
      },
      imagePlaceholder: "Logo da integração",
    },
  },
};
