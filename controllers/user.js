import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../model/user.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User Doesn't Exist." });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Incorrect Password" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User Already Exist" });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password Don't Match" });
    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await User.create({email, password:hashedPassword,name:`${firstName} ${lastName}`})
    const token = jwt.sign(
      { email: result.email, id: result._id },
      "test",
      { expiresIn: "1h" }
    );
    res.status(200).json({ result, token });

} catch (error) {
    res.status(500).json({ message: "something went wrong" });

}
};
