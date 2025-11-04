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
          "Interface intuitiva que você pode aprender em minutos",
        secure: "Dados seguros",
        secureDescription:
          "Suas informações estão protegidas com os mais altos padrões de segurança",
        grow: "Cresça mais rápido",
        growDescription:
          "Ferramentas projetadas para ajudá-lo a escalar seu negócio",
        saveTime: "Economize tempo",
        saveTimeDescription:
          "Automatize tarefas repetitivas e foque no que importa",
      },
      powerfullBadge: "Recursos poderosos",
    },
    howItWorks: {
      badge: "Processo simples",
      title: "Como funciona",
      description:
        "Comece em minutos com nosso simples processo de três etapas. Não é necessário conhecimento técnico.",
      steps: {
        createAccount: {
          title: "Crie sua conta",
          description:
            "Cadastre-se gratuitamente e comece a configurar seu negócio em minutos",
        },
        setupBusiness: {
          title: "Configure seu negócio",
          description:
            "Adicione seus serviços, equipe e horários de disponibilidade",
        },
        startManaging: {
          title: "Comece a gerenciar",
          description:
            "Receba reservas e gerencie seu negócio de qualquer lugar",
        },
      },
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
  },
};
