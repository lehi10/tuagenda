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
  const categoryData = [
    { name: "Cortes de Cabello", description: "Cortes y peinados profesionales" },
    { name: "Coloración", description: "Tintes y mechas" },
    { name: "Tratamientos Faciales", description: "Cuidado de la piel" },
    { name: "Masajes", description: "Terapias de relajación" },
    { name: "Manicura y Pedicura", description: "Cuidado de manos y pies" },
  ];

  // Crear categorías para los primeros 3 negocios
  for (let i = 0; i < Math.min(3, businesses.length); i++) {
    for (const catData of categoryData.slice(0, 3)) {
      try {
        const category = await prisma.serviceCategory.create({
          data: {
            ...catData,
            businessId: businesses[i].id,
          },
        });
        categories.push(category);
        console.log(`✅ Categoría creada: ${category.name} (${businesses[i].title})`);
      } catch (error) {
        console.log(`⏭️  Error creando categoría`);
      }
    }
  }

  // ==========================================
  // 4. CREAR SERVICIOS
  // ==========================================
  console.log("\n💇 Creando servicios...");
  const services = [];
  const serviceData = [
    { name: "Corte de Cabello", description: "Corte moderno y estilizado", price: 25.00, durationMinutes: 45 },
    { name: "Tinte Completo", description: "Coloración de todo el cabello", price: 60.00, durationMinutes: 120 },
    { name: "Mechas", description: "Mechas californianas o balayage", price: 80.00, durationMinutes: 150 },
    { name: "Masaje Relajante", description: "Masaje de cuerpo completo", price: 50.00, durationMinutes: 60 },
    { name: "Facial Hidratante", description: "Tratamiento facial profundo", price: 40.00, durationMinutes: 50 },
    { name: "Manicura", description: "Cuidado y decoración de uñas", price: 20.00, durationMinutes: 30 },
    { name: "Pedicura", description: "Cuidado completo de pies", price: 30.00, durationMinutes: 45 },
  ];

  for (let i = 0; i < Math.min(3, businesses.length); i++) {
    const businessCategories = categories.filter(c => c.businessId === businesses[i].id);

    for (let j = 0; j < Math.min(5, serviceData.length); j++) {
      try {
        const service = await prisma.service.create({
          data: {
            ...serviceData[j],
            businessId: businesses[i].id,
            categoryId: businessCategories[j % businessCategories.length]?.id || null,
            active: true,
          },
        });
        services.push(service);
        console.log(`✅ Servicio creado: ${service.name} (${businesses[i].title})`);
      } catch (error) {
        console.log(`⏭️  Error creando servicio`);
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
