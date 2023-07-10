const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const mongoose = require("mongoose")

//--Generate  user token
const generateToken = (id) => {
  //token contendo id, verificando o Secret e passando validade do login
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

//--Register user and sign in
const register = async (req, res) => {
  const { name, email, password } = req.body;

  //check if user exist
  const user = await User.findOne({ email }); //findOne by mongoose

  if (user) {
    res.status(422).json({ errors: ["Por favor, utilize outro e-mail!"] });
    return;
  }

  // Generate password hash (bcrypt: crypt password 'user')
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  //Create user .create by mongoose
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  //if user was created successfully, return the token
  if (!newUser) {
    res.status(422).json({
      errors: ["Houve um erro, por favor teste novamente mais tarde."],
    });
    return;
  }
  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

//--get current logged in user
const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json(user);
};

//--sign user in
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  //check if user exist
  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado."] });
    return;
  }

  //check if password matches
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha inválida!"] });
    return;
  }

  //return user with token
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

//--Update an user
const update = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;
  //debug reqUser._id
  //console.log(reqUser)
  const user = await User.findById(reqUser._id).select(
    "-password"
  );

  if (name) {
    user.name = name;
  }

  if (password) {
    // Generate password hash (bcrypt: crypt password 'user')
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }
  if (bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);
};

//-- Get user by id
const getUserById = async(req,res) =>{
  const {id} = req.params

  try {
    // console.log(id)
    const user = await User.findById(id).select("-password")

    //Check if user exist
    if(!user){
      res.status(404).json({errors: ["Usuário não encontrado."]});
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({errors: ["O usuário não foi encontrado."]});
  }

}


module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};
