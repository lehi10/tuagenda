import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: ['getting-started/installation', 'getting-started/development'],
    },
    {
      type: 'category',
      label: 'Arquitectura',
      items: [
        'architecture/overview',
        'architecture/hexagonal',
        'architecture/folder-structure',
      ],
    },
    {
      type: 'category',
      label: 'Base de Datos',
      items: ['database/erd', 'database/models'],
    },
    {
      type: 'category',
      label: 'Flujos',
      items: [
        'flows/authentication',
        'flows/booking',
        'flows/crud-trpc',
        'flows/authorization',
      ],
    },
  ],
};

export default sidebars;
