const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { formatDate } = require('../../../middleware/helpers'); 
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// C R E A T E S  A D M I N   U S E R  
const createUserIfEmpty = async () => {
  const userCount = await User.count(); 
  if (userCount === 0) {
    const adminUser = await User.findOne({ where: { username: 'admin123' } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        firstname: 'admin',
        lastname: 'adminuser',
        username: 'admin123',
        mobno: '9999999999',
        role: 'Admin',
        password: hashedPassword,
      });
      console.log('Admin user created successfully.');
    }
  }
};
createUserIfEmpty();



//@desc Get all users
//@route GET /users
//@access public
const getUsers = asyncHandler(async (req, res) => {
  try {
    const { limit, offset } = req.query;

    // Parse limit and offset from query parameters and convert them to integers
    const parsedLimit = parseInt(limit) || 10; // Default to 10 if limit is not provided
    const parsedOffset = parseInt(offset) || 0; // Default to 0 if offset is not provided

    // Fetch all users from the database with limit and offset applied
    const users = await User.findAll({
      limit: parsedLimit,
      offset: parsedOffset,
    });

    // Fetch the total count of users in the database
    const totalUsers = await User.count();

    // Convert createdAt and updatedAt fields to the "DD-MM-YYYY" format
    const responseUsers = users.map(user => {
      const responseUser = {
        ...user.toJSON(),
        createdAt: formatDate(user.createdAt),
        updatedAt: formatDate(user.updatedAt),
        
      };
      delete responseUser.password;
      return responseUser;
    });

    res.status(200).json({ users: responseUsers, count: totalUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//@desc Create a user
//@route POST /users
//@access public
const createUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, username, password, role, mobno } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required." });
    return;
  }

  // Check if the user already exists
  const userAvailable = await User.findOne({ raw: true, where: { username: username } });
  if (userAvailable) {
    res.status(400).json({ message: "User already registered!" });
    return;
  }
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
    
    // Create the user
    const user = await User.create({
      firstname,
      lastname,
      username,
      password: hashedPassword,
      role,
      mobno,
    });

    console.log(`User created ${user}`);

    // Exclude the 'password' field from the response
    const responseUser = { ...user.toJSON() };
    delete responseUser.password;

    res.status(201).json(responseUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//@desc Get a user by user_id
//@route GET users/:user_id
//@access public
const getUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.user_id;

    // Find the user by user_id
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Exclude the 'password' field from the response
    const responseUser = { ...user.toJSON() };
    delete responseUser.password;
    res.status(200).json(responseUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//@desc Update user by user_id
//@route PUT /api/users/:user_id
//@access public
const updateUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.user_id;
    const { firstname, lastname, username,mobno } = req.body;

    // Find the user by user_id
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.firstname = firstname;
    user.lastname = lastname;
    user.username=username;
    user.mobno = mobno;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//@desc Update Password by user_id
//@route PUT /users/password/:user_id
//@access public
const changePassword = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.user_id;
    const { password } = req.body;

    // Find the user by user_id
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "User Password updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//@desc Delete user by user_id
//@route DELETE /users/:user_id
//@access public
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.user_id;

    // Find the user by user_id
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//@desc Login user
//@route POST /users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required." });
    return;
  }
  const user = await User.findOne({raw: true, where: {username: username} });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          id: user.user_id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
    
      { expiresIn: "15m" }
    );
    res.status(200).json({
      access_token: accessToken,
      token_type: "bearer",
      role: user.role.toLowerCase(), // assuming role is stored in lowercase
      user_id: user.user_id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
    });
  } else {
    res.status(401).json({ message:"username or password is not valid"});
  }
});





//@desc User archive by user_id
//@route PUT /users/archive/:user_id
//@access public
const archiveUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.user_id;
    // Find the user by user_id
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isActive = false;
    
    await user.save();
    res.status(200).json({ message: "User archived successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//@desc User retrive by user_id
//@route PUT /users/retrive/:user_id
//@access public
const retriveUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.user_id;
    // Find the user by user_id
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isActive = true;
    
    await user.save();
    res.status(200).json({ message: "User retrived successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//@desc Search user by firstname, lastname, username and role
//@route POST /users/search
//@access public
const searchUsers = asyncHandler(async (req, res) => {
  try {
    const { limit, offset, char } = req.query;
    const str = char.trim()
    // Parse limit and offset from query parameters and convert them to integers
    const parsedLimit = parseInt(limit) || 10; // Default to 10 if limit is not provided
    const parsedOffset = parseInt(offset) || 0; // Default to 0 if offset is not provided

    let whereCondition = {}; // Initialize an empty object for the WHERE condition

    // If search parameter is provided, add conditions for username and first name
    if (str) {
      whereCondition = {
        // username: char
        [Op.or]: [
          { username: { [Op.like]: `%${str}%` } },
          { firstName: { [Op.like]: `%${str}%` } },
          { lastname: { [Op.like]: `%${str}%` } },
          { role: { [Op.like]: `%${str}%` } },
        ],
        [Op.and]: { role: { [Op.notIn]: ['admin', 'Admin'] } }
      };
    }

    // Fetch all users from the database with limit, offset, and search applied
    const users = await User.findAll({
      limit: parsedLimit,
      offset: parsedOffset,
      where: whereCondition, // Apply the WHERE condition
    });

    // Fetch the total count of users in the database with the same where condition
    const totalUsers = await User.count({ where: whereCondition });

    res.status(200).json({ users, count: totalUsers });

  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = { 
  getUsers, 
  createUser, 
  getUser, 
  updateUser, 
  deleteUser, 
  loginUser, 
  changePassword, 
  archiveUser, 
  retriveUser, 
  searchUsers
};
