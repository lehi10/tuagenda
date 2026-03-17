import {
  Calendar,
  Users,
  Shield,
  BarChart3,
  CreditCard,
  Building2,
  Phone,
  Sparkles,
  Puzzle,
  Info,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  enabled: boolean;
  href: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  featured?: boolean;
}

export interface NavigationSection {
  enabled: boolean;
  items: NavigationItem[];
}

export interface HeaderConfig {
  sections: {
    product: NavigationSection;
    solutions: NavigationSection;
    pricing: {
      enabled: boolean;
      href: string;
    };
    company: NavigationSection;
  };
  actions: {
    languageSelector: { enabled: boolean };
    login: { enabled: boolean };
    signup: { enabled: boolean };
  };
}

/**
 * Configuración del Header Público
 *
 * Para activar/desactivar opciones, simplemente cambia `enabled: true/false`
 * - enabled: true  -> La opción aparece en el menú
 * - enabled: false -> La opción se oculta
 */
export const headerConfig: HeaderConfig = {
  sections: {
    // Menú "Producto"
    product: {
      enabled: true, // Activa/desactiva toda la sección
      items: [
        {
          enabled: true, // Activa/desactiva este item específico
          href: "/features",
          label: "features", // Translation key
          description: "features.subtitle",
          icon: Sparkles,
          featured: true,
        },
        {
          enabled: true,
          href: "/features/scheduling",
          label: "features.categories.scheduling.title",
          description: "features.categories.scheduling.description",
          icon: Calendar,
          featured: false,
        },
        {
          enabled: true,
          href: "/features/clients",
          label: "features.categories.clients.title",
          description: "features.categories.clients.description",
          icon: Users,
          featured: false,
        },
        {
          enabled: true,
          href: "/features/team",
          label: "features.categories.team.title",
          description: "features.categories.team.description",
          icon: Shield,
          featured: false,
        },
        {
          enabled: true,
          href: "/features/analytics",
          label: "features.categories.analytics.title",
          description: "features.categories.analytics.description",
          icon: BarChart3,
          featured: false,
        },
        {
          enabled: true,
          href: "/features/payments",
          label: "features.categories.payments.title",
          description: "features.categories.payments.description",
          icon: CreditCard,
          featured: false,
        },
      ],
    },

    // Menú "Soluciones"
    solutions: {
      enabled: true,
      items: [
        {
          enabled: true,
          href: "/industries",
          label: "industries",
          icon: Building2,
        },
        {
          enabled: true,
          href: "/integrations",
          label: "integrations",
          icon: Puzzle,
        },
      ],
    },

    // Link directo "Pricing"
    pricing: {
      enabled: true,
      href: "/pricing",
    },

    // Menú "Empresa"
    company: {
      enabled: true,
      items: [
        {
          enabled: true,
          href: "/about-us",
          label: "aboutUs",
          icon: Info,
        },
        {
          enabled: true,
          href: "/contact",
          label: "contact",
          icon: Phone,
        },
      ],
    },
  },

  // Botones de acción (login, signup, idioma)
  actions: {
    languageSelector: { enabled: true },
    login: { enabled: true },
    signup: { enabled: true },
  },
};
