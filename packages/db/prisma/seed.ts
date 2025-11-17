import { PrismaClient, BusinessStatus, UserStatus, UserType, AppointmentStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Función helper para generar IDs de Firebase simulados
function generateFirebaseId(): string {
  return `firebase_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

const businessData = [
  {
    title: "Salón de Belleza Elite",
    slug: "salon-belleza-elite",
    description: "Salón de belleza premium con servicios de alta calidad",
    email: "contacto@salonelite.com",
    phone: "+34 912 345 678",
    website: "https://salonelite.com",
    address: "Calle Gran Vía 45",
    city: "Madrid",
    state: "Madrid",
    country: "España",
    postalCode: "28013",
    timeZone: "Europe/Madrid",
    locale: "es",
    currency: "EUR",
    status: BusinessStatus.active,
  },
  {
    title: "Barbería Moderna",
    slug: "barberia-moderna",
    description: "Cortes de cabello y afeitado profesional para hombres",
    email: "info@barberiamoderna.com",
    phone: "+34 678 901 234",
    website: "https://barberiamoderna.com",
    address: "Avenida Diagonal 123",
    city: "Barcelona",
    state: "Cataluña",
    country: "España",
    postalCode: "08019",
    timeZone: "Europe/Madrid",
    locale: "es",
    currency: "EUR",
    status: BusinessStatus.active,
  },
  {
    title: "Spa Relax & Wellness",
    slug: "spa-relax-wellness",
    description: "Centro de bienestar y relajación",
    email: "reservas@sparelax.com",
    phone: "+34 955 123 456",
    website: "https://sparelax.com",
    address: "Calle Sierpes 78",
    city: "Sevilla",
    state: "Andalucía",
    country: "España",
    postalCode: "41004",
    timeZone: "Europe/Madrid",
    locale: "es",
    currency: "EUR",
    status: BusinessStatus.active,
  },
  {
    title: "Clínica Dental Sonrisa",
    slug: "clinica-dental-sonrisa",
    description: "Servicios dentales integrales para toda la familia",
    email: "citas@dentalsonrisa.com",
    phone: "+34 963 234 567",
    website: "https://dentalsonrisa.com",
    address: "Plaza del Ayuntamiento 12",
    city: "Valencia",
    state: "Valencia",
    country: "España",
    postalCode: "46002",
    timeZone: "Europe/Madrid",
    locale: "es",
    currency: "EUR",
    status: BusinessStatus.active,
  },
  {
    title: "Gimnasio FitZone",
    slug: "gimnasio-fitzone",
    description: "Centro de fitness y entrenamiento personal",
    email: "hola@fitzone.com",
    phone: "+34 944 345 678",
    website: "https://fitzone.com",
    address: "Gran Vía 88",
    city: "Bilbao",
    state: "País Vasco",
    country: "España",
    postalCode: "48011",
    timeZone: "Europe/Madrid",
    locale: "es",
    currency: "EUR",
    status: BusinessStatus.active,
  },
  {
    title: "Estudio de Yoga Namaste",
    slug: "estudio-yoga-namaste",
    description: "Clases de yoga y meditación para todos los niveles",
    email: "info@yoganamaste.com",
    phone: "+34 985 456 789",
    website: "https://yoganamaste.com",
    address: "Calle Uría 25",
    city: "Oviedo",
    state: "Asturias",
    country: "España",
    postalCode: "33003",
    timeZone: "Europe/Madrid",
    locale: "es",
    currency: "EUR",
    status: BusinessStatus.active,
  },
  {
    title: "Peluquería Canina PetStyle",
    slug: "peluqueria-canina-petstyle",
    description: "Grooming profesional para mascotas",
    email: "contacto@petstyle.com",
    phone: "+34 976 567 890",
    address: "Paseo Independencia 34",
    city: "Zaragoza",
    state: "Aragón",
    country: "España",
    postalCode: "50004",
    timeZone: "Europe/Madrid",
    locale: "es",
    currency: "EUR",
    status: BusinessStatus.active,
  },
  {
    title: "Centro Médico VidaSana",
    slug: "centro-medico-vidasana",
    description: "Consulta médica general y especialidades",
    email: "citas@vidasana.com",
    phone: "+34 952 678 901",
    website: "https://vidasana.com",
    address: "Calle Larios 56",
    city: "Málaga",
    state: "Andalucía",
    country: "España",
    postalCode: "29015",
    timeZone: "Europe/Madrid",
    locale: "es",
    currency: "EUR",
    status: BusinessStatus.active,
  },
  {
    title: "Estética y Belleza Glamour",
    slug: "estetica-belleza-glamour",
    description: "Tratamientos faciales y corporales",
    email: "info@glamour.com",
    phone: "+34 928 789 012",
    website: "https://glamour.com",
    address: "Avenida Mesa y López 101",
    city: "Las Palmas",
    state: "Canarias",
    country: "España",
    postalCode: "35008",
    timeZone: "Atlantic/Canary",
    locale: "es",
    currency: "EUR",
    status: BusinessStatus.active,
  },
  {
    title: "Tattoo Studio Ink Masters",
    slug: "tattoo-studio-ink-masters",
    description: "Estudio de tatuajes y piercings profesional",
    email: "reservas@inkmasters.com",
    phone: "+34 881 890 123",
    website: "https://inkmasters.com",
    address: "Rúa do Franco 67",
    city: "Santiago de Compostela",
    state: "Galicia",
    country: "España",
    postalCode: "15705",
    timeZone: "Europe/Madrid",
    locale: "es",
    currency: "EUR",
    status: BusinessStatus.active,
  },
  {
    title: "Centro de Fisioterapia RecuperaT",
    slug: "centro-fisioterapia-recuperat",
    description: "Rehabilitación y terapia física especializada",
    email: "citas@recuperat.com",
    phone: "+34 925 901 234",
    website: "https://recuperat.com",
    address: "Calle Comercio 89",
    city: "Toledo",
    state: "Castilla-La Mancha",
    country: "España",
    postalCode: "45001",
    timeZone: "Europe/Madrid",
    locale: "es",
    currency: "EUR",
    status: BusinessStatus.inactive,
  },
  {
    title: "Academia de Idiomas GlobalSpeak",
    slug: "academia-idiomas-globalspeak",
    description: "Cursos de inglés, francés y alemán",
    email: "info@globalspeak.com",
    phone: "+34 923 012 345",
    website: "https://globalspeak.com",
    address: "Plaza Mayor 15",
    city: "Salamanca",
    state: "Castilla y León",
    country: "España",
    postalCode: "37002",
    timeZone: "Europe/Madrid",
    locale: "es",
    currency: "EUR",
    status: BusinessStatus.active,
  },
  {
    title: "Fotografía Profesional SnapShot",
    slug: "fotografia-profesional-snapshot",
    description: "Estudio fotográfico para eventos y retratos",
    email: "contacto@snapshot.com",
    phone: "+34 968 123 456",
    address: "Calle Trapería 23",
    city: "Murcia",
    state: "Murcia",
    country: "España",
    postalCode: "30001",
    timeZone: "Europe/Madrid",
    locale: "es",
    currency: "EUR",
    status: BusinessStatus.active,
  },
  {
    title: "Consultoría Tech Solutions",
    slug: "consultoria-tech-solutions",
    description: "Servicios de consultoría tecnológica y desarrollo",
    email: "hola@techsolutions.com",
    phone: "+34 983 234 567",
    website: "https://techsolutions.com",
    address: "Paseo Zorrilla 45",
    city: "Valladolid",
    state: "Castilla y León",
    country: "España",
    postalCode: "47006",
    timeZone: "Europe/Madrid",
    locale: "es",
    currency: "EUR",
    status: BusinessStatus.active,
  },
  {
    title: "Restaurante Gourmet DelMar",
    slug: "restaurante-gourmet-delmar",
    description: "Alta cocina mediterránea con productos frescos",
    email: "reservas@delmar.com",
    phone: "+34 965 345 678",
    website: "https://delmar.com",
    address: "Explanada de España 12",
    city: "Alicante",
    state: "Valencia",
    country: "España",
    postalCode: "03001",
    timeZone: "Europe/Madrid",
    locale: "es",
    currency: "EUR",
    status: BusinessStatus.suspended,
  },
];

async function main() {
  console.log("🌱 Iniciando seed completo de la base de datos...\n");

  const now = new Date();

  // ==========================================
  // 1. CREAR USUARIOS
  // ==========================================
  console.log("👥 Creando usuarios...");
  const users = [];
  const userData = [
    { firstName: "María", lastName: "García", email: "maria.garcia@example.com", type: UserType.admin },
    { firstName: "Juan", lastName: "Rodríguez", email: "juan.rodriguez@example.com", type: UserType.customer },
    { firstName: "Ana", lastName: "Martínez", email: "ana.martinez@example.com", type: UserType.admin },
    { firstName: "Carlos", lastName: "López", email: "carlos.lopez@example.com", type: UserType.customer },
    { firstName: "Laura", lastName: "Fernández", email: "laura.fernandez@example.com", type: UserType.admin },
    { firstName: "Pedro", lastName: "Sánchez", email: "pedro.sanchez@example.com", type: UserType.customer },
  ];

  for (const data of userData) {
    try {
      const user = await prisma.user.create({
        data: {
          id: generateFirebaseId(),
          ...data,
          status: UserStatus.visible,
        },
      });
      users.push(user);
      console.log(`✅ Usuario creado: ${user.firstName} ${user.lastName}`);
    } catch (error: any) {
      if (error.code === "P2002") {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) users.push(existing);
        console.log(`⏭️  Usuario ya existe: ${data.email}`);
      }
    }
  }

  // ==========================================
  // 2. CREAR NEGOCIOS
  // ==========================================
  console.log("\n🏢 Creando negocios...");
  const businesses = [];
  for (const business of businessData) {
    try {
      const created = await prisma.business.create({
        data: business,
      });
      businesses.push(created);
      console.log(`✅ Negocio creado: ${created.title}`);
    } catch (error: any) {
      if (error.code === "P2002") {
        const existing = await prisma.business.findUnique({ where: { slug: business.slug } });
        if (existing) businesses.push(existing);
        console.log(`⏭️  Negocio ya existe: ${business.title}`);
      }
    }
  }

  // ==========================================
  // 3. CREAR CATEGORÍAS DE SERVICIOS
  // ==========================================
  console.log("\n📂 Creando categorías de servicios...");
  const categories: any[] = [];

  // Categorías específicas por tipo de negocio
  const categoryTemplates: Record<string, Array<{ name: string; description: string }>> = {
    "salon-belleza-elite": [
      { name: "Cortes de Cabello", description: "Cortes y peinados profesionales" },
      { name: "Coloración", description: "Tintes, mechas y tratamientos de color" },
      { name: "Tratamientos Capilares", description: "Hidratación, keratina y reparación" },
      { name: "Peinados", description: "Peinados para eventos especiales" },
      { name: "Extensiones", description: "Extensiones naturales y sintéticas" },
    ],
    "barberia-moderna": [
      { name: "Cortes", description: "Cortes de cabello para caballeros" },
      { name: "Barba", description: "Recorte y diseño de barba" },
      { name: "Tratamientos", description: "Tratamientos capilares masculinos" },
      { name: "Afeitado", description: "Afeitado clásico y moderno" },
    ],
    "spa-relax-wellness": [
      { name: "Masajes", description: "Masajes terapéuticos y relajantes" },
      { name: "Faciales", description: "Tratamientos faciales rejuvenecedores" },
      { name: "Corporales", description: "Tratamientos corporales reductivos" },
      { name: "Hidroterapia", description: "Terapias con agua" },
    ],
    "clinica-dental-sonrisa": [
      { name: "Limpieza", description: "Limpieza dental profesional" },
      { name: "Ortodoncia", description: "Tratamientos de ortodoncia" },
      { name: "Estética Dental", description: "Blanqueamiento y carillas" },
      { name: "Cirugía", description: "Extracciones y cirugías menores" },
    ],
    "gimnasio-fitzone": [
      { name: "Entrenamiento Personal", description: "Sesiones personalizadas" },
      { name: "Clases Grupales", description: "Spinning, zumba, crossfit" },
      { name: "Evaluaciones", description: "Evaluación física y planes" },
      { name: "Nutrición", description: "Asesoría nutricional" },
    ],
  };

  // Categorías genéricas para otros negocios
  const defaultCategories = [
    { name: "Servicios Básicos", description: "Servicios principales del negocio" },
    { name: "Servicios Premium", description: "Servicios de alta gama" },
    { name: "Paquetes", description: "Combinaciones de servicios" },
  ];

  // Crear categorías para cada negocio
  for (const business of businesses) {
    const businessCategories = categoryTemplates[business.slug] || defaultCategories;

    for (const catData of businessCategories) {
      try {
        const category = await prisma.serviceCategory.create({
          data: {
            ...catData,
            businessId: business.id,
          },
        });
        categories.push(category);
        console.log(`✅ Categoría creada: ${category.name} (${business.title})`);
      } catch (error: any) {
        if (error.code === "P2002") {
          const existing = await prisma.serviceCategory.findFirst({
            where: { businessId: business.id, name: catData.name },
          });
          if (existing) categories.push(existing);
          console.log(`⏭️  Categoría ya existe: ${catData.name}`);
        } else {
          console.log(`⏭️  Error creando categoría: ${catData.name}`);
        }
      }
    }
  }

  // ==========================================
  // 4. CREAR SERVICIOS
  // ==========================================
  console.log("\n💇 Creando servicios...");
  const services: any[] = [];

  // Servicios específicos por categoría
  const serviceTemplates: Record<string, Array<{ name: string; description: string; price: number; durationMinutes: number; active?: boolean }>> = {
    // Salón de Belleza
    "Cortes de Cabello": [
      { name: "Corte Dama", description: "Corte de cabello para damas con lavado", price: 35.00, durationMinutes: 45 },
      { name: "Corte Caballero", description: "Corte clásico o moderno para caballeros", price: 25.00, durationMinutes: 30 },
      { name: "Corte Infantil", description: "Corte para niños menores de 12 años", price: 20.00, durationMinutes: 25 },
      { name: "Corte + Peinado", description: "Corte completo con secado y peinado", price: 50.00, durationMinutes: 60 },
    ],
    "Coloración": [
      { name: "Tinte Completo", description: "Coloración de todo el cabello", price: 65.00, durationMinutes: 120 },
      { name: "Mechas Californianas", description: "Mechas degradadas estilo californiano", price: 85.00, durationMinutes: 150 },
      { name: "Balayage", description: "Técnica de coloración natural y difuminada", price: 95.00, durationMinutes: 180 },
      { name: "Retoque de Raíz", description: "Aplicación de tinte solo en la raíz", price: 45.00, durationMinutes: 90 },
      { name: "Decoloración", description: "Proceso de aclarado del cabello", price: 75.00, durationMinutes: 120 },
    ],
    "Tratamientos Capilares": [
      { name: "Hidratación Profunda", description: "Tratamiento intensivo de hidratación", price: 40.00, durationMinutes: 45 },
      { name: "Keratina Brasileña", description: "Alisado con keratina", price: 150.00, durationMinutes: 180 },
      { name: "Botox Capilar", description: "Rejuvenecimiento del cabello", price: 80.00, durationMinutes: 90 },
      { name: "Reconstrucción Capilar", description: "Tratamiento para cabello dañado", price: 55.00, durationMinutes: 60 },
    ],
    "Peinados": [
      { name: "Peinado Novia", description: "Peinado especial para novias", price: 120.00, durationMinutes: 90 },
      { name: "Peinado Fiesta", description: "Peinado elegante para eventos", price: 60.00, durationMinutes: 60 },
      { name: "Ondas o Rizos", description: "Modelado con ondas o rizos", price: 45.00, durationMinutes: 45 },
      { name: "Recogido", description: "Peinado recogido elaborado", price: 55.00, durationMinutes: 50 },
    ],
    // Barbería
    "Cortes": [
      { name: "Corte Clásico", description: "Corte tradicional con tijera", price: 20.00, durationMinutes: 30 },
      { name: "Corte Degradado", description: "Fade o degradado moderno", price: 25.00, durationMinutes: 35 },
      { name: "Corte + Diseño", description: "Corte con líneas y diseños", price: 35.00, durationMinutes: 45 },
      { name: "Rapado", description: "Corte al ras con máquina", price: 15.00, durationMinutes: 20 },
    ],
    "Barba": [
      { name: "Recorte de Barba", description: "Perfilado y recorte de barba", price: 15.00, durationMinutes: 20 },
      { name: "Diseño de Barba", description: "Diseño personalizado de barba", price: 25.00, durationMinutes: 30 },
      { name: "Barba Completa", description: "Lavado, recorte y aceites", price: 30.00, durationMinutes: 40 },
    ],
    "Afeitado": [
      { name: "Afeitado Clásico", description: "Afeitado con navaja y toalla caliente", price: 25.00, durationMinutes: 30 },
      { name: "Afeitado Facial", description: "Afeitado completo del rostro", price: 20.00, durationMinutes: 25 },
    ],
    // Spa
    "Masajes": [
      { name: "Masaje Relajante", description: "Masaje suave para relajación", price: 60.00, durationMinutes: 60 },
      { name: "Masaje Descontracturante", description: "Masaje profundo para tensiones", price: 75.00, durationMinutes: 60 },
      { name: "Masaje con Piedras Calientes", description: "Terapia con piedras volcánicas", price: 90.00, durationMinutes: 90 },
      { name: "Masaje Deportivo", description: "Masaje para atletas", price: 70.00, durationMinutes: 50 },
      { name: "Reflexología", description: "Masaje en puntos de presión", price: 50.00, durationMinutes: 45 },
    ],
    "Faciales": [
      { name: "Limpieza Facial Profunda", description: "Limpieza con extracción", price: 55.00, durationMinutes: 60 },
      { name: "Facial Antienvejecimiento", description: "Tratamiento rejuvenecedor", price: 85.00, durationMinutes: 75 },
      { name: "Facial Hidratante", description: "Hidratación intensiva", price: 65.00, durationMinutes: 60 },
      { name: "Peeling Químico", description: "Exfoliación química profesional", price: 95.00, durationMinutes: 45 },
    ],
    "Corporales": [
      { name: "Envoltura Corporal", description: "Tratamiento reductivo con envoltura", price: 80.00, durationMinutes: 90 },
      { name: "Exfoliación Corporal", description: "Eliminación de células muertas", price: 50.00, durationMinutes: 45 },
      { name: "Drenaje Linfático", description: "Masaje para eliminar toxinas", price: 70.00, durationMinutes: 60 },
    ],
    // Clínica Dental
    "Limpieza": [
      { name: "Limpieza Dental", description: "Profilaxis dental completa", price: 60.00, durationMinutes: 45 },
      { name: "Limpieza Profunda", description: "Raspado y alisado radicular", price: 120.00, durationMinutes: 90 },
    ],
    "Estética Dental": [
      { name: "Blanqueamiento", description: "Blanqueamiento dental profesional", price: 250.00, durationMinutes: 60 },
      { name: "Carillas Dentales", description: "Aplicación de carillas estéticas", price: 400.00, durationMinutes: 120, active: false },
    ],
    // Gimnasio
    "Entrenamiento Personal": [
      { name: "Sesión Individual", description: "Entrenamiento personalizado 1 hora", price: 45.00, durationMinutes: 60 },
      { name: "Pack 5 Sesiones", description: "5 sesiones de entrenamiento", price: 200.00, durationMinutes: 60 },
      { name: "Pack 10 Sesiones", description: "10 sesiones de entrenamiento", price: 350.00, durationMinutes: 60 },
    ],
    "Clases Grupales": [
      { name: "Spinning", description: "Clase de ciclismo indoor", price: 12.00, durationMinutes: 45 },
      { name: "Zumba", description: "Clase de baile fitness", price: 10.00, durationMinutes: 50 },
      { name: "CrossFit", description: "Entrenamiento funcional intenso", price: 15.00, durationMinutes: 60 },
      { name: "Yoga", description: "Clase de yoga relajante", price: 12.00, durationMinutes: 60 },
    ],
    "Evaluaciones": [
      { name: "Evaluación Física Completa", description: "Análisis de composición corporal", price: 40.00, durationMinutes: 45 },
      { name: "Plan de Entrenamiento", description: "Diseño de rutina personalizada", price: 60.00, durationMinutes: 60 },
    ],
  };

  // Servicios genéricos para categorías sin template
  const defaultServices = [
    { name: "Servicio Básico", description: "Servicio estándar", price: 30.00, durationMinutes: 30 },
    { name: "Servicio Completo", description: "Servicio completo", price: 50.00, durationMinutes: 60 },
    { name: "Servicio Premium", description: "Servicio de alta calidad", price: 80.00, durationMinutes: 90 },
  ];

  // Crear servicios para cada categoría
  for (const category of categories) {
    const categoryServices = serviceTemplates[category.name] || defaultServices;

    for (const serviceData of categoryServices) {
      try {
        const service = await prisma.service.create({
          data: {
            name: serviceData.name,
            description: serviceData.description,
            price: serviceData.price,
            durationMinutes: serviceData.durationMinutes,
            businessId: category.businessId,
            categoryId: category.id,
            active: "active" in serviceData ? serviceData.active : true,
          },
        });
        services.push(service);
        console.log(`✅ Servicio creado: ${service.name} (${category.name})`);
      } catch (error: any) {
        if (error.code === "P2002") {
          console.log(`⏭️  Servicio ya existe: ${serviceData.name}`);
        } else {
          console.log(`⏭️  Error creando servicio: ${serviceData.name}`);
        }
      }
    }
  }

  // ==========================================
  // 5. CREAR BUSINESS USERS (EMPLEADOS)
  // ==========================================
  console.log("\n👨‍💼 Creando empleados (BusinessUser con role=EMPLOYEE)...");
  const employees = [];

  for (let i = 0; i < Math.min(3, businesses.length); i++) {
    // Asignar 2 usuarios como empleados por negocio
    for (let j = 0; j < 2 && j < users.length; j++) {
      const user = users[i * 2 + j] || users[0];
      try {
        const businessUser = await prisma.businessUser.create({
          data: {
            userId: user.id,
            businessId: businesses[i].id,
            role: "EMPLOYEE",
            displayName: `${user.firstName} ${user.lastName}`,
            isActive: true,
          },
        });
        employees.push(businessUser);
        console.log(`✅ Empleado creado: ${businessUser.displayName} (${businesses[i].title})`);
      } catch (error: any) {
        if (error.code === "P2002") {
          // Ya existe, recuperarlo
          const existing = await prisma.businessUser.findUnique({
            where: {
              userId_businessId: {
                userId: user.id,
                businessId: businesses[i].id,
              },
            },
          });
          if (existing) employees.push(existing);
          console.log(`⏭️  Empleado ya existe`);
        } else {
          console.log(`⏭️  Error creando empleado`);
        }
      }
    }
  }

  // ==========================================
  // 6. ASIGNAR SERVICIOS A EMPLEADOS
  // ==========================================
  console.log("\n🔗 Asignando servicios a empleados...");

  for (const employee of employees) {
    const businessServices = services.filter(s => s.businessId === employee.businessId);

    // Asignar 2-3 servicios por empleado
    for (let i = 0; i < Math.min(3, businessServices.length); i++) {
      try {
        await prisma.employeeService.create({
          data: {
            businessUserId: employee.id,
            serviceId: businessServices[i].id,
            businessId: employee.businessId,
          },
        });
        console.log(`✅ Servicio asignado a empleado`);
      } catch (error: any) {
        if (error.code !== "P2002") {
          console.log(`⏭️  Error asignando servicio`);
        }
      }
    }
  }

  // ==========================================
  // 7. CREAR DISPONIBILIDAD DE EMPLEADOS
  // ==========================================
  console.log("\n📅 Creando horarios de disponibilidad...");

  for (const employee of employees) {
    // Horario de lunes a viernes
    for (let day = 1; day <= 5; day++) {
      try {
        await prisma.employeeAvailability.create({
          data: {
            businessUserId: employee.id,
            businessId: employee.businessId,
            dayOfWeek: day,
            startTime: new Date("2024-01-01T09:00:00Z"),
            endTime: new Date("2024-01-01T18:00:00Z"),
          },
        });
      } catch (error) {
        console.log(`⏭️  Error creando disponibilidad`);
      }
    }
    console.log(`✅ Horarios creados para empleado`);
  }

  // ==========================================
  // 8. CREAR EXCEPCIONES DE EMPLEADOS
  // ==========================================
  console.log("\n🚫 Creando excepciones de ejemplo...");

  if (employees.length > 0) {
    const futureDate1 = new Date(now);
    futureDate1.setDate(futureDate1.getDate() + 7);

    const futureDate2 = new Date(now);
    futureDate2.setDate(futureDate2.getDate() + 10);

    try {
      // Excepción 1: Todo el día (bloqueado) - Vacaciones
      await prisma.employeeException.create({
        data: {
          businessUserId: employees[0].id,
          businessId: employees[0].businessId,
          date: futureDate1,
          isAllDay: true,
          isAvailable: false,
          reason: "Vacaciones",
        },
      });
      console.log(`✅ Excepción creada: Vacaciones todo el día`);
    } catch (error) {
      console.log(`⏭️  Error creando excepción de vacaciones`);
    }

    try {
      // Excepción 2: Por horas (bloqueado) - Cita médica
      await prisma.employeeException.create({
        data: {
          businessUserId: employees[0].id,
          businessId: employees[0].businessId,
          date: futureDate2,
          isAllDay: false,
          startTime: new Date("2024-01-01T14:00:00Z"),
          endTime: new Date("2024-01-01T16:00:00Z"),
          isAvailable: false,
          reason: "Cita médica",
        },
      });
      console.log(`✅ Excepción creada: Cita médica 2:00 PM - 4:00 PM`);
    } catch (error) {
      console.log(`⏭️  Error creando excepción de cita médica`);
    }

    try {
      // Excepción 3: Por horas (disponible) - Horas extra
      await prisma.employeeException.create({
        data: {
          businessUserId: employees[1].id,
          businessId: employees[1].businessId,
          date: futureDate2,
          isAllDay: false,
          startTime: new Date("2024-01-01T18:00:00Z"),
          endTime: new Date("2024-01-01T20:00:00Z"),
          isAvailable: true,
          reason: "Horas extra",
        },
      });
      console.log(`✅ Excepción creada: Horas extra 6:00 PM - 8:00 PM`);
    } catch (error) {
      console.log(`⏭️  Error creando excepción de horas extra`);
    }
  }

  // ==========================================
  // 9. CREAR CITAS
  // ==========================================
  console.log("\n📆 Creando citas de ejemplo...");

  for (let i = 0; i < Math.min(5, employees.length); i++) {
    const employee = employees[i];
    const businessServices = services.filter(s => s.businessId === employee.businessId);

    if (businessServices.length > 0) {
      const service = businessServices[0];
      const startTime = new Date(now);
      startTime.setDate(startTime.getDate() + i + 1);
      startTime.setHours(10, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + service.durationMinutes);

      // Asignar un cliente (diferente al empleado)
      const customerIndex = (i + 1) % users.length;
      const customer = users[customerIndex];

      try {
        await prisma.appointment.create({
          data: {
            customerId: customer.id,                // Cliente que reserva
            providerBusinessUserId: employee.id,    // BusinessUser que da el servicio
            businessId: employee.businessId,
            serviceId: service.id,
            startTime,
            endTime,
            status: AppointmentStatus.scheduled,
            isGroup: false,
            notes: "Cita de ejemplo generada por seed",
          },
        });
        console.log(`✅ Cita creada: ${customer.firstName} con ${employee.displayName}`);
      } catch (error) {
        console.log(`⏭️  Error creando cita`);
      }
    }
  }

  // ==========================================
  // RESUMEN
  // ==========================================
  console.log("\n" + "=".repeat(50));
  console.log("✨ SEED COMPLETADO");
  console.log("=".repeat(50));
  console.log(`👥 Usuarios: ${await prisma.user.count()}`);
  console.log(`🏢 Negocios: ${await prisma.business.count()}`);
  console.log(`👨‍💼 BusinessUsers: ${await prisma.businessUser.count()}`);
  console.log(`📂 Categorías: ${await prisma.serviceCategory.count()}`);
  console.log(`💇 Servicios: ${await prisma.service.count()}`);
  console.log(`🔗 Servicios-Empleados: ${await prisma.employeeService.count()}`);
  console.log(`📅 Horarios: ${await prisma.employeeAvailability.count()}`);
  console.log(`📆 Citas: ${await prisma.appointment.count()}`);
  console.log("=".repeat(50) + "\n");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
