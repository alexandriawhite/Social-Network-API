const router = require('express').Router();
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
} = require('../../controllers/thoughtController');

router.route('/').get(getAllThoughts).post(createThought);
router.route('/:id').get(getThoughtById).put(updateThought).delete(deleteThought);
router.route('/:id/reactions').post(addReaction);


module.exports = router;
