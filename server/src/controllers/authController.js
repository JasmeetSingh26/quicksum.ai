const prisma = require("../../prismaClient");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/tokenUtils");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id);
    // console.log(token);
    // console.log("------------------");

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // true in production
      sameSite: "None", // needed if your frontend and backend are on different domains; adjust if they share the same domain
      maxAge: 60 * 60 * 1000,
      // Optionally, set the domain if needed:
      // domain: ".yourdomain.com",
      path: "/",
    });

    return res.json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // true in production
    sameSite: "None", // needed if your frontend and backend are on different domains; adjust if they share the same domain
    maxAge: 60 * 60 * 1000,
    // Optionally, set the domain if needed:
    // domain: ".yourdomain.com",
    path: "/",
  });
  return res.json({ message: "Logged out successfully" });
};

module.exports = { login, register, logout };
