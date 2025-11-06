import { PrismaClient, BusinessStatus } from "@prisma/client";

const prisma = new PrismaClient();

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
  console.log("🌱 Iniciando seed de negocios...");

  // Verificar si ya existen negocios
  const existingBusinesses = await prisma.business.count();

  if (existingBusinesses > 0) {
    console.log(`⚠️  Ya existen ${existingBusinesses} negocios en la base de datos.`);
    console.log("❓ ¿Deseas continuar? (Esto agregará más negocios)");
    // Si quieres eliminar los existentes, descomenta la siguiente línea:
    // await prisma.business.deleteMany({});
  }

  // Crear los negocios
  let created = 0;
  for (const business of businessData) {
    try {
      await prisma.business.create({
        data: business,
      });
      created++;
      console.log(`✅ Creado: ${business.title}`);
    } catch (error: any) {
      if (error.code === "P2002") {
        console.log(`⏭️  Saltado (ya existe): ${business.title}`);
      } else {
        console.error(`❌ Error creando ${business.title}:`, error.message);
      }
    }
  }

  console.log(`\n✨ Seed completado: ${created}/${businessData.length} negocios creados`);
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
