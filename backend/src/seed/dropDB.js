require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const dropDatabase = async () => {
  if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI no encontrado en .env');
    process.exit(1);
  }

  console.log('Conectando a MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Conectado a: ${mongoose.connection.name}`);

  // Eliminar todas las colecciones una por una para ver el progreso
  const collections = await mongoose.connection.db.listCollections().toArray();

  if (collections.length === 0) {
    console.log('La base de datos ya está vacía.');
  } else {
    for (const col of collections) {
      await mongoose.connection.db.dropCollection(col.name);
      console.log(`  Colección eliminada: ${col.name}`);
    }
    console.log(`\nListo — ${collections.length} colección(es) eliminada(s).`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

dropDatabase().catch((err) => {
  console.error('Error al limpiar la base de datos:', err.message);
  process.exit(1);
});
