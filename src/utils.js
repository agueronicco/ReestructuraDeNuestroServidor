import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

export const PRIVATE_KEY = "CoderSecret";

export const generateToken = (user) =>
  jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);

      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

// fileSystem
const generateId = (array) => {
  return array.length === 0 ? 1 : array[array.length - 1]._id + 1;
};

const validateId = (id, array) => {
  return array.some((p) => p._id === Number(id));
};

const getAbsolutePath = async (relativePath) => {
  try {
    const absolutePath = path.join(__dirname, relativePath);
    if (!fs.existsSync(absolutePath))
      await fs.promises.writeFile(absolutePath, JSON.stringify([]));
    return absolutePath;
  } catch (error) {
    console.log(error);
  }
};

const writeInfo = async (data, path) => {
  try {
    return await fs.promises.writeFile(path, JSON.stringify(data, null, "\t"));
  } catch (error) {
    console.log(error);
  }
};

const readInfo = async (path) => {
  try {
    return await fs.promises.readFile(path, "utf-8");
  } catch (error) {
    console.log(error);
  }
};

export {
  __dirname,
  generateId,
  validateId,
  writeInfo,
  readInfo,
  getAbsolutePath,
};
