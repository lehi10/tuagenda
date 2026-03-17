export const en = {
  common: {
    language: "Language",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    actions: "Actions",
    myProfile: "My Profile",
    myDashboard: "My Dashboard",
    client: "Client",
    platform: "Platform",
    product: "Product",
    legal: "Legal",
    allRightsReserved: "All rights reserved",
    noOrganizationSelected: "No organization selected",
    noOrganizationMessage:
      "You don't have an assigned organization. Please contact your administrator.",
    learnMore: "Learn more",
    startFreeTrial: "Start Free Trial",
    featured: "Featured",
    connect: "Connect",
    screenshot: "Screenshot",
    placeholders: {
      search: "Search...",
      searchByEmail: "Search by email or name...",
      searchByNameOrEmail: "Search by name or email...",
      searchBusiness: "Search business...",
      selectRole: "Select a role",
      selectUserType: "User Type",
      selectStatus: "Status",
      selectTimezone: "Select timezone",
      firstName: "John",
      lastName: "Doe",
      countryCode: "Code",
      phone: "987654321",
      currentPassword: "Enter your current password",
      newPassword: "Enter your new password",
      confirmNewPassword: "Confirm your new password",
    },
  },
  navigation: {
    dashboard: "Dashboard",
    employees: "Employees",
    calendar: "Calendar",
    appointments: "Appointments",
    services: "Services",
    locations: "Locations",
    clients: "Clients",
    payments: "Payments",
    notifications: "Notifications",
    settings: "Settings",
    business: "Business",
    users: "Users",
    aboutUs: "About Us",
    pricing: "Pricing",
    features: "Features",
    industries: "Use Cases",
    contact: "Contact",
    integrations: "Integrations",
  },
  auth: {
    login: "Login",
    logout: "Logout",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    companyName: "Company Name",
    forgotPassword: "Forgot your password?",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    signUp: "Sign up",
    createAccount: "Create an account",
    creatingAccount: "Creating account...",
    signingIn: "Signing in...",
    getStarted: "Get started with TuAgenda",
    welcomeBack: "Welcome back",
    loginWith: "Login with your Apple or Google account",
    signUpWith: "Sign up with your Apple or Google account",
    orContinueWith: "Or continue with",
    loginWithApple: "Login with Apple",
    loginWithGoogle: "Login with Google",
    signUpWithApple: "Sign up with Apple",
    signUpWithGoogle: "Sign up with Google",
    termsAndPrivacy: "By clicking continue, you agree to our",
    and: "and",
    resetPassword: "Reset password",
    resetPasswordDescription:
      "Enter your email address and we'll send you a link to reset your password.",
    sendResetLink: "Send reset link",
    backToLogin: "Back to login",
    checkYourEmail: "Check your email",
    resetLinkSent: "We've sent a password reset link to your email address.",
    errors: {
      signInFailed: "Failed to sign in. Please try again.",
      signUpFailed: "Failed to create account. Please try again.",
      googleSignInFailed: "Failed to sign in with Google. Please try again.",
      googleSignUpFailed: "Failed to sign up with Google. Please try again.",
      passwordsDoNotMatch: "Passwords do not match",
      passwordTooShort: "Password must be at least 6 characters",
      invalidCredentials: "Invalid email or password",
    },
    messages: {
      signingInWithGoogle: "Signing in with Google...",
      signingUpWithGoogle: "Signing up with Google...",
      creatingAccount: "Creating your account...",
      welcome: "Welcome! 🎉",
      accountCreated: "Account created successfully! 🎉",
    },
    placeholders: {
      email: "m@example.com",
      name: "John Doe",
      password: "••••••••",
    },
  },
  legal: {
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    lastUpdated: "Last updated",
  },
  booking: {
    title: "Book an Appointment",
    steps: {
      service: "Select Service",
      professional: "Select Professional",
      date: "Select Date",
      time: "Select Time",
      confirm: "Confirm",
    },
    service: {
      title: "What service do you need?",
      filterByLocation: "Filter by location",
      filterByCategory: "Filter by category",
      locationInPerson: "In-Person",
      locationVirtual: "Virtual",
      allCategories: "All Categories",
      noServices: "No services available",
    },
    professional: {
      title: "Who would you like to see?",
      available: "Available",
      noStaff: "No professionals available",
    },
    date: {
      title: "When would you like your appointment?",
      selectDate: "Select a date",
    },
    time: {
      title: "What time works best?",
      available: "available",
      noSlots: "No time slots available for this date",
    },
    summary: {
      title: "Your Selection",
      service: "Service",
      professional: "Professional",
      date: "Date",
      time: "Time",
      duration: "Duration",
      price: "Price",
      clear: "Clear",
      continue: "Continue",
      minutes: "min",
    },
    contact: {
      phone: "Phone",
      email: "Email",
      location: "Location",
      title: "Contact Information",
      description: "Complete your details to confirm the booking",
      alreadyHaveAccount: "Already have an account?",
      firstName: "First Name *",
      lastName: "Last Name *",
      fullName: "Full Name *",
      phoneNumber: "Phone *",
      emailAddress: "Email *",
      createAccountOption: "Create an account for future bookings",
      currentPassword: "Password *",
      confirmPassword: "Confirm Password *",
      passwordHelp: "Minimum 6 characters",
      loading: "Loading...",
      guestTab: "No account",
      loginTab: "I have an account",
      placeholders: {
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
        phone: "+1 999 888 777",
        email: "email@example.com",
        password: "••••••••",
      },
    },
    payment: {
      title: "Payment Method",
      description: "Select how you would like to pay",
      methods: {
        card: "Credit/Debit Card",
        cardDescription: "Secure payment with your card",
        cash: "Pay at Location",
        cashDescription: "Pay when you arrive for your appointment",
        wallet: "Digital Wallet",
        walletDescription: "Pay with digital wallets",
      },
      confirmAndBook: "Confirm and Book",
      creatingAppointment: "Creating appointment...",
    },
    confirmation: {
      title: "Booking Confirmed!",
      subtitle: "Your appointment has been successfully scheduled",
      detailsTitle: "Your Booking Details",
      paymentMethod: "Payment method",
      confirmationSent: "Confirmation sent",
      confirmationEmail:
        "We've sent an email with all the details of your booking to",
      calendarInvitation:
        "with the video call invitation. You can accept the invitation to have it appear in your calendar.",
      importantInfo: "Important information about your virtual appointment",
      locationTitle: "Location",
      howToGetThere: "How to get there (Google Maps)",
      needToReschedule: "Need to reschedule or cancel?",
      contactUs: "Contact us at",
      makeAnotherBooking: "Make Another Booking",
      viewMyBookings: "View My Bookings",
      needToCancelOrModify:
        "Need to cancel or modify your appointment? Contact us at",
      virtualInfo: {
        punctuality: "Join on time:",
        punctualityDescription:
          "Virtual appointments cannot extend beyond the scheduled time.",
        duration: "Duration:",
        durationDescription:
          "The professional will be available only during the",
        videoCallLink: "Video call link:",
        videoCallDescription: "Check your email to access the video call link.",
        calendar: "Calendar:",
        calendarDescription:
          "Accept the calendar invitation to receive automatic reminders.",
      },
    },
  },
  landing: {
    footer: {
      description:
        "The professional platform to manage your business efficiently.",
      copyright: "© 2025 TuAgenda. All rights reserved.",
    },
    hero: {
      title: "Manage your appointments with ease",
      subtitle:
        "The complete platform to manage your service business. Appointments, clients, employees, and more in one place.",
      cta: "Start for free",
      ctaSecondary: "Watch demo",
      badge: "Professional management platform",
      badgeAlt: "Professional software",
      trustBadges: {
        freeTrial: "14 days free",
        noCard: "No card required",
        cancelAnytime: "Cancel anytime",
      },
      stats: {
        activeUsers: "Active users",
        uptime: "Uptime",
        support: "Support",
      },
    },
    features: {
      title: "Everything you need to grow your business",
      subtitle: "Powerful tools designed for service businesses",
      badge: "Why choose us?",
      sectionTitle: "The complete solution for your business",
      sectionDescription:
        "We help service businesses, beauty salons, health professionals, and consultants optimize their time and increase their revenue.",
      appointments: {
        title: "Smart Appointments",
        description:
          "Manage your schedule efficiently. Real-time availability and automatic reminders.",
      },
      clients: {
        title: "Client Management",
        description:
          "Keep track of your clients, their preferences, and complete appointment history.",
      },
      team: {
        title: "Team Collaboration",
        description:
          "Coordinate your team, assign services, and optimize everyone's time.",
      },
      analytics: {
        title: "Reports & Analytics",
        description:
          "Make informed decisions with detailed reports on your business performance.",
      },
      multiLocation: {
        title: "Multiple Locations",
        description:
          "Manage multiple locations from a single centralized platform.",
      },
      payments: {
        title: "Payment Control",
        description:
          "Track payments, generate invoices, and manage your business finances.",
      },
      quickFeatures: {
        fast: "Fast and easy",
        fastDescription:
          "Set up your account in minutes. Intuitive interface that requires no training.",
        secure: "Secure data",
        secureDescription:
          "Enterprise-level encryption. Your data and your clients' data are protected.",
        grow: "Grow faster",
        growDescription:
          "Real-time analytics to make better decisions and increase your revenue.",
        saveTime: "Save time",
        saveTimeDescription:
          "Automate reminders, payments, and confirmations. Focus on what matters.",
      },
      powerfullBadge: "Powerful features",
      whyChooseUs: {
        badge: "Why choose us?",
        title: "The complete solution for your business",
        description:
          "Specifically designed for beauty salons, spas, clinics, gyms, and any appointment-based business. Boost your productivity and improve customer satisfaction.",
      },
      heroDescription:
        "Optimize the management of appointments, clients, and payments for your business. Save time, increase your revenue, and offer an exceptional experience to your clients.",
    },
    howItWorks: {
      badge: "Simple process",
      title: "How it works",
      description:
        "Get started in minutes with our simple and guided process. No technical knowledge needed, everything is intuitive and easy to use.",
      steps: {
        createAccount: {
          title: "Create your account",
          description:
            "Sign up for free in less than 2 minutes. No credit card required. Get immediate access to all premium features during your free trial.",
        },
        setupBusiness: {
          title: "Set up your business",
          description:
            "Customize services, schedules, and team according to your needs. Configure your payment methods, business hours, and branding. All from an intuitive panel.",
        },
        startManaging: {
          title: "Start managing",
          description:
            "Receive bookings, manage clients, and grow your business. Share your booking link with your clients and let the system work for you.",
        },
      },
      illustrationPlaceholder: "Step illustration",
    },
    cta: {
      badge: "Start today",
      title: "Ready to transform your business?",
      subtitle: "Join thousands of businesses that already trust TuAgenda",
      button: "Start now",
      trustIndicators: {
        noCard: "No credit card required",
        freeTrial: "14-day free trial",
        cancelAnytime: "Cancel anytime",
      },
    },
    testimonials: {
      badge: "Testimonials",
      title: "What our clients say",
      subtitle:
        "Thousands of professionals trust TuAgenda to manage their business",
      testimonial1: {
        quote:
          "TuAgenda transformed how I manage my appointments. My patients love the automatic reminders!",
        name: "Dr. Ana García",
        role: "Psychologist",
      },
      testimonial2: {
        quote:
          "Managing multiple locations was a nightmare. Now everything is centralized and efficient.",
        name: "Carlos Mendoza",
        role: "Salon Owner",
      },
      testimonial3: {
        quote:
          "The reports help me make better decisions for my business. Highly recommended!",
        name: "Laura Torres",
        role: "Nutritionist",
      },
    },
  },
  pages: {
    aboutUs: {
      title: "About Us",
      subtitle: "Learn more about TuAgenda and our mission",
      mission: {
        title: "Our Mission",
        description:
          "At TuAgenda, we believe that managing appointments should be simple and efficient. Our mission is to provide service businesses with the best tools to manage their time, clients, and team effectively.",
      },
      story: {
        title: "Our Story",
        description:
          "Founded in 2024, TuAgenda was born from the need to simplify appointment management for service professionals. We started with a simple idea: create a platform that combines power and simplicity, allowing business owners to focus on what they do best - serving their clients.",
      },
      values: {
        title: "Our Values",
        value1: {
          title: "Simplicity",
          description:
            "We believe software should be intuitive and easy to use.",
        },
        value2: {
          title: "Innovation",
          description:
            "We constantly improve our platform with cutting-edge features.",
        },
        value3: {
          title: "Support",
          description: "Our team is always ready to help you succeed.",
        },
      },
    },
    pricing: {
      title: "Pricing",
      subtitle: "Choose the perfect plan for your business",
      badge: "Simple, transparent pricing",
      popular: "Popular",
      monthly: "Monthly",
      annual: "Annual",
      save20: "Save 20%",
      save: "Save",
      year: "year",
      perMonth: "/month",
      getStarted: "Get Started",
      featuresHeader: "Features",
      free: {
        name: "Free",
        price: "0",
        description: "Perfect to get started",
        feature1: "Up to 50 appointments/month",
        feature2: "1 location",
        feature3: "Basic reports",
        feature4: "Email support",
      },
      pro: {
        name: "Pro",
        price: "29",
        description: "For growing businesses",
        feature1: "Unlimited appointments",
        feature2: "Up to 3 locations",
        feature3: "Advanced reports",
        feature4: "Priority support",
        feature5: "Custom branding",
        feature6: "Integrations",
      },
      enterprise: {
        name: "Enterprise",
        price: "99",
        description: "For large businesses",
        feature1: "Everything in Pro",
        feature2: "Unlimited locations",
        feature3: "Dedicated account manager",
        feature4: "24/7 phone support",
        feature5: "Custom development",
        feature6: "SLA guarantee",
      },
      comparison: {
        title: "Compare Plans",
        subtitle: "See what's included in each plan",
        unlimited: "Unlimited",
        perMonth: "/month",
        categories: {
          coreFeatures: "Core Features",
          advancedFeatures: "Advanced Features",
          support: "Support",
        },
        features: {
          appointments: "Appointments",
          locations: "Locations",
          staffMembers: "Staff Members",
          clientDatabase: "Client Database",
          calendarSync: "Calendar Sync",
          customBranding: "Custom Branding",
          integrations: "Integrations",
          apiAccess: "API Access",
          advancedAnalytics: "Advanced Analytics",
          customDevelopment: "Custom Development",
          emailSupport: "Email Support",
          prioritySupport: "Priority Support",
          phoneSupport: "Phone Support",
          dedicatedManager: "Dedicated Manager",
        },
      },
    },
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome to your dashboard",
    },
    employees: {
      title: "Employees",
      addEmployee: "Add Employee",
      employeeList: "Employee List",
    },
    calendar: {
      title: "Calendar",
      today: "Today",
      month: "Month",
      week: "Week",
      day: "Day",
    },
    appointments: {
      title: "Appointments",
      newAppointment: "New Appointment",
      upcoming: "Upcoming",
      past: "Past",
    },
    services: {
      title: "Services",
      addService: "Add Service",
      serviceName: "Service Name",
      duration: "Duration",
      price: "Price",
    },
    locations: {
      title: "Locations",
      addLocation: "Add Location",
      address: "Address",
      phone: "Phone",
    },
    clients: {
      title: "Clients",
      addClient: "Add Client",
      clientList: "Client List",
      name: "Name",
      email: "Email",
      phone: "Phone",
    },
    business: {
      title: "Business",
      addBusiness: "Create Business",
      editBusiness: "Edit Business",
      businessList: "Manage your businesses",
      noBusiness: "You don't have any businesses registered",
      createFirst: "Create your first business to get started",
      form: {
        title: "Title",
        slug: "Unique identifier",
        description: "Description",
        email: "Email",
        phone: "Phone",
        website: "Website",
        address: "Address",
        city: "City",
        state: "State/Province",
        country: "Country",
        postalCode: "Postal code",
        timeZone: "Time zone",
        locale: "Language",
        currency: "Currency",
        status: "Status",
        basicInfo: "Basic Information",
        contactInfo: "Contact Information",
        locationInfo: "Location",
        regionalSettings: "Regional Settings",
      },
      status: {
        active: "Active",
        inactive: "Inactive",
        suspended: "Suspended",
      },
      actions: {
        save: "Save Business",
        cancel: "Cancel",
        delete: "Delete Business",
        confirmDelete: "Are you sure you want to delete this business?",
      },
    },
    payments: {
      title: "Payments",
      amount: "Amount",
      status: "Status",
      date: "Date",
      pending: "Pending",
      completed: "Completed",
      failed: "Failed",
    },
    notifications: {
      title: "Notifications",
      markAsRead: "Mark as read",
      markAllAsRead: "Mark all as read",
      noNotifications: "No notifications",
    },
    settings: {
      title: "Settings",
      general: "General",
      profile: "Profile",
      preferences: "Preferences",
      language: "Language",
      theme: "Theme",
      notifications: "Notifications",
      account: "Account",
    },
    profile: {
      title: "Profile Settings",
      subtitle: "Manage your account settings and preferences",
      sections: {
        photo: "Profile Photo",
        photoDescription: "Your profile photo is displayed across TuAgenda",
        personalInfo: "Personal Information",
        personalInfoDescription:
          "Update your personal information and contact details",
        security: "Change Password",
        securityDescription: "Update your password to keep your account secure",
      },
      fields: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        emailReadonly: "Email cannot be changed",
        phone: "Phone Number",
        phoneHelp: "Enter 9 digits without spaces",
        birthday: "Birthday",
        birthdayHelp: "You must be at least 16 years old",
        timezone: "Timezone",
        currentPassword: "Current Password",
        newPassword: "New Password",
        newPasswordHelp: "Must be at least 8 characters",
        confirmPassword: "Confirm New Password",
      },
      actions: {
        saveChanges: "Save Changes",
        changePassword: "Change Password",
      },
      messages: {
        profileUpdated: "Profile updated successfully",
        passwordChanged: "Password changed successfully",
      },
    },
    features: {
      title: "All Features",
      subtitle: "Everything you need to manage your business efficiently",
      badge: "Complete Platform",
      categories: {
        scheduling: {
          title: "Smart Scheduling",
          description: "Intelligent appointment management",
          features: {
            calendar: {
              title: "Interactive Calendar",
              description:
                "View and manage all your appointments in one place with drag-and-drop functionality",
            },
            autoReminders: {
              title: "Automatic Reminders",
              description:
                "Reduce no-shows with automated email and SMS reminders",
            },
            multiLocation: {
              title: "Multi-Location Support",
              description:
                "Manage appointments across multiple business locations",
            },
            recurring: {
              title: "Recurring Appointments",
              description:
                "Set up weekly, monthly or custom recurring appointments",
            },
          },
        },
        clients: {
          title: "Client Management",
          description: "Build lasting relationships",
          features: {
            database: {
              title: "Client Database",
              description:
                "Store and organize all client information in one secure place",
            },
            history: {
              title: "Appointment History",
              description:
                "Track complete appointment and service history for each client",
            },
            notes: {
              title: "Client Notes",
              description:
                "Add private notes and preferences for personalized service",
            },
            communication: {
              title: "Automated Communication",
              description:
                "Send automated booking confirmations and follow-ups",
            },
          },
        },
        team: {
          title: "Team Collaboration",
          description: "Empower your team",
          features: {
            roles: {
              title: "Role-Based Access",
              description: "Control what each team member can see and do",
            },
            scheduling: {
              title: "Staff Scheduling",
              description: "Manage team availability and working hours",
            },
            performance: {
              title: "Performance Tracking",
              description: "Monitor individual and team performance metrics",
            },
            mobile: {
              title: "Mobile Access",
              description: "Team members can access schedules from anywhere",
            },
          },
        },
        analytics: {
          title: "Analytics & Reports",
          description: "Data-driven decisions",
          features: {
            dashboard: {
              title: "Real-Time Dashboard",
              description: "See your key metrics at a glance",
            },
            revenue: {
              title: "Revenue Reports",
              description: "Track income, expenses and profitability",
            },
            clients: {
              title: "Client Analytics",
              description: "Understand retention, acquisition and behavior",
            },
            export: {
              title: "Export Reports",
              description: "Download reports in CSV, PDF or Excel format",
            },
          },
        },
        payments: {
          title: "Payment Processing",
          description: "Get paid faster",
          features: {
            online: {
              title: "Online Payments",
              description:
                "Accept credit cards, debit cards and digital wallets",
            },
            deposits: {
              title: "Deposit Management",
              description: "Require deposits to reduce no-shows",
            },
            invoicing: {
              title: "Automated Invoicing",
              description:
                "Generate and send professional invoices automatically",
            },
            tracking: {
              title: "Payment Tracking",
              description: "Monitor all transactions in real-time",
            },
          },
        },
        integrations: {
          title: "Integrations",
          description: "Connect your tools",
          features: {
            calendar: {
              title: "Calendar Sync",
              description: "Sync with Google Calendar, Outlook and more",
            },
            payments: {
              title: "Payment Gateways",
              description: "Integrate with Stripe, PayPal and others",
            },
            marketing: {
              title: "Marketing Tools",
              description: "Connect with Mailchimp, HubSpot and more",
            },
            api: {
              title: "Open API",
              description: "Build custom integrations with our API",
            },
          },
        },
      },
      cta: {
        title: "Ready to get started?",
        description: "Join thousands of businesses already using TuAgenda",
        button: "Start Free Trial",
      },
      imagePlaceholder: "Feature illustration",
    },
    industries: {
      title: "Real Use Cases",
      subtitle: "Tailored solutions for every type of business",
      badge: "Use Cases",
      industries: {
        salons: {
          title: "Hair Salons & Barbershops",
          description: "Perfect for styling businesses",
          features: [
            "Service menu management",
            "Stylist scheduling",
            "Product inventory",
            "Client photo gallery",
          ],
          stats: "Used by 5,000+ salons worldwide",
        },
        spas: {
          title: "Spas & Wellness",
          description: "Relax and grow your spa business",
          features: [
            "Treatment packages",
            "Room management",
            "Membership programs",
            "Gift certificates",
          ],
          stats: "Trusted by 3,000+ spas",
        },
        medical: {
          title: "Medical & Dental",
          description: "Secure and private scheduling",
          features: [
            "Patient records",
            "Insurance tracking",
            "Prescription management",
            "Secure messaging",
          ],
          stats: "Serving 2,000+ healthcare providers",
        },
        fitness: {
          title: "Fitness & Yoga",
          description: "Energize your fitness business",
          features: [
            "Class scheduling",
            "Membership management",
            "Trainer assignments",
            "Progress tracking",
          ],
          stats: "Powering 4,000+ fitness studios",
        },
        beauty: {
          title: "Beauty & Cosmetics",
          description: "Look good, feel great",
          features: [
            "Service customization",
            "Before/after photos",
            "Product recommendations",
            "Loyalty programs",
          ],
          stats: "Chosen by 6,000+ beauty professionals",
        },
        consulting: {
          title: "Consulting & Coaching",
          description: "Professional service scheduling",
          features: [
            "Virtual meetings",
            "Session notes",
            "File sharing",
            "Package deals",
          ],
          stats: "Used by 1,500+ consultants",
        },
      },
      testimonials: {
        title: "Success Stories",
        subtitle: "See how businesses like yours are thriving",
      },
      cta: {
        title: "Find your industry solution",
        button: "Get Started Free",
      },
      imagePlaceholder: "Industry showcase",
    },
    contact: {
      title: "Get in Touch",
      subtitle: "We're here to help you succeed",
      badge: "Contact Us",
      form: {
        title: "Send us a message",
        description:
          "Fill out the form and our team will get back to you within 24 hours",
        name: "Full Name",
        namePlaceholder: "John Doe",
        email: "Email",
        emailPlaceholder: "john@example.com",
        subject: "Subject",
        subjectPlaceholder: "How can we help?",
        message: "Message",
        messagePlaceholder: "Tell us more about your needs...",
        send: "Send Message",
        sending: "Sending...",
        success: "Message sent successfully!",
        error: "Failed to send message. Please try again.",
      },
      channels: {
        title: "Other ways to reach us",
        email: {
          title: "Email",
          value: "support@tuagenda.com",
          description: "We'll respond within 24 hours",
        },
        phone: {
          title: "Phone",
          value: "+1 (555) 123-4567",
          description: "Mon-Fri from 9am to 6pm",
        },
        chat: {
          title: "Live Chat",
          value: "Available now",
          description: "Chat with our support team",
        },
      },
      faq: {
        title: "Frequently Asked Questions",
        subtitle: "Find quick answers to common questions",
        questions: {
          trial: {
            question: "How does the free trial work?",
            answer:
              "Our 14-day free trial gives you full access to all features. No credit card required. You can upgrade, downgrade, or cancel anytime.",
          },
          setup: {
            question: "How long does setup take?",
            answer:
              "Most businesses are up and running in less than 15 minutes. Our onboarding wizard guides you through each step.",
          },
          support: {
            question: "What kind of support do you offer?",
            answer:
              "All plans include email support. Pro and Enterprise plans get priority support and phone support respectively. We also have extensive documentation and video tutorials.",
          },
          data: {
            question: "Is my data secure?",
            answer:
              "Absolutely. We use bank-level encryption, regular backups, and comply with GDPR and other data protection regulations.",
          },
          migration: {
            question: "Can you help me migrate from another platform?",
            answer:
              "Yes! Our team can help you migrate your data from most major platforms. Contact us for a personalized migration plan.",
          },
          pricing: {
            question: "Can I change plans later?",
            answer:
              "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the difference.",
          },
        },
      },
      hours: {
        title: "Business Hours",
        timezone: "EST (Eastern Standard Time)",
        schedule: {
          weekdays: "Monday - Friday",
          weekdaysHours: "9:00 AM - 6:00 PM",
          saturday: "Saturday",
          saturdayHours: "10:00 AM - 4:00 PM",
          sunday: "Sunday",
          sundayHours: "Closed",
        },
      },
    },
    integrations: {
      title: "Integrations",
      subtitle: "Connect TuAgenda with your favorite tools",
      badge: "100+ Integrations",
      categories: {
        all: "All",
        calendar: "Calendar",
        payments: "Payments",
        marketing: "Marketing",
        communication: "Communication",
        productivity: "Productivity",
      },
      featured: {
        title: "Featured Integrations",
        description: "Our most popular connections",
      },
      list: {
        googleCalendar: {
          name: "Google Calendar",
          description:
            "Sync appointments with your Google Calendar automatically",
          category: "calendar",
        },
        outlook: {
          name: "Microsoft Outlook",
          description: "Two-way sync with Outlook calendar and contacts",
          category: "calendar",
        },
        stripe: {
          name: "Stripe",
          description: "Accept payments securely with Stripe",
          category: "payments",
        },
        paypal: {
          name: "PayPal",
          description: "Process payments through PayPal",
          category: "payments",
        },
        mailchimp: {
          name: "Mailchimp",
          description: "Sync clients to your mailing lists",
          category: "marketing",
        },
        zoom: {
          name: "Zoom",
          description:
            "Automatically create Zoom meetings for virtual appointments",
          category: "communication",
        },
        slack: {
          name: "Slack",
          description: "Get appointment notifications in Slack",
          category: "communication",
        },
        zapier: {
          name: "Zapier",
          description: "Connect to 3,000+ apps through Zapier",
          category: "productivity",
        },
        hubspot: {
          name: "HubSpot",
          description: "Sync customer data with HubSpot CRM",
          category: "marketing",
        },
        quickbooks: {
          name: "QuickBooks",
          description: "Sync invoices and payments with QuickBooks",
          category: "payments",
        },
      },
      api: {
        title: "Developer API",
        description: "Build custom integrations with our powerful REST API",
        features: [
          "Comprehensive documentation",
          "Webhooks for real-time updates",
          "SDKs for popular languages",
          "Sandbox environment",
        ],
        cta: "View API Docs",
      },
      cta: {
        title: "Don't see your tool?",
        description: "Request a new integration or build your own with our API",
        button: "Request Integration",
      },
      imagePlaceholder: "Integration logo",
    },
  },
};

export type Translations = typeof en;
