// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client'; // Lo script può usare il client normale
import { Role } from '@prisma/client'; // Importa l'enum separatamente
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // --- MODIFICA QUESTI VALORI ---
  const adminEmail = "admin@oltretravel.it";
  const adminPassword = "Badobado"; // Scegli una password robusta
  // -----------------------------

  console.log("Inizio creazione utente admin...");

  // Controlla se l'utente esiste già
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`L'utente con email ${adminEmail} esiste già.`);
    return;
  }

  // Hash della password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  console.log("Password hashata.");

  // Creazione dell'utente nel database
  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN, // Assegna il ruolo di ADMIN
      name: "Admin", // Puoi mettere un nome di default
    },
  });

  console.log("Utente admin creato con successo!");
  console.log(adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });