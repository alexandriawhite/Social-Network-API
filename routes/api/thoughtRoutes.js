const router = require('express').Router();
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
} = require('../../controllers/thoughtController');


router.get('/', getAllThoughts);
router.get('/:id', getThoughtById);
router.post('/:username', createThought);
router.put('/:id', updateThought);
router.delete('/:id', deleteThought);
router.post('/:id/reactions', addReaction);


module.exports = router;
