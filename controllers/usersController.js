const { User } = require('../models');

// Request Specification
// URL: /api/users
// Method: POST
// Request model:

// {
// "user_id": integer, # user's numeric id
// "user_name": string, # user's full name
// "balance": integer # user's wallet balance
// }

// Successful Response
// Upon successful operation, your API must return a 201 status code with the saved user object.
// Response status: 201 - Created
// Response model:

// {
// "user_id": integer, # user's numeric id
// "user_name": string, # user's full name
// "balance": integer # user's wallet balance
// }

// Examples
// Let's look at some example requests and responses.
// Example request:

// Request URL: [POST] http://localhost:8000/api/users
// Content Type: application/json
// Request Body:

// {
// "user_id": 1,
// "user_name": "Fahim",
// "balance": 100
// }

// Example successful response:
// Content Type: application/json
// HTTP Status Code: 201
// Response Body:

// {
// "user_id": 1,
// "user_name": "Fahim",
// "balance": 100
// }

//@ROUTE - /api/users
//@DESC - Add a user
//@METHOD - POST
const addUser = async (req, res) => {
  const { user_id, user_name, balance } = req.body;
  try {
    const user = new User({ user_id, user_name, balance });
    await user.save();
    res.status(201).json({ user_id, user_name, balance });
  } catch (error) {
    res.status(400).json({ error: error?.message });
  }
};

module.exports = { addUser };