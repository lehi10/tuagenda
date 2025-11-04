import type { Translations } from "./en";

export const fr: Translations = {
  common: {
    language: "Langue",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    add: "Ajouter",
    search: "Rechercher",
    filter: "Filtrer",
    actions: "Actions",
    myProfile: "Mon profil",
    myDashboard: "Mon tableau de bord",
    client: "Client",
    platform: "Plateforme",
    product: "Produit",
    legal: "Légal",
    allRightsReserved: "Tous droits réservés",
    placeholders: {
      search: "Rechercher...",
      searchByEmail: "Rechercher par email ou nom...",
      searchByNameOrEmail: "Rechercher par nom ou email...",
      searchBusiness: "Rechercher entreprise...",
      selectRole: "Sélectionnez un rôle",
      selectUserType: "Type d'utilisateur",
      selectStatus: "Statut",
      selectTimezone: "Sélectionnez un fuseau horaire",
      firstName: "Jean",
      lastName: "Dupont",
      countryCode: "Code",
      phone: "987654321",
      currentPassword: "Entrez votre mot de passe actuel",
      newPassword: "Entrez votre nouveau mot de passe",
      confirmNewPassword: "Confirmez votre nouveau mot de passe",
    },
  },
  navigation: {
    dashboard: "Tableau de bord",
    employees: "Employés",
    calendar: "Calendrier",
    appointments: "Rendez-vous",
    services: "Services",
    locations: "Emplacements",
    clients: "Clients",
    payments: "Paiements",
    notifications: "Notifications",
    settings: "Paramètres",
    business: "Entreprises",
    users: "Utilisateurs",
    aboutUs: "À propos",
    pricing: "Tarifs",
  },
  auth: {
    login: "Se connecter",
    logout: "Se déconnecter",
    email: "Adresse e-mail",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    fullName: "Nom complet",
    companyName: "Nom de l'entreprise",
    forgotPassword: "Mot de passe oublié ?",
    dontHaveAccount: "Vous n'avez pas de compte ?",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    signUp: "S'inscrire",
    createAccount: "Créer un compte",
    creatingAccount: "Création du compte...",
    signingIn: "Connexion en cours...",
    getStarted: "Commencez avec TuAgenda",
    welcomeBack: "Bon retour",
    loginWith: "Connectez-vous avec votre compte Apple ou Google",
    signUpWith: "Inscrivez-vous avec votre compte Apple ou Google",
    orContinueWith: "Ou continuer avec",
    loginWithApple: "Se connecter avec Apple",
    loginWithGoogle: "Se connecter avec Google",
    signUpWithApple: "S'inscrire avec Apple",
    signUpWithGoogle: "S'inscrire avec Google",
    termsAndPrivacy: "En cliquant sur continuer, vous acceptez nos",
    and: "et",
    resetPassword: "Réinitialiser le mot de passe",
    resetPasswordDescription:
      "Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.",
    sendResetLink: "Envoyer le lien",
    backToLogin: "Retour à la connexion",
    checkYourEmail: "Vérifiez votre e-mail",
    resetLinkSent:
      "Nous avons envoyé un lien de réinitialisation de mot de passe à votre adresse e-mail.",
    errors: {
      signInFailed: "Erreur lors de la connexion. Veuillez réessayer.",
      signUpFailed: "Erreur lors de la création du compte. Veuillez réessayer.",
      googleSignInFailed:
        "Erreur lors de la connexion avec Google. Veuillez réessayer.",
      googleSignUpFailed:
        "Erreur lors de l'inscription avec Google. Veuillez réessayer.",
      passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
      passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
    },
    messages: {
      signingInWithGoogle: "Connexion avec Google...",
      signingUpWithGoogle: "Inscription avec Google...",
      creatingAccount: "Création de votre compte...",
      welcome: "Bienvenue ! 🎉",
      accountCreated: "Compte créé avec succès ! 🎉",
    },
    placeholders: {
      email: "email@exemple.com",
      name: "Jean Dupont",
      password: "••••••••",
    },
  },
  legal: {
    termsOfService: "Conditions d'utilisation",
    privacyPolicy: "Politique de confidentialité",
    lastUpdated: "Dernière mise à jour",
  },
  booking: {
    title: "Réserver un rendez-vous",
    steps: {
      service: "Sélectionner le service",
      professional: "Sélectionner le professionnel",
      date: "Sélectionner la date",
      time: "Sélectionner l'heure",
      confirm: "Confirmer",
    },
    service: {
      title: "Quel service avez-vous besoin ?",
      filterByLocation: "Filtrer par emplacement",
      filterByCategory: "Filtrer par catégorie",
      locationInPerson: "En personne",
      locationVirtual: "Virtuel",
      allCategories: "Toutes les catégories",
      noServices: "Aucun service disponible",
    },
    professional: {
      title: "Avec qui souhaitez-vous prendre rendez-vous ?",
      available: "Disponible",
      noStaff: "Aucun professionnel disponible",
    },
    date: {
      title: "Quand souhaitez-vous votre rendez-vous ?",
      selectDate: "Sélectionnez une date",
    },
    time: {
      title: "Quelle heure vous convient le mieux ?",
      available: "disponible",
      noSlots: "Aucun créneau disponible pour cette date",
    },
    summary: {
      title: "Votre sélection",
      service: "Service",
      professional: "Professionnel",
      date: "Date",
      time: "Heure",
      duration: "Durée",
      price: "Prix",
      clear: "Effacer",
      continue: "Continuer",
      minutes: "min",
    },
    contact: {
      phone: "Téléphone",
      email: "E-mail",
      location: "Emplacement",
      title: "Informations de contact",
      description: "Complétez vos informations pour confirmer la réservation",
      alreadyHaveAccount: "Vous avez déjà un compte ?",
      fullName: "Nom complet *",
      phoneNumber: "Téléphone *",
      emailAddress: "Adresse e-mail *",
      createAccountOption: "Créer un compte pour les réservations futures",
      currentPassword: "Mot de passe *",
      confirmPassword: "Confirmer le mot de passe *",
      passwordHelp: "Minimum 6 caractères",
      placeholders: {
        fullName: "Jean Dupont",
        phone: "+33 6 12 34 56 78",
        email: "email@exemple.com",
        password: "••••••••",
      },
    },
    payment: {
      title: "Mode de paiement",
      description: "Sélectionnez comment vous souhaitez payer",
      methods: {
        card: "Carte de crédit/débit",
        cardDescription: "Paiement sécurisé par carte",
        cash: "Paiement sur place",
        cashDescription: "Payez à votre arrivée au rendez-vous",
        wallet: "Portefeuille numérique",
        walletDescription: "PayPal, Apple Pay ou autres portefeuilles",
      },
    },
    confirmation: {
      title: "Réservation confirmée !",
      subtitle: "Votre rendez-vous a été programmé avec succès",
      detailsTitle: "Détails de votre réservation",
      paymentMethod: "Mode de paiement",
      confirmationSent: "Confirmation envoyée",
      confirmationEmail:
        "Nous avons envoyé un e-mail avec tous les détails de votre réservation à",
      calendarInvitation:
        "avec l'invitation pour l'appel vidéo. Vous pouvez accepter l'invitation pour qu'elle apparaisse dans votre calendrier.",
      importantInfo: "Informations importantes pour votre rendez-vous virtuel",
      locationTitle: "Emplacement",
      howToGetThere: "Comment s'y rendre (Google Maps)",
      needToReschedule: "Besoin de reporter ou d'annuler ?",
      contactUs: "Contactez-nous au",
      makeAnotherBooking: "Faire une autre réservation",
      viewMyBookings: "Voir mes réservations",
      needToCancelOrModify:
        "Besoin d'annuler ou de modifier votre rendez-vous ? Contactez-nous au",
      virtualInfo: {
        punctuality: "Rejoignez à l'heure :",
        punctualityDescription:
          "Les rendez-vous virtuels ne peuvent pas être prolongés au-delà de l'heure prévue.",
        duration: "Durée :",
        durationDescription:
          "Le professionnel sera disponible uniquement pendant",
        videoCallLink: "Lien de l'appel vidéo :",
        videoCallDescription:
          "Vérifiez votre e-mail pour accéder au lien de l'appel vidéo.",
        calendar: "Calendrier :",
        calendarDescription:
          "Acceptez l'invitation du calendrier pour recevoir des rappels automatiques.",
      },
    },
  },
  landing: {
    footer: {
      description:
        "La plateforme professionnelle pour gérer votre entreprise efficacement.",
      copyright: "© 2025 TuAgenda. Tous droits réservés.",
    },
    hero: {
      title: "Gérez vos rendez-vous facilement",
      subtitle:
        "La plateforme complète pour gérer votre entreprise de services. Rendez-vous, clients, employés et plus en un seul endroit.",
      cta: "Commencer gratuitement",
      ctaSecondary: "Voir la démo",
      badge: "Plateforme de gestion professionnelle",
      badgeAlt: "Logiciel professionnel",
      trustBadges: {
        freeTrial: "14 jours gratuits",
        noCard: "Sans carte",
        cancelAnytime: "Annulez quand vous voulez",
      },
      stats: {
        activeUsers: "Utilisateurs actifs",
        uptime: "Temps de disponibilité",
        support: "Support",
      },
    },
    features: {
      title: "Tout ce dont vous avez besoin pour développer votre entreprise",
      subtitle: "Outils puissants conçus pour les entreprises de services",
      badge: "Pourquoi nous choisir ?",
      sectionTitle: "La solution complète pour votre entreprise",
      sectionDescription:
        "Nous aidons les entreprises de services, salons de beauté, professionnels de santé et consultants à optimiser leur temps et augmenter leurs revenus.",
      appointments: {
        title: "Rendez-vous intelligents",
        description:
          "Gérez votre agenda efficacement. Disponibilité en temps réel et rappels automatiques.",
      },
      clients: {
        title: "Gestion des clients",
        description:
          "Gardez le contrôle de vos clients, leurs préférences et l'historique complet des rendez-vous.",
      },
      team: {
        title: "Collaboration d'équipe",
        description:
          "Coordonnez votre équipe, attribuez des services et optimisez le temps de tous.",
      },
      analytics: {
        title: "Rapports et analyses",
        description:
          "Prenez des décisions éclairées avec des rapports détaillés sur les performances de votre entreprise.",
      },
      multiLocation: {
        title: "Plusieurs emplacements",
        description:
          "Gérez plusieurs sites depuis une seule plateforme centralisée.",
      },
      payments: {
        title: "Contrôle des paiements",
        description:
          "Suivez les paiements, générez des factures et gérez les finances de votre entreprise.",
      },
      quickFeatures: {
        fast: "Rapide et facile",
        fastDescription:
          "Configurez votre compte en quelques minutes. Interface intuitive ne nécessitant aucune formation.",
        secure: "Données sécurisées",
        secureDescription:
          "Chiffrement de niveau entreprise. Vos données et celles de vos clients sont protégées.",
        grow: "Croissance rapide",
        growDescription:
          "Analyses en temps réel pour prendre de meilleures décisions et augmenter vos revenus.",
        saveTime: "Gagnez du temps",
        saveTimeDescription:
          "Automatisez les rappels, paiements et confirmations. Concentrez-vous sur l'essentiel.",
      },
      powerfullBadge: "Fonctionnalités puissantes",
      whyChooseUs: {
        badge: "Pourquoi nous choisir ?",
        title: "La solution complète pour votre entreprise",
        description:
          "Conçu spécifiquement pour les salons de beauté, spas, cliniques, gymnases et toute entreprise basée sur les rendez-vous. Boostez votre productivité et améliorez la satisfaction de vos clients.",
      },
      heroDescription:
        "Optimisez la gestion des rendez-vous, clients et paiements de votre entreprise. Gagnez du temps, augmentez vos revenus et offrez une expérience exceptionnelle à vos clients.",
    },
    howItWorks: {
      badge: "Processus simple",
      title: "Comment ça marche",
      description:
        "Commencez en quelques minutes avec notre processus simple et guidé. Aucune connaissance technique requise, tout est intuitif et facile à utiliser.",
      steps: {
        createAccount: {
          title: "Créez votre compte",
          description:
            "Inscrivez-vous gratuitement en moins de 2 minutes. Aucune carte de crédit requise. Accédez immédiatement à toutes les fonctionnalités premium pendant votre essai gratuit.",
        },
        setupBusiness: {
          title: "Configurez votre entreprise",
          description:
            "Personnalisez les services, horaires et équipe selon vos besoins. Configurez vos modes de paiement, horaires d'ouverture et branding. Tout depuis un panneau intuitif.",
        },
        startManaging: {
          title: "Commencez à gérer",
          description:
            "Recevez des réservations, gérez les clients et développez votre entreprise. Partagez votre lien de réservation avec vos clients et laissez le système travailler pour vous.",
        },
      },
      illustrationPlaceholder: "Illustration étape",
    },
    cta: {
      badge: "Commencez aujourd'hui",
      title: "Prêt à transformer votre entreprise ?",
      subtitle: "Rejoignez des milliers d'entreprises qui font déjà confiance à TuAgenda",
      button: "Commencer maintenant",
      trustIndicators: {
        noCard: "Sans carte de crédit",
        freeTrial: "Essai gratuit 14 jours",
        cancelAnytime: "Annulez quand vous voulez",
      },
    },
    testimonials: {
      badge: "Témoignages",
      title: "Ce que disent nos clients",
      subtitle:
        "Des milliers de professionnels font confiance à TuAgenda pour gérer leur entreprise",
      testimonial1: {
        quote:
          "TuAgenda a transformé ma façon de gérer mes rendez-vous. Mes patients adorent les rappels automatiques !",
        name: "Dr. Anne Girard",
        role: "Psychologue",
      },
      testimonial2: {
        quote:
          "Gérer plusieurs sites était un cauchemar. Maintenant tout est centralisé et efficace.",
        name: "Charles Martin",
        role: "Propriétaire de salon",
      },
      testimonial3: {
        quote:
          "Les rapports m'aident à prendre de meilleures décisions pour mon entreprise. Très recommandé !",
        name: "Laura Dubois",
        role: "Nutritionniste",
      },
    },
  },
  pages: {
    aboutUs: {
      title: "À propos",
      subtitle: "En savoir plus sur TuAgenda et notre mission",
      mission: {
        title: "Notre mission",
        description:
          "Chez TuAgenda, nous croyons que la gestion des rendez-vous doit être simple et efficace. Notre mission est de fournir aux entreprises de services les meilleurs outils pour gérer leur temps, leurs clients et leur équipe de manière efficace.",
      },
      story: {
        title: "Notre histoire",
        description:
          "Fondée en 2024, TuAgenda est née du besoin de simplifier la gestion des rendez-vous pour les professionnels des services. Nous avons commencé avec une idée simple : créer une plateforme qui combine puissance et simplicité, permettant aux propriétaires d'entreprises de se concentrer sur ce qu'ils font le mieux - servir leurs clients.",
      },
      values: {
        title: "Nos valeurs",
        value1: {
          title: "Simplicité",
          description:
            "Nous croyons que le logiciel doit être intuitif et facile à utiliser.",
        },
        value2: {
          title: "Innovation",
          description:
            "Nous améliorons constamment notre plateforme avec des fonctionnalités de pointe.",
        },
        value3: {
          title: "Support",
          description:
            "Notre équipe est toujours prête à vous aider à réussir.",
        },
      },
    },
    pricing: {
      title: "Tarifs",
      subtitle: "Choisissez le plan parfait pour votre entreprise",
      monthly: "Mensuel",
      annual: "Annuel",
      save20: "Économisez 20%",
      perMonth: "/mois",
      getStarted: "Commencer",
      free: {
        name: "Gratuit",
        price: "0",
        description: "Parfait pour commencer",
        feature1: "Jusqu'à 50 rendez-vous/mois",
        feature2: "1 emplacement",
        feature3: "Rapports basiques",
        feature4: "Support par e-mail",
      },
      pro: {
        name: "Pro",
        price: "29",
        description: "Pour les entreprises en croissance",
        feature1: "Rendez-vous illimités",
        feature2: "Jusqu'à 3 emplacements",
        feature3: "Rapports avancés",
        feature4: "Support prioritaire",
        feature5: "Marque personnalisée",
        feature6: "Intégrations",
      },
      enterprise: {
        name: "Entreprise",
        price: "99",
        description: "Pour les grandes organisations",
        feature1: "Tout dans Pro",
        feature2: "Emplacements illimités",
        feature3: "Gestionnaire de compte dédié",
        feature4: "Support téléphonique 24/7",
        feature5: "Développement personnalisé",
        feature6: "Garantie SLA",
      },
    },
    dashboard: {
      title: "Tableau de bord",
      welcome: "Bienvenue sur votre tableau de bord",
    },
    employees: {
      title: "Employés",
      addEmployee: "Ajouter un employé",
      employeeList: "Liste des employés",
    },
    calendar: {
      title: "Calendrier",
      today: "Aujourd'hui",
      month: "Mois",
      week: "Semaine",
      day: "Jour",
    },
    appointments: {
      title: "Rendez-vous",
      newAppointment: "Nouveau rendez-vous",
      upcoming: "À venir",
      past: "Passés",
    },
    services: {
      title: "Services",
      addService: "Ajouter un service",
      serviceName: "Nom du service",
      duration: "Durée",
      price: "Prix",
    },
    locations: {
      title: "Emplacements",
      addLocation: "Ajouter un emplacement",
      address: "Adresse",
      phone: "Téléphone",
    },
    clients: {
      title: "Clients",
      addClient: "Ajouter un client",
      clientList: "Liste des clients",
      name: "Nom",
      email: "E-mail",
      phone: "Téléphone",
    },
    business: {
      title: "Entreprises",
      addBusiness: "Créer une entreprise",
      editBusiness: "Modifier l'entreprise",
      businessList: "Gérez vos entreprises",
      noBusiness: "Vous n'avez aucune entreprise enregistrée",
      createFirst: "Créez votre première entreprise pour commencer",
      form: {
        title: "Titre",
        slug: "Identifiant unique",
        description: "Description",
        email: "E-mail",
        phone: "Téléphone",
        website: "Site web",
        address: "Adresse",
        city: "Ville",
        state: "État/Province",
        country: "Pays",
        postalCode: "Code postal",
        timeZone: "Fuseau horaire",
        locale: "Langue",
        currency: "Devise",
        status: "Statut",
        basicInfo: "Informations de base",
        contactInfo: "Informations de contact",
        locationInfo: "Emplacement",
        regionalSettings: "Paramètres régionaux",
      },
      status: {
        active: "Actif",
        inactive: "Inactif",
        suspended: "Suspendu",
      },
      actions: {
        save: "Enregistrer l'entreprise",
        cancel: "Annuler",
        delete: "Supprimer l'entreprise",
        confirmDelete: "Êtes-vous sûr de vouloir supprimer cette entreprise ?",
      },
    },
    payments: {
      title: "Paiements",
      amount: "Montant",
      status: "Statut",
      date: "Date",
      pending: "En attente",
      completed: "Terminé",
      failed: "Échoué",
    },
    notifications: {
      title: "Notifications",
      markAsRead: "Marquer comme lu",
      markAllAsRead: "Tout marquer comme lu",
      noNotifications: "Aucune notification",
    },
    settings: {
      title: "Paramètres",
      general: "Général",
      profile: "Profil",
      preferences: "Préférences",
      language: "Langue",
      theme: "Thème",
      notifications: "Notifications",
      account: "Compte",
    },
    profile: {
      title: "Paramètres du profil",
      subtitle: "Gérez les paramètres et préférences de votre compte",
      sections: {
        photo: "Photo de profil",
        photoDescription: "Votre photo de profil s'affiche partout dans TuAgenda",
        personalInfo: "Informations personnelles",
        personalInfoDescription:
          "Mettez à jour vos informations personnelles et coordonnées",
        security: "Changer le mot de passe",
        securityDescription:
          "Mettez à jour votre mot de passe pour sécuriser votre compte",
      },
      fields: {
        firstName: "Prénom",
        lastName: "Nom",
        email: "E-mail",
        emailReadonly: "L'e-mail ne peut pas être modifié",
        phone: "Numéro de téléphone",
        phoneHelp: "Entrez 9 chiffres sans espaces",
        birthday: "Date de naissance",
        birthdayHelp: "Vous devez avoir au moins 16 ans",
        timezone: "Fuseau horaire",
        currentPassword: "Mot de passe actuel",
        newPassword: "Nouveau mot de passe",
        newPasswordHelp: "Doit contenir au moins 8 caractères",
        confirmPassword: "Confirmer le nouveau mot de passe",
      },
      actions: {
        saveChanges: "Enregistrer les modifications",
        changePassword: "Changer le mot de passe",
      },
      messages: {
        profileUpdated: "Profil mis à jour avec succès",
        passwordChanged: "Mot de passe changé avec succès",
      },
    },
  },
};
