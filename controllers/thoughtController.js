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
  const { thoughtText } = req.body;
  const { username } = req.params;

  try {
    const thought = await Thought.create({ thoughtText, username });
      await User.findOneAndUpdate(
        { username },
        { $push: { thoughts: thought._id } },
        { new: true }
      );
      res.status(201).json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create thought.' });
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
  const { id } = req.params;
  const { reactionBody, username } = req.body;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { $push: { reactions: { reactionBody, username } } },
      { new: true }
    );
    res.status(200).json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add reaction.' });
  }
}
}

module.exports = thoughtController;