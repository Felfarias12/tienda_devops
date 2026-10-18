const request = require("supertest");
const { app, setPool } = require("../app");

const producto = {
  id: 1,
  nombre: "Alimento Cachorro Premium",
  descripcion: "Sabor a pollo, razas pequenas",
  precio: 19990,
  stock: 15,
};

let pool;

beforeEach(() => {
  pool = { query: jest.fn() };
  setPool(pool);
  // Los errores esperados se registran con console.error; se silencian en los tests
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("GET /api/health", () => {
  it("responde 200 con estado ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("GET /api/productos", () => {
  it("devuelve la lista de productos", async () => {
    pool.query.mockResolvedValueOnce([[producto]]);
    const res = await request(app).get("/api/productos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([producto]);
  });

  it("responde 500 si falla la base de datos", async () => {
    pool.query.mockRejectedValueOnce(new Error("db caída"));
    const res = await request(app).get("/api/productos");
    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/obtener los productos/i);
  });
});

describe("GET /api/productos/:id", () => {
  it("devuelve el producto pedido", async () => {
    pool.query.mockResolvedValueOnce([[producto]]);
    const res = await request(app).get("/api/productos/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(producto);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), ["1"]);
  });

  it("responde 404 si no existe", async () => {
    pool.query.mockResolvedValueOnce([[]]);
    const res = await request(app).get("/api/productos/999");
    expect(res.status).toBe(404);
  });

  it("responde 500 si falla la base de datos", async () => {
    pool.query.mockRejectedValueOnce(new Error("db caída"));
    const res = await request(app).get("/api/productos/1");
    expect(res.status).toBe(500);
  });
});

describe("POST /api/productos", () => {
  it("crea un producto y responde 201", async () => {
    pool.query
      .mockResolvedValueOnce([{ insertId: 7 }])
      .mockResolvedValueOnce([[{ ...producto, id: 7 }]]);
    const res = await request(app)
      .post("/api/productos")
      .send({ nombre: producto.nombre, descripcion: producto.descripcion, precio: 19990, stock: 15 });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe(7);
  });

  it("guarda descripcion como null si no se envía", async () => {
    pool.query
      .mockResolvedValueOnce([{ insertId: 8 }])
      .mockResolvedValueOnce([[{ ...producto, id: 8, descripcion: null }]]);
    await request(app).post("/api/productos").send({ nombre: "Collar", precio: 5000, stock: 3 });
    expect(pool.query.mock.calls[0][1]).toEqual(["Collar", null, 5000, 3]);
  });

  it("responde 400 si falta el nombre", async () => {
    const res = await request(app).post("/api/productos").send({ precio: 100, stock: 1 });
    expect(res.status).toBe(400);
    expect(pool.query).not.toHaveBeenCalled();
  });

  it("acepta precio y stock en 0 (no los trata como faltantes)", async () => {
    pool.query
      .mockResolvedValueOnce([{ insertId: 9 }])
      .mockResolvedValueOnce([[{ ...producto, id: 9, precio: 0, stock: 0 }]]);
    const res = await request(app).post("/api/productos").send({ nombre: "Muestra", precio: 0, stock: 0 });
    expect(res.status).toBe(201);
  });

  it("responde 400 si falta el stock", async () => {
    const res = await request(app).post("/api/productos").send({ nombre: "X", precio: 100 });
    expect(res.status).toBe(400);
  });

  it("responde 500 si falla la base de datos", async () => {
    pool.query.mockRejectedValueOnce(new Error("db caída"));
    const res = await request(app).post("/api/productos").send({ nombre: "X", precio: 1, stock: 1 });
    expect(res.status).toBe(500);
  });
});

describe("PUT /api/productos/:id", () => {
  it("actualiza y devuelve el producto", async () => {
    pool.query
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      .mockResolvedValueOnce([[{ ...producto, stock: 99 }]]);
    const res = await request(app)
      .put("/api/productos/1")
      .send({ nombre: producto.nombre, descripcion: producto.descripcion, precio: 19990, stock: 99 });
    expect(res.status).toBe(200);
    expect(res.body.stock).toBe(99);
  });

  it("responde 404 si el producto no existe", async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app).put("/api/productos/999").send({ nombre: "X", precio: 1, stock: 1 });
    expect(res.status).toBe(404);
  });

  it("responde 400 si faltan campos obligatorios", async () => {
    const res = await request(app).put("/api/productos/1").send({ nombre: "X" });
    expect(res.status).toBe(400);
    expect(pool.query).not.toHaveBeenCalled();
  });

  it("responde 500 si falla la base de datos", async () => {
    pool.query.mockRejectedValueOnce(new Error("db caída"));
    const res = await request(app).put("/api/productos/1").send({ nombre: "X", precio: 1, stock: 1 });
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/productos/:id", () => {
  it("elimina el producto", async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app).delete("/api/productos/1");
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/eliminado/i);
  });

  it("responde 404 si no existe", async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app).delete("/api/productos/999");
    expect(res.status).toBe(404);
  });

  it("responde 500 si falla la base de datos", async () => {
    pool.query.mockRejectedValueOnce(new Error("db caída"));
    const res = await request(app).delete("/api/productos/1");
    expect(res.status).toBe(500);
  });
});