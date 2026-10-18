const mysql = require("mysql2/promise");
const { app, setPool } = require("./app");
 
const PORT = process.env.PORT || 3001;
 
const {
  DB_HOST = "10.0.2.134", // acá colocar la IP Privada EC2 DB
  DB_USER = "root",
  DB_PASSWORD = "admin123",
  DB_NAME = "tienda_perritos",
  DB_PORT = 3306,
} = process.env;
 
// Inicializar pool de conexiones
async function initDb() {
  try {
    const pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    setPool(pool);
    console.log("Pool de conexiones MySQL inicializado.");
  } catch (err) {
    console.error("Error al inicializar pool de MySQL:", err);
  }
}
 
// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
  await initDb();
});