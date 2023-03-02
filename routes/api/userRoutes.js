const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
  addFriend,
  removeFriend
} = require('../../controllers/userController');

// // /api/courses
// router.route('/').get(getCourses).post(createCourse);

// /api/courses/:courseId
// router
  // .route('/:courseId')
  // router.get('/users', getUsers);
  // router.get('/users/:userId', getSingleUser);
  // router.post('/users', createUser);
  // router.delete('/users/:userId', deleteUser);
  // router.put('/users/:userId', updateUser);
  // router.post('/users/:userId/friends', addFriend);
  // router.delete('/users/:userId/friends/:friendId', removeFriend);
  router.route("/").get(getUsers).post(createUser);
  router.route("/:id").get(getSingleUser).put(updateUser).delete(deleteUser);
  router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);
module.exports = router;
