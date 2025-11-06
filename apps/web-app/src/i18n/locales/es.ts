import type { Translations } from "./en";

export const es: Translations = {
  common: {
    language: "Idioma",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    add: "Agregar",
    search: "Buscar",
    filter: "Filtrar",
    actions: "Acciones",
    myProfile: "Mi perfil",
    myDashboard: "Mi Panel",
    client: "Cliente",
    platform: "Plataforma",
    product: "Producto",
    legal: "Legal",
    allRightsReserved: "Todos los derechos reservados",
    placeholders: {
      search: "Buscar...",
      searchByEmail: "Buscar por correo o nombre...",
      searchByNameOrEmail: "Buscar por nombre o correo...",
      searchBusiness: "Buscar negocio...",
      selectRole: "Selecciona un rol",
      selectUserType: "Tipo de Usuario",
      selectStatus: "Estado",
      selectTimezone: "Selecciona zona horaria",
      firstName: "Juan",
      lastName: "Pérez",
      countryCode: "Código",
      phone: "987654321",
      currentPassword: "Ingresa tu contraseña actual",
      newPassword: "Ingresa tu nueva contraseña",
      confirmNewPassword: "Confirma tu nueva contraseña",
    },
  },
  navigation: {
    dashboard: "Panel",
    employees: "Empleados",
    calendar: "Calendario",
    appointments: "Citas",
    services: "Servicios",
    locations: "Ubicaciones",
    clients: "Clientes",
    payments: "Pagos",
    notifications: "Notificaciones",
    settings: "Configuración",
    business: "Negocios",
    users: "Usuarios",
    aboutUs: "Nosotros",
    pricing: "Precios",
  },
  auth: {
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    fullName: "Nombre Completo",
    companyName: "Nombre de la Empresa",
    forgotPassword: "¿Olvidaste tu contraseña?",
    dontHaveAccount: "¿No tienes una cuenta?",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    signUp: "Regístrate",
    createAccount: "Crear una cuenta",
    creatingAccount: "Creando cuenta...",
    signingIn: "Iniciando sesión...",
    getStarted: "Comienza con TuAgenda",
    welcomeBack: "Bienvenido de vuelta",
    loginWith: "Inicia sesión con tu cuenta de Apple o Google",
    signUpWith: "Regístrate con tu cuenta de Apple o Google",
    orContinueWith: "O continúa con",
    loginWithApple: "Iniciar sesión con Apple",
    loginWithGoogle: "Iniciar sesión con Google",
    signUpWithApple: "Registrarse con Apple",
    signUpWithGoogle: "Registrarse con Google",
    termsAndPrivacy: "Al hacer clic en continuar, aceptas nuestros",
    and: "y",
    resetPassword: "Restablecer contraseña",
    resetPasswordDescription:
      "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.",
    sendResetLink: "Enviar enlace",
    backToLogin: "Volver al inicio de sesión",
    checkYourEmail: "Revisa tu correo",
    resetLinkSent:
      "Hemos enviado un enlace de restablecimiento de contraseña a tu correo electrónico.",
    errors: {
      signInFailed: "Error al iniciar sesión. Por favor intenta de nuevo.",
      signUpFailed: "Error al crear cuenta. Por favor intenta de nuevo.",
      googleSignInFailed:
        "Error al iniciar sesión con Google. Por favor intenta de nuevo.",
      googleSignUpFailed:
        "Error al registrarse con Google. Por favor intenta de nuevo.",
      passwordsDoNotMatch: "Las contraseñas no coinciden",
      passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
    },
    messages: {
      signingInWithGoogle: "Iniciando sesión con Google...",
      signingUpWithGoogle: "Registrándose con Google...",
      creatingAccount: "Creando tu cuenta...",
      welcome: "¡Bienvenido! 🎉",
      accountCreated: "¡Cuenta creada exitosamente! 🎉",
    },
    placeholders: {
      email: "correo@ejemplo.com",
      name: "Juan Pérez",
      password: "••••••••",
    },
  },
  legal: {
    termsOfService: "Términos de Servicio",
    privacyPolicy: "Política de Privacidad",
    lastUpdated: "Última actualización",
  },
  booking: {
    title: "Reservar una Cita",
    steps: {
      service: "Seleccionar Servicio",
      professional: "Seleccionar Profesional",
      date: "Seleccionar Fecha",
      time: "Seleccionar Hora",
      confirm: "Confirmar",
    },
    service: {
      title: "¿Qué servicio necesitas?",
      filterByLocation: "Filtrar por ubicación",
      filterByCategory: "Filtrar por categoría",
      locationInPerson: "Presencial",
      locationVirtual: "Virtual",
      allCategories: "Todas las Categorías",
      noServices: "No hay servicios disponibles",
    },
    professional: {
      title: "¿Con quién te gustaría agendar?",
      available: "Disponible",
      noStaff: "No hay profesionales disponibles",
    },
    date: {
      title: "¿Cuándo te gustaría tu cita?",
      selectDate: "Selecciona una fecha",
    },
    time: {
      title: "¿Qué hora te viene mejor?",
      available: "disponible",
      noSlots: "No hay horarios disponibles para esta fecha",
    },
    summary: {
      title: "Tu Selección",
      service: "Servicio",
      professional: "Profesional",
      date: "Fecha",
      time: "Hora",
      duration: "Duración",
      price: "Precio",
      clear: "Limpiar",
      continue: "Continuar",
      minutes: "min",
    },
    contact: {
      phone: "Teléfono",
      email: "Correo",
      location: "Ubicación",
      title: "Información de Contacto",
      description: "Completa tus datos para confirmar la reserva",
      alreadyHaveAccount: "¿Ya tienes una cuenta?",
      fullName: "Nombre Completo *",
      phoneNumber: "Teléfono *",
      emailAddress: "Correo Electrónico *",
      createAccountOption: "Crear una cuenta para futuras reservas",
      currentPassword: "Contraseña *",
      confirmPassword: "Confirmar Contraseña *",
      passwordHelp: "Mínimo 6 caracteres",
      placeholders: {
        fullName: "Juan Pérez",
        phone: "+51 999 888 777",
        email: "correo@ejemplo.com",
        password: "••••••••",
      },
    },
    payment: {
      title: "Método de Pago",
      description: "Selecciona cómo deseas realizar el pago",
      methods: {
        card: "Tarjeta de Crédito/Débito",
        cardDescription: "Pago seguro con tu tarjeta",
        cash: "Pago en el Local",
        cashDescription: "Paga cuando llegues a tu cita",
        wallet: "Billetera Digital",
        walletDescription: "Yape, Plin u otras billeteras",
      },
    },
    confirmation: {
      title: "¡Reserva Confirmada!",
      subtitle: "Tu cita ha sido agendada exitosamente",
      detailsTitle: "Detalles de tu Reserva",
      paymentMethod: "Método de pago",
      confirmationSent: "Confirmación enviada",
      confirmationEmail:
        "Hemos enviado un correo con todos los detalles de tu reserva a",
      calendarInvitation:
        "con la invitación para la videollamada. Puedes aceptar la invitación para que aparezca en tu calendario.",
      importantInfo: "Información importante para tu cita virtual",
      locationTitle: "Ubicación",
      howToGetThere: "Cómo llegar (Google Maps)",
      needToReschedule: "¿Necesitas reagendar o cancelar?",
      contactUs: "Contáctanos al",
      makeAnotherBooking: "Hacer otra Reserva",
      viewMyBookings: "Ver mis Reservas",
      needToCancelOrModify:
        "¿Necesitas cancelar o modificar tu cita? Contáctanos al",
      virtualInfo: {
        punctuality: "Ingresa puntualmente:",
        punctualityDescription:
          "Las citas virtuales no pueden extenderse más allá del tiempo programado.",
        duration: "Duración:",
        durationDescription:
          "El profesional estará disponible únicamente durante los",
        videoCallLink: "Enlace de videollamada:",
        videoCallDescription:
          "Revisa tu correo electrónico para acceder al enlace de la videollamada.",
        calendar: "Calendario:",
        calendarDescription:
          "Acepta la invitación del calendario para recibir recordatorios automáticos.",
      },
    },
  },
  landing: {
    footer: {
      description:
        "La plataforma profesional para gestionar tu negocio de forma eficiente.",
      copyright: "© 2025 TuAgenda. Todos los derechos reservados.",
    },
    hero: {
      title: "Gestiona tus citas con facilidad",
      subtitle:
        "La plataforma completa para gestionar tu negocio de servicios. Citas, clientes, empleados y más en un solo lugar.",
      cta: "Comenzar gratis",
      ctaSecondary: "Ver demo",
      badge: "Plataforma profesional de gestión",
      badgeAlt: "Software profesional",
      trustBadges: {
        freeTrial: "14 días gratis",
        noCard: "Sin tarjeta",
        cancelAnytime: "Cancela cuando quieras",
      },
      stats: {
        activeUsers: "Usuarios activos",
        uptime: "Tiempo activo",
        support: "Soporte",
      },
    },
    features: {
      title: "Todo lo que necesitas para hacer crecer tu negocio",
      subtitle: "Herramientas poderosas diseñadas para negocios de servicios",
      badge: "¿Por qué elegirnos?",
      sectionTitle: "La solución completa para tu negocio",
      sectionDescription:
        "Ayudamos a negocios de servicios, salones de belleza, profesionales de la salud y consultores a optimizar su tiempo y aumentar sus ingresos.",
      appointments: {
        title: "Citas Inteligentes",
        description:
          "Gestiona tu agenda de forma eficiente. Disponibilidad en tiempo real y recordatorios automáticos.",
      },
      clients: {
        title: "Gestión de Clientes",
        description:
          "Mantén el control de tus clientes, sus preferencias y el historial completo de citas.",
      },
      team: {
        title: "Colaboración en Equipo",
        description:
          "Coordina a tu equipo, asigna servicios y optimiza el tiempo de todos.",
      },
      analytics: {
        title: "Reportes y Análisis",
        description:
          "Toma decisiones informadas con reportes detallados sobre el rendimiento de tu negocio.",
      },
      multiLocation: {
        title: "Múltiples Ubicaciones",
        description:
          "Administra múltiples locales desde una sola plataforma centralizada.",
      },
      payments: {
        title: "Control de Pagos",
        description:
          "Rastrea pagos, genera facturas y administra las finanzas de tu negocio.",
      },
      quickFeatures: {
        fast: "Rápido y fácil",
        fastDescription:
          "Configura tu cuenta en minutos. Interfaz intuitiva que no requiere capacitación.",
        secure: "Datos seguros",
        secureDescription:
          "Encriptación de nivel empresarial. Tus datos y los de tus clientes están protegidos.",
        grow: "Crece más rápido",
        growDescription:
          "Analíticas en tiempo real para tomar mejores decisiones y aumentar tus ingresos.",
        saveTime: "Ahorra tiempo",
        saveTimeDescription:
          "Automatiza recordatorios, pagos y confirmaciones. Enfócate en lo importante.",
      },
      powerfullBadge: "Características poderosas",
      whyChooseUs: {
        badge: "¿Por qué elegirnos?",
        title: "La solución completa para tu negocio",
        description:
          "Diseñado específicamente para salones de belleza, spas, clínicas, gimnasios y cualquier negocio basado en citas. Potencia tu productividad y mejora la satisfacción de tus clientes.",
      },
      heroDescription:
        "Optimiza la gestión de citas, clientes y pagos de tu negocio. Ahorra tiempo, aumenta tus ingresos y ofrece una experiencia excepcional a tus clientes.",
    },
    howItWorks: {
      badge: "Proceso simple",
      title: "Cómo funciona",
      description:
        "Comienza en minutos con nuestro proceso simple y guiado. No necesitas conocimientos técnicos, todo es intuitivo y fácil de usar.",
      steps: {
        createAccount: {
          title: "Crea tu cuenta",
          description:
            "Regístrate gratis en menos de 2 minutos. Sin tarjeta de crédito requerida. Accede inmediatamente a todas las funciones premium durante tu prueba gratuita.",
        },
        setupBusiness: {
          title: "Configura tu negocio",
          description:
            "Personaliza servicios, horarios y equipo según tus necesidades. Configura tus métodos de pago, horarios de atención y branding. Todo desde un panel intuitivo.",
        },
        startManaging: {
          title: "Comienza a gestionar",
          description:
            "Recibe reservas, gestiona clientes y haz crecer tu negocio. Comparte tu link de reservas con tus clientes y deja que el sistema trabaje por ti.",
        },
      },
      illustrationPlaceholder: "Ilustración paso",
    },
    cta: {
      badge: "Comienza hoy",
      title: "¿Listo para transformar tu negocio?",
      subtitle: "Únete a miles de negocios que ya confían en TuAgenda",
      button: "Comenzar ahora",
      trustIndicators: {
        noCard: "Sin tarjeta de crédito",
        freeTrial: "Prueba gratuita 14 días",
        cancelAnytime: "Cancela cuando quieras",
      },
    },
    testimonials: {
      badge: "Testimonios",
      title: "Lo que dicen nuestros clientes",
      subtitle:
        "Miles de profesionales confían en TuAgenda para gestionar su negocio",
      testimonial1: {
        quote:
          "TuAgenda transformó cómo gestiono mis citas. ¡Mis pacientes aman los recordatorios automáticos!",
        name: "Dra. Ana García",
        role: "Psicóloga",
      },
      testimonial2: {
        quote:
          "Gestionar múltiples locales era una pesadilla. Ahora todo está centralizado y es eficiente.",
        name: "Carlos Mendoza",
        role: "Dueño de Salón",
      },
      testimonial3: {
        quote:
          "Los reportes me ayudan a tomar mejores decisiones para mi negocio. ¡Muy recomendado!",
        name: "Laura Torres",
        role: "Nutricionista",
      },
    },
  },
  pages: {
    aboutUs: {
      title: "Nosotros",
      subtitle: "Conoce más sobre TuAgenda y nuestra misión",
      mission: {
        title: "Nuestra Misión",
        description:
          "En TuAgenda, creemos que gestionar citas debe ser simple y eficiente. Nuestra misión es proporcionar a los negocios de servicios las mejores herramientas para administrar su tiempo, clientes y equipo de manera efectiva.",
      },
      story: {
        title: "Nuestra Historia",
        description:
          "Fundada en 2024, TuAgenda nació de la necesidad de simplificar la gestión de citas para profesionales de servicios. Comenzamos con una idea simple: crear una plataforma que combine poder y simplicidad, permitiendo a los dueños de negocios enfocarse en lo que mejor hacen - servir a sus clientes.",
      },
      values: {
        title: "Nuestros Valores",
        value1: {
          title: "Simplicidad",
          description:
            "Creemos que el software debe ser intuitivo y fácil de usar.",
        },
        value2: {
          title: "Innovación",
          description:
            "Mejoramos constantemente nuestra plataforma con funciones de vanguardia.",
        },
        value3: {
          title: "Soporte",
          description:
            "Nuestro equipo está siempre listo para ayudarte a tener éxito.",
        },
      },
    },
    pricing: {
      title: "Precios",
      subtitle: "Elige el plan perfecto para tu negocio",
      monthly: "Mensual",
      annual: "Anual",
      save20: "Ahorra 20%",
      perMonth: "/mes",
      getStarted: "Comenzar",
      free: {
        name: "Gratis",
        price: "0",
        description: "Perfecto para empezar",
        feature1: "Hasta 50 citas/mes",
        feature2: "1 ubicación",
        feature3: "Reportes básicos",
        feature4: "Soporte por email",
      },
      pro: {
        name: "Pro",
        price: "29",
        description: "Para negocios en crecimiento",
        feature1: "Citas ilimitadas",
        feature2: "Hasta 3 ubicaciones",
        feature3: "Reportes avanzados",
        feature4: "Soporte prioritario",
        feature5: "Marca personalizada",
        feature6: "Integraciones",
      },
      enterprise: {
        name: "Enterprise",
        price: "99",
        description: "Para grandes organizaciones",
        feature1: "Todo en Pro",
        feature2: "Ubicaciones ilimitadas",
        feature3: "Gerente de cuenta dedicado",
        feature4: "Soporte telefónico 24/7",
        feature5: "Desarrollo personalizado",
        feature6: "Garantía SLA",
      },
    },
    dashboard: {
      title: "Panel",
      welcome: "Bienvenido a tu panel",
    },
    employees: {
      title: "Empleados",
      addEmployee: "Agregar Empleado",
      employeeList: "Lista de Empleados",
    },
    calendar: {
      title: "Calendario",
      today: "Hoy",
      month: "Mes",
      week: "Semana",
      day: "Día",
    },
    appointments: {
      title: "Citas",
      newAppointment: "Nueva Cita",
      upcoming: "Próximas",
      past: "Pasadas",
    },
    services: {
      title: "Servicios",
      addService: "Agregar Servicio",
      serviceName: "Nombre del Servicio",
      duration: "Duración",
      price: "Precio",
    },
    locations: {
      title: "Ubicaciones",
      addLocation: "Agregar Ubicación",
      address: "Dirección",
      phone: "Teléfono",
    },
    clients: {
      title: "Clientes",
      addClient: "Agregar Cliente",
      clientList: "Lista de Clientes",
      name: "Nombre",
      email: "Correo electrónico",
      phone: "Teléfono",
    },
    business: {
      title: "Negocios",
      addBusiness: "Crear Negocio",
      editBusiness: "Editar Negocio",
      businessList: "Gestiona tus negocios",
      noBusiness: "No tienes negocios registrados",
      createFirst: "Crea tu primer negocio para comenzar",
      form: {
        title: "Título",
        slug: "Identificador único",
        description: "Descripción",
        email: "Correo electrónico",
        phone: "Teléfono",
        website: "Sitio web",
        address: "Dirección",
        city: "Ciudad",
        state: "Estado/Provincia",
        country: "País",
        postalCode: "Código postal",
        timeZone: "Zona horaria",
        locale: "Idioma",
        currency: "Moneda",
        status: "Estado",
        basicInfo: "Información Básica",
        contactInfo: "Información de Contacto",
        locationInfo: "Ubicación",
        regionalSettings: "Configuración Regional",
      },
      status: {
        active: "Activo",
        inactive: "Inactivo",
        suspended: "Suspendido",
      },
      actions: {
        save: "Guardar Negocio",
        cancel: "Cancelar",
        delete: "Eliminar Negocio",
        confirmDelete: "¿Estás seguro de eliminar este negocio?",
      },
    },
    payments: {
      title: "Pagos",
      amount: "Monto",
      status: "Estado",
      date: "Fecha",
      pending: "Pendiente",
      completed: "Completado",
      failed: "Fallido",
    },
    notifications: {
      title: "Notificaciones",
      markAsRead: "Marcar como leído",
      markAllAsRead: "Marcar todo como leído",
      noNotifications: "No hay notificaciones",
    },
    settings: {
      title: "Configuración",
      general: "General",
      profile: "Perfil",
      preferences: "Preferencias",
      language: "Idioma",
      theme: "Tema",
      notifications: "Notificaciones",
      account: "Cuenta",
    },
    profile: {
      title: "Configuración de Perfil",
      subtitle: "Administra la configuración y preferencias de tu cuenta",
      sections: {
        photo: "Foto de Perfil",
        photoDescription: "Tu foto de perfil se muestra en toda TuAgenda",
        personalInfo: "Información Personal",
        personalInfoDescription:
          "Actualiza tu información personal y datos de contacto",
        security: "Cambiar Contraseña",
        securityDescription:
          "Actualiza tu contraseña para mantener tu cuenta segura",
      },
      fields: {
        firstName: "Nombre",
        lastName: "Apellido",
        email: "Correo Electrónico",
        emailReadonly: "El correo no se puede cambiar",
        phone: "Número de Teléfono",
        phoneHelp: "Ingresa 9 dígitos sin espacios",
        birthday: "Fecha de Nacimiento",
        birthdayHelp: "Debes tener al menos 16 años",
        timezone: "Zona Horaria",
        currentPassword: "Contraseña Actual",
        newPassword: "Nueva Contraseña",
        newPasswordHelp: "Debe tener al menos 8 caracteres",
        confirmPassword: "Confirmar Nueva Contraseña",
      },
      actions: {
        saveChanges: "Guardar Cambios",
        changePassword: "Cambiar Contraseña",
      },
      messages: {
        profileUpdated: "Perfil actualizado exitosamente",
        passwordChanged: "Contraseña cambiada exitosamente",
      },
    },
  },
};
