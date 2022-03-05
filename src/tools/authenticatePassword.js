import bcrypt from "bcrypt";

const authenticatePassword = async (plainPassword, encryptedPassword) =>
  await bcrypt.compare(plainPassword, encryptedPassword);

export default authenticatePassword;
