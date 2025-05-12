import bcrypt from 'bcryptjs';
import User from '../../models/User';
import { transformUser } from './transformers';

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
        throw new Error("User already exists.");
      }

      const hashPassword = await bcrypt.hash(args.userInput.password, 12);
      const newUser = new User({
        email: args.userInput.email,
        password: hashPassword
      });

      const result = await newUser.save();
      return transformUser(result);
    } catch (error: any) {
      console.error("Error creating user:", error?.message);
      if (error?.message === "User already exists.") {
        throw new Error(error.message);
      }
      throw new Error("Creating user failed!");
    }
  }
};

export default userResolvers;
