#!/usr/bin/env node

/**
 * Script para verificar la conexión a la base de datos
 */

const { PrismaClient } = require("./generated/prisma");

async function checkDatabase() {
  const prisma = new PrismaClient();

  try {
    console.log("🔍 Verificando conexión a la base de datos...\n");

    // Intenta conectarse
    await prisma.$connect();
    console.log("✅ Conexión exitosa a PostgreSQL");

    // Verifica que las tablas existan
    const userCount = await prisma.user.count();
    const businessCount = await prisma.business.count();

    console.log(`✅ Tabla 'users' encontrada (${userCount} registros)`);
    console.log(`✅ Tabla 'business' encontrada (${businessCount} registros)`);

    console.log("\n🎉 La base de datos está correctamente configurada!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error al conectar con la base de datos:");
    console.error(error.message);
    console.log("\n💡 Soluciones posibles:");
    console.log("   1. Verifica que Docker esté corriendo: docker ps");
    console.log("   2. Inicia la base de datos: pnpm db:start");
    console.log("   3. Aplica las migraciones: pnpm db:migrate");
    console.log(
      "   4. Verifica DATABASE_URL en packages/db/.env\n"
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
