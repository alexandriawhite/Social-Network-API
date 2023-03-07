const { Thought, User } = require('../models');

const thoughtController = {
  //get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
    .populate({
      path: 'reactions',
      select:'-__V',
    })
    .select('-__V')
    .sort({ _id: -1 })
    .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve thoughts.' });
      });
  },

   // get thought by id
   getThoughtById(req, res) {
    const { id } = req.params;

    Thought.findOne({ _id: id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__V")
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: "No thought with this ID" });
        }
        res.json(thought);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve thought.' });
      });
  },

//create a new thought
async createThought(req, res) {
  try {
    // Find the user by their username
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }
    // Create the thought
    const thought = await Thought.create({ thoughtText: req.body.thoughtText, username: req.body.username });
    // Add the thought to the user's thoughts array
    user.thoughts.push(thought);
    // Save the updated user object
    await user.save();
    res.status(200).json({ message: "Thought created successfully.", thought });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating thought." });
  }
  },

//update a thought
async updateThought(req, res) {
  const { id } = req.params;
  const { thoughtText } = req.body;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { thoughtText },
      { new: true }
    );
    res.status(200).json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update thought.' });
  }
},

//delete a thought
async deleteThought(req, res) {
  const { id } = req.params;

  try {
    const deletedThought = await Thought.findByIdAndDelete(id);
    if (!deletedThought) {
      return res.status(404).json({ message: "No thought with this ID" });
    }
    await User.findOneAndUpdate(
      { username: deletedThought.username },
      { $pull: { thoughts: id } }
    );
    res.status(200).json({ message: 'Thought successfully deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete thought.' });
  }
},

// add a reaction to a thought
async addReaction(req, res) {
  const { thoughtId } = req.params; // updated parameter name
  const { reactionBody, username } = req.body;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId, // updated parameter name
      { $push: { reactions: { reactionBody, username } } },
      { new: true }
    );
    res.status(200).json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add reaction.' });
  }
},

// remove a reaction from a thought
async removeReaction(req, res) {
  const { thoughtId } = req.params;
  const { reactionId } = req.body;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { $pull: { reactions: { _id: reactionId } } },
      { new: true }
    );
    res.status(200).json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove reaction.' });
  }
},
}

module.exports = thoughtController;