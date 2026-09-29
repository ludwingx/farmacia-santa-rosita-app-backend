require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  max: 3,
  connectionTimeoutMillis: 15000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Iniciando Semillado de la Base de Datos FSRA ---');

  // 1. Roles
  const roles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Farmacéutico' },
    { id: 3, name: 'Cajero' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: { name: role.name },
      create: role,
    });
  }
  console.log('✔ Roles asegurados (Administrador, Farmacéutico, Cajero)');

  // 2. Estados
  const statuses = [
    { id: 1, name: 'Activo' },
    { id: 2, name: 'Inactivo' },
  ];

  for (const status of statuses) {
    await prisma.status.upsert({
      where: { id: status.id },
      update: { name: status.name },
      create: status,
    });
  }
  console.log('✔ Estados asegurados (Activo, Inactivo)');

  // 3. Usuario Administrador Inicial
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin123',
      name: 'Administrador General',
      email: 'admin@farmaciasantarosita.com',
      ci: 1234567,
      role_id: 1,
      status_id: 1,
    },
  });
  console.log(`✔ Usuario Admin asegurado: ${adminUser.username} (contraseña: admin123)`);

  // 4. Categorías Iniciales
  const categories = [
    { name: 'Analgésicos y Antiinflamatorios', description: 'Medicamentos para alivio del dolor e inflamación' },
    { name: 'Antibióticos y Antivirales', description: 'Antimicrobianos y medicamentos bajo prescripción médica' },
    { name: 'Gastrointestinales', description: 'Antiácidos, digestivos y protectores gástricos' },
    { name: 'Respiratorios y Antigripales', description: 'Antihistamínicos, descongestionantes y jarabes' },
    { name: 'Vitaminas y Suplementos', description: 'Multivitamínicos, calcio y suplementos alimenticios' },
    { name: 'Cuidado Personal y Primeros Auxilios', description: 'Gasas, alcohol, apósitos y desinfectantes' },
  ];

  for (const cat of categories) {
    const existing = await prisma.category.findFirst({ where: { name: cat.name } });
    if (!existing) {
      await prisma.category.create({ data: cat });
    }
  }
  console.log('✔ Categorías farmacéuticas iniciales aseguradas');

  // 5. Ubicaciones de Almacenamiento
  const locations = [
    { location: 'Estantería A (Mostrador)', description: 'Productos de alta rotación y venta libre' },
    { location: 'Estantería B (General)', description: 'Medicamentos orales, tabletas y cápsulas' },
    { location: 'Refrigerador (Cadena de frío)', description: 'Insulinas, vacunas y termolábiles (2°C - 8°C)' },
    { location: 'Vitrina de Seguridad', description: 'Psicotrópicos y medicamentos controlados' },
  ];

  for (const loc of locations) {
    const existing = await prisma.storageLocation.findFirst({ where: { location: loc.location } });
    if (!existing) {
      await prisma.storageLocation.create({ data: loc });
    }
  }
  console.log('✔ Ubicaciones físicas iniciales aseguradas');

  // 6. Proveedores / Laboratorios Iniciales
  const suppliers = [
    { name: 'Droguería Inti S.A.', phone: '22441234', email: 'contacto@inti.com.bo', address: 'Av. Principal #100', contact_person: 'Carlos Mendoza' },
    { name: 'Laboratorios Bagó', phone: '22884567', email: 'ventas@bago.com.bo', address: 'Zona Industrial #45', contact_person: 'Elena Rojas' },
    { name: 'Laboratorios Cofar', phone: '22778899', email: 'pedidos@cofar.com.bo', address: 'Av. Farmacéutica #250', contact_person: 'Javier Morales' },
  ];

  for (const sup of suppliers) {
    const existing = await prisma.supplier.findFirst({ where: { name: sup.name } });
    if (!existing) {
      await prisma.supplier.create({ data: sup });
    }
  }
  console.log('✔ Proveedores iniciales asegurados');

  // 7. Productos de Muestra (si no hay productos)
  const productCount = await prisma.product.count();
  if (productCount === 0) {
    const firstCat = await prisma.category.findFirst();
    const firstSup = await prisma.supplier.findFirst();
    const firstLoc = await prisma.storageLocation.findFirst();

    const sampleProducts = [
      {
        name: 'Paracetamol 500mg x 20 Comprimidos',
        product_code: '7770001001',
        description: 'Analgésico y antipirético para alivio de dolores y fiebre',
        purchase_price: 5.50,
        selling_price: 10.00,
        initial_stock: 50,
        current_stock: 50,
        category_id: firstCat?.id,
        supplier_id: firstSup?.id,
        storage_location_id: firstLoc?.id,
        status_id: 1,
        lots: {
          create: {
            lot_number: 'LOT-2026-001',
            quantity: 50,
            initial_quantity: 50,
            expiration_date: new Date('2027-12-31'),
          }
        }
      },
      {
        name: 'Ibuprofeno 400mg x 10 Cápsulas Blandas',
        product_code: '7770001002',
        description: 'Antiinflamatorio no esteroideo para dolores musculares y articulares',
        purchase_price: 7.00,
        selling_price: 14.50,
        initial_stock: 30,
        current_stock: 30,
        category_id: firstCat?.id,
        supplier_id: firstSup?.id,
        storage_location_id: firstLoc?.id,
        status_id: 1,
        lots: {
          create: {
            lot_number: 'LOT-2026-002',
            quantity: 30,
            initial_quantity: 30,
            expiration_date: new Date('2027-06-30'),
          }
        }
      },
      {
        name: 'Amoxicilina 500mg x 21 Cápsulas',
        product_code: '7770001003',
        description: 'Antibiótico bactericida de amplio espectro',
        purchase_price: 15.00,
        selling_price: 25.00,
        initial_stock: 20,
        current_stock: 20,
        category_id: firstCat?.id,
        supplier_id: firstSup?.id,
        storage_location_id: firstLoc?.id,
        status_id: 1,
        lots: {
          create: {
            lot_number: 'LOT-2026-003',
            quantity: 20,
            initial_quantity: 20,
            expiration_date: new Date('2026-11-30'),
          }
        }
      }
    ];

    for (const prod of sampleProducts) {
      await prisma.product.create({ data: prod });
    }
    console.log('✔ Medicamentos de muestra iniciales creados con sus lotes');
  }

  console.log('--- Semillado completado con éxito ---');
}

main()
  .catch((e) => {
    console.error('Error durante el semillado:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
