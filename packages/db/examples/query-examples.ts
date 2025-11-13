import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function examples() {
  console.log("📚 Ejemplos de Queries con los Datos del Seeder\n");

  // 1. Obtener un negocio con sus servicios
  console.log("1️⃣ Negocio con sus servicios:");
  const businessWithServices = await prisma.business.findFirst({
    where: { slug: "salon-belleza-elite" },
    include: {
      services: {
        include: {
          category: true,
        },
      },
      employees: true,
    },
  });
  console.log(JSON.stringify(businessWithServices, null, 2));

  // 2. Obtener empleados con sus servicios
  console.log("\n2️⃣ Empleados con sus servicios asignados:");
  const employeesWithServices = await prisma.employee.findMany({
    include: {
      user: true,
      business: true,
      employeeServices: {
        include: {
          service: true,
        },
      },
      employeeAvailability: true,
    },
  });
  console.log(`Total empleados: ${employeesWithServices.length}`);
  employeesWithServices.forEach((emp) => {
    console.log(`\n- ${emp.name} (${emp.business.title})`);
    console.log(`  Servicios: ${emp.employeeServices.length}`);
    console.log(`  Horarios: ${emp.employeeAvailability.length} días`);
  });

  // 3. Obtener citas con toda la información
  console.log("\n3️⃣ Citas programadas:");
  const appointments = await prisma.appointment.findMany({
    include: {
      provider: true,
      business: true,
      service: true,
    },
  });
  appointments.forEach((apt) => {
    console.log(`\n- ${apt.service.name} en ${apt.business.title}`);
    console.log(`  Provider: ${apt.provider?.firstName} ${apt.provider?.lastName}`);
    console.log(`  Fecha: ${apt.startTime.toLocaleString()}`);
    console.log(`  Duración: ${apt.service.durationMinutes} min`);
    console.log(`  Precio: $${apt.service.price}`);
    console.log(`  Estado: ${apt.status}`);
  });

  // 4. Servicios más caros
  console.log("\n4️⃣ Servicios más caros:");
  const expensiveServices = await prisma.service.findMany({
    orderBy: { price: "desc" },
    take: 5,
    include: {
      business: true,
      category: true,
    },
  });
  expensiveServices.forEach((svc) => {
    console.log(`- ${svc.name}: $${svc.price} (${svc.business.title})`);
  });

  // 5. Disponibilidad de un empleado específico
  console.log("\n5️⃣ Disponibilidad de María García:");
  const mariaEmployee = await prisma.employee.findFirst({
    where: { name: { contains: "María García" } },
    include: {
      employeeAvailability: {
        orderBy: { dayOfWeek: "asc" },
      },
    },
  });
  if (mariaEmployee) {
    console.log(`Empleado: ${mariaEmployee.name}`);
    mariaEmployee.employeeAvailability.forEach((avail) => {
      const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
      console.log(
        `  ${days[avail.dayOfWeek]}: ${avail.startTime.toISOString().slice(11, 16)} - ${avail.endTime.toISOString().slice(11, 16)}`
      );
    });
  }

  console.log("\n✅ Ejemplos completados!");
}

examples()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
