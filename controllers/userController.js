const { User, Thought } = require('../models');

const userController = {
  getUsers: async (req, res) => {
    try {
      const users = await User.find()
        .populate({ path: 'thoughts', select: '-__v' })
        .populate({ path: 'friends', select: '-__v' });
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getSingleUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  createUser: async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const deletedUser = await User.findOneAndDelete({ _id: req.params.userId });
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
  
      await Thought.deleteMany({ username: deletedUser.username });
  
      await User.updateMany(
        { _id: { $in: deletedUser.friends } },
        { $pull: { friends: deletedUser._id } }
      );
  
      res.json({ message: 'User deleted successfully!', deletedUser });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Failed to delete user!' });
    }
},

  updateUser: async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        req.params.userId,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
  },

  addFriend: async (req, res) => {
    console.log('You are adding a friend');
    console.log(req.body);
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.body } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  removeFriend: async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: { friendId: req.params.friendId } } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
