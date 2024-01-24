// server/schemas/resolver.js:
const Event = require('../models/event');
const Album = require('../models/album');
const Merch = require('../models/merch');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    events: async () => {
      return await Event.find({});
    },
    albums: async () => {
      return await Album.find({});
    },
    merch: async () => {
      return await Merch.find({});
    },
    // Example of a protected query
    protectedData: async (parent, args, context) => {
      console.log("Context user:", context.user);
    
      // Directly setting a user object for testing
      const testUser = { userId: "testUserId" };
      console.log("Direct test user set in resolver:", testUser);
    
      if (!testUser) {
        throw new Error('Not authenticated');
      }
    
      // Here, you can implement logic to return data based on the authenticated user
      return "This data is protected and you are authenticated to see it";
    },
    // Add other queries as necessary
  },
  Mutation: {
    login: async (parent, { input }) => {
      const { username, password } = input;
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error('Invalid password');
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      return {
        token,
        user,
      };
    },
    register: async (parent, { input }) => {
      const { username, password, firstName, lastName, email } = input;
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error('Username is already taken');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email,
      });
      await newUser.save();

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      return {
        token,
        user: newUser,
      };
    },
    // Add other mutations as necessary
  },
};

module.exports = resolvers;