import bcrypt from 'bcryptjs';
import User from '../../models/User';
import { transformUser } from './transformers';
import jwt from 'jsonwebtoken';

export const userResolvers = {
  users: async () => {
    try {
      const users = await User.find();
      return users.map((user: any) => transformUser(user));
    } catch (error: any) {
      console.error("Error fetching users:", error?.message);
      throw error;
    }
  },

  createUser: async (args: any) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("Sorry to inform you, but the user already exists.");
      }

      const hashPassword = await bcrypt.hash(args.userInput.password, 12);
      const newUser = new User({
        email: args.userInput.email,
        password: hashPassword,
        name: args.userInput.name
      });

      const result = await newUser.save();
      // console.log("User created:", result);
      return transformUser(result);
    } catch (error: any) {
      console.error("Error creating user:", error?.message);
      if (error?.message === "Sorry to inform you, but the user already exists.") {
        throw new Error(error.message);
      }
      throw new Error("Creating user failed!");
    }
  },
  login: async (args: any) => {
    try {
      const user = await User.findOne({ email: args.email });
      if (!user) {
        throw new Error("Sorry to inform you, but the user was not found!");
      }
      const isPasswordValid = await bcrypt.compare(args.password, user.password);
      if (!isPasswordValid) {
        throw new Error("Sorry to inform you, but the password is incorrect!");
      }
      const token = jwt.sign({ userId: user._id.toString() }, "secret", { expiresIn: "1h" });
      // console.log("Login successful:", user.email);
      return { 
        userId: user._id.toString(), 
        token: token, 
        tokenExpiration: 3600 
      };
    } catch (error: any) {
      console.error("Error logging in:", error?.message);
      throw error;
    }
  }
};

export default userResolvers;
