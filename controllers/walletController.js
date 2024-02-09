const { User } = require('../models');


// User
// The user object represents the person using the app. The server will receive requests on behalf of an app user
// identified by user_id. The following model represents a user:
// Field Type Description
// user_id integer User's ID
// user_name string User's full name
// balance integer User's wallet balance

//wallets

//wallets
// router.get('/wallets/:wallet_id', walletsController.getWallet);
// router.put('/wallets/:wallet_id', walletsController.updateWallet);

// Wallet

// For this problem, you will not have to maintain a separate wallet. However, we will simulate a basic wallet
// functionality with the user object. The wallet ID of a user will be the same as its user's ID.
// Get Wallet Balance
// Find the wallet balance of a user from the wallet ID.
// Request Specification
// URL: /api/wallets/{wallet_id} # Wallet ID is part of the path parameter.
// Method: GET
// Request model: None
// Successful Response
// Upon successful operation, your API must return a 200 status code with the wallet objects.
// Response status: 200 - Ok
// Response model

// {
// "wallet_id": integer, # user's wallet id
// "balance": integer, # user's wallet balance
// "wallet_user":
// {
// "user_id": integer, # user's numeric id
// "user_name": string # user's full name
// }
// }

// Failed Response
// If a wallet does not exist with the given ID, your API must return a 404 status code with a message.
// Response status: 404 - Not Found
// Response model

// {
// "message": "wallet with id: {wallet_id} was not found"
// }

// Replace {wallet_id} with the wallet ID from request.
// Examples

// Let's look at some example requests and responses.
// Example request:
// Request URL: [GET] http://localhost:8000/api/wallets/1
// Example successful response:
// Content Type: application/json
// HTTP Status Code: 200
// Response Body:

// {
// "wallet_id": 1,
// "wallet_balance": 100,
// "wallet_user": {
// "user_id": 1,
// "user_name": "Fahim"
// }
// }

// Example request:
// Request URL: [GET] http://localhost:8000/api/wallets/67
// Example failed response:
// Content Type: application/json
// HTTP Status Code: 404
// Response Body:

// {
// "message": "wallet with id: 67 was not found"
// }

//here wallet_id is the user_id

//@ROUTE - /api/wallets/:wallet_id
//@DESC - Get wallet balance
//@METHOD - GET
const getWallet = async (req, res) => {
  const wallet_id = req.params.wallet_id;
  try {
        const user = await User.findOne({ user_id: wallet_id });
        if (!user) {
          return res.status(404).json({ message: `wallet with id: ${wallet_id} was not found` });
        }
        res.status(200).json({ wallet_id: user.user_id, balance: user.balance, wallet_user: { user_id: user.user_id, user_name: user.user_name } });
    } catch (error) {
        res.status(400).json({ error: error?.message });
    }
}

//@ROUTE - /api/wallets/:wallet_id
//@DESC - Update wallet balance
//@METHOD - PUT
const updateWallet = async (req, res) => {
    const wallet_id = req.params.wallet_id;
    const { recharge } = req.body;
    try {
        const user = await User.findOne({ user_id: wallet_id });
        if (!user) {
          return res.status(404).json({ message: `wallet with id: ${wallet_id} was not found` });
        }
        if (recharge < 100 || recharge > 10000) {
          return res.status(400).json({ message: `invalid amount: ${recharge}` });
        }
        user.balance += recharge;
        await user.save()
        //send the updated user object
        const updatedUser = await User.findOne({ user_id: wallet_id });
        res.status(200).json({ wallet_id: updatedUser.user_id, balance: updatedUser.balance, wallet_user: { user_id: updatedUser.user_id, user_name: updatedUser.user_name } });

    }
    catch (error) {
        res.status(400).json({ error: error?.message });
    }
}


module.exports = {
  getWallet,
  updateWallet
}