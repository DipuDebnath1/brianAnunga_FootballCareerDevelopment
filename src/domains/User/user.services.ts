import User from "./user.model";

const getAllUsers = async () => {
  return await User.find();
};

const userDetails = async (userId: string) => {
  return await User.findById(userId).select(
    "email name phoneNumber role image isEmailVerified"
  );
};

const userService = {
  getAllUsers,
  userDetails,
};

export default userService;
