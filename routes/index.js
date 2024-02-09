const express = require('express');
const router = express.Router();

// Add routes here
const usersController = require('../controllers/usersController');
const stationsController = require('../controllers/stationsController');
const trainsController = require('../controllers/trainsController');
const walletController = require('../controllers/walletController');


router.post('/users', usersController.addUser);
//trains
router.post('/trains', trainsController.addTrain);
//stations
router.post('/stations', stationsController.addStation);
router.get('/stations', stationsController.listStations);
router.get('/stations/:station_id/trains', stationsController.listTrains);
//wallets
router.get('/wallets/:wallet_id', walletController.getWallet);
router.put('/wallets/:wallet_id', walletController.updateWallet);
//tickets
router.post('/tickets', usersController.purchaseTicket);
router.get('/routes', usersController.getOptimalRoute);

module.exports = router;
