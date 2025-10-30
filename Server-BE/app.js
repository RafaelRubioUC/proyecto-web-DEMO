import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();
const PORT = 5000;
const JWT_SECRET = "llave-secreta";

app.use(cors());
app.use(bodyParser.json());

const users = [];

// verifica el token
function verifyToken(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = payload;
    next();
  });
}

// Rutas
app.get("/", (_req, res) => res.json({ ok: true }));

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Faltan campos" });
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "El correo ya existe" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), email, passwordHash };
  users.push(user);
  res.status(201).json({ ok: true });
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: "No se encontro el usuario" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: "Credenciales invalidas" });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Acceso concedido", user: req.user });
});

app.listen(PORT, () => console.log(`Server corriendo en http://localhost:${PORT}`));
