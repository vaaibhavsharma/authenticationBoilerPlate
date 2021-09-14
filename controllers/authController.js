const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { promisify } = require("util");
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.secretKey, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user.id,
    },
  });
};

exports.working = async (req, res, next) => {
  user = req.user;
  res.status(200).json({
    status: "success",
    user,
  });
};

exports.signup = async (req, res, next) => {
  if (!(req.body.password == req.body.passwordConfirm)) {
    return res.status(201).json({
      status: "Failed",
      message: "Please check password",
    });
  } else {
    delete req.body.passwordConfirm;

    try {
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      createSendToken(newUser, 200, res);
    } catch (err) {
      return res.status(201).json({
        status: "Failed",
        err,
      });
    }
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // check if email exist
  if (!email && !password) {
    return res.status(200).json({
      status: "email password!!!",
    });
  }
  //check if user exiest and password is correct
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(200).json({
      status: "incorrect password!!!",
    });
  }
  createSendToken(user, 200, res);
};

exports.isLoggedIn = async (req, res, next) => {
  let token;
  // Get Token and checking if exist
  if (req.cookies.jwt && req.cookies.jwt != "loggedout") {
    token = req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next();
  }
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.secretKey);
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next();
    }
    req.user = freshUser;
  } catch (err) {
    return res.status(200).json({
      status: "isloggedIN",
      err,
    });
  }
  next();
};

exports.protect = async (req, res, next) => {
  let token;
  // Get Token and checking if exist

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (req.cookies.jwt && req.cookies.jwt != "loggedout") {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "Not Logged In",
    });
  }
  // Validate Token
  const decoded = await promisify(jwt.verify)(token, process.env.secretKey);

  //check if user still exist

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return res.status(401).json({
      status: "failed",
      message: "User No longer Exist!!",
    });
  }

  req.user = freshUser;
  next();
};

exports.logout = async (req,res,next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10*1000),
    httpOnly:true
  })
  res.status(200).json({status: 'Success'})
}