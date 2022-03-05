import bcrypt from "bcrypt";

const encryptPassword = async (plainPassword) =>
  await bcrypt.hash(plainPassword, 10);

export default encryptPassword;
