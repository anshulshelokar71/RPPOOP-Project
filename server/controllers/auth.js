import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Host from "../models/Host.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mis,
      password,
      picturePath,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      mis,
      password: passwordHash,
      picturePath,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Register Host

export const registerHost = async (req, res) => {
  try {
    const {
      Name,
      email,
      password,
      picturePath,
      studentsReg
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newHost = new Host({
      Name,
      email,
      password: passwordHash,
      picturePath,
      studentsReg
    });
    const savedHost = await newHost.save();
    res.status(201).json(savedHost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Loggin Host

export const loginHost = async (req, res) => {
  try {
    const { email, password } = req.body;
    const host = await Host.findOne({ email: email });
    if (!host) return res.status(400).json({ msg: "Host does not exist. " });

    const isMatch = await bcrypt.compare(password, host.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: host._id }, process.env.JWT_SECRET);
    delete host.password;
    res.status(200).json({ token, host });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
