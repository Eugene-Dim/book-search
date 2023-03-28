const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError('You need to be logged in!');
      
      const userData = await User.findById(user._id).select('-__v -password');
      return userData;
    }
  },
  
  Mutation: {
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
  
      if (!user) throw new AuthenticationError('No user found with this email address');
  
      const correctPw = await user.isCorrectPassword(password);
  
      if (!correctPw) throw new AuthenticationError('Incorrect credentials');
  
      const token = signToken(user);
  
      return { token, user };
    },
    
    saveBook: async (_, { book }, { user }) => {
      if (!user) throw new AuthenticationError('You need to be logged in!');
      
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { savedBooks: book } },
        { new: true }
      );
      
      return updatedUser;
    },
    
    removeBook: async (_, { bookId }, { user }) => {
      if (!user) throw new AuthenticationError('You need to be logged in!');
      
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      
      return updatedUser;
    },
  }
};

module.exports = resolvers;
