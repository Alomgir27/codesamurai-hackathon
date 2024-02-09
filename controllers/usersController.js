const { User } = require('../models');
const { Station } = require('../models');
const { Train } = require('../models');



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



const getRouteByCost = async (stations, trains, from, to) => {
    //use dijkstra's algorithm to find the shortest path
    //optime can be cost or time 
    //from and to is station id
    //stations is an array of all stations
    //trains is an array of all trains
    let graph = {};
    for (let i = 0; i < stations.length; i++) {
        graph[stations[i].station_id] = [];
    }
    for (let i = 0; i < trains.length; i++) {
        for (let j = 0; j < trains[i].stops.length - 1; j++) {
            let from = trains[i].stops[j];
            let to = trains[i].stops[j + 1];
            let cost = to.fare;
            let capacity = trains[i].capacity;
            //here time is equall to null or hh:mm
            graph[from.station_id].push({ to: to.station_id, cost, time: to.arrival_time, train_id: trains[i].train_id , capacity });
        }
    }
    let visited = {};
    let previous = {};

    let queue = new PriorityQueue();
    for (let i = 0; i < stations.length; i++) {
        visited[stations[i].station_id] = false;
        previous[stations[i].station_id] = null;
    }
    let cost = {};
    for (let i = 0; i < stations.length; i++) {
        cost[stations[i].station_id] = Infinity;
    }
    cost[from] = 0;
    queue.enqueue(from, 0);
    while (!queue.isEmpty()) {
        let current = queue.dequeue();
        if (visited[current]) {
            continue;
        }
        visited[current] = true;
        for (let i = 0; i < graph[current].length; i++) {
            let neighbor = graph[current][i].to;
            let newCost = cost[current] + graph[current][i].cost;
            if (newCost < cost[neighbor] && graph[current][i].capacity > 0) {
                cost[neighbor] = newCost;
                previous[neighbor] = current;
                queue.enqueue(neighbor, newCost);
            }
        }
    }
    let path = [];
    let current = to;
    while (current) {
        path.push(current);
        current = previous[current];
    }
    path = path.reverse();
    if (path.length === 1) {
        return { message: `no routes available from station: ${from} to station: ${to}`, status: 403 };
    }
    let stationsInOrder = [];
    let totalCost = 0;
    let totalTime = 0;
    for (let i = 0; i < path.length - 1; i++) {
        let from = path[i];
        let to = path[i + 1];
        let train = graph[from].find(train => train.to === to);
        let station = stations.find(station => station.station_id === from);
        const fromDeparture = trains.find(train => train.train_id === train.train_id).stops.find(stop => stop.station_id === from).departure_time;
        const toStationArrive = trains.find(train => train.train_id === train.train_id).stops.find(stop => stop.station_id === to).arrival_time;
        stationsInOrder.push({ station_id: station.station_id, train_id: train.train_id, arrival_time: fromDeparture, departure_time: toStationArrive });
        totalCost += train.cost;
        totalTime += train.time;
    }
    return { cost: totalCost, time: totalTime, stations: stationsInOrder };
}
   
const convertTimeToMinutes = (time) => {
    if (time === null) return 0;
    let [hours, minutes] = time.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
}

const getRouteByTime = async (stations, trains, from, to) => {
    //use dijkstra's algorithm to find the shortest path
    //optime can be cost or time 
    //from and to is station id
    //stations is an array of all stations
    //trains is an array of all trains
    let graph = {};
    for (let i = 0; i < stations.length; i++) {
        graph[stations[i].station_id] = [];
    }
    for (let i = 0; i < trains.length; i++) {
        for (let j = 0; j < trains[i].stops.length - 1; j++) {
            let from = trains[i].stops[j];
            let to = trains[i].stops[j + 1];
            let time = to.arrival_time;
            let capacity = trains[i].capacity;
            //here time is equall to null or hh:mm
            graph[from.station_id].push({ to: to.station_id, cost: to.fare, time, train_id: trains[i].train_id , capacity });
        }
    }
    let visited = {};
    let previous = {};

    let queue = new PriorityQueue();
    for (let i = 0; i < stations.length; i++) {
        visited[stations[i].station_id] = false;
        previous[stations[i].station_id] = null;
    }
    let time = {};
    for (let i = 0; i < stations.length; i++) {
        time[stations[i].station_id] = Infinity;
    }
    time[from] = 0;
    queue.enqueue(from, 0);
    while (!queue.isEmpty()) {
        let current = queue.dequeue();
        if (visited[current]) {
            continue;
        }
        visited[current] = true;
        for (let i = 0; i < graph[current].length; i++) {
            let neighbor = graph[current][i].to;
            let newTime = convertTimeToMinutes(graph[current][i].time);
            if (newTime < time[neighbor] && graph[current][i].capacity > 0) {
                time[neighbor] = newTime;
                previous[neighbor] = current;
                queue.enqueue(neighbor, newTime);
            }
        }
    }
    let path = [];
    let current = to;
    while (current) {
        path.push(current);
        current = previous[current];
    }
    path = path.reverse();
    if (path.length === 1) {
        return { message: `no routes available from station: ${from} to station: ${to}`, status: 403 };
    }
    let stationsInOrder = [];
    let totalCost = 0;
    let totalTime = 0;
    for (let i = 0; i < path.length - 1; i++) {
        let from = path[i];
        let to = path[i + 1];
        let train = graph[from].find(train => train.to === to);
        let station = stations.find(station => station.station_id === from);
        const fromDeparture = trains.find(train => train.train_id === train.train_id).stops.find(stop => stop.station_id === from).departure_time;
        const toStationArrive = trains.find(train => train.train_id === train.train_id).stops.find(stop => stop.station_id === to).arrival_time;
        stationsInOrder.push({ station_id: station.station_id, train_id: train.train_id, arrival_time: fromDeparture, departure_time: toStationArrive });
        totalCost += train.cost;
        totalTime += train.time;
    }
    return { cost: totalCost, time: totalTime, stations: stationsInOrder };
}


const getRouteByCostTimeAfter = async (stations, trains, from, to, timeAfter) => {
    //use dijkstra's algorithm to find the shortest path
    //optime can be cost or time
    //from and to is station id
    //stations is an array of all stations
    //trains is an array of all trains
    let graph = {};
    for (let i = 0; i < stations.length; i++) {
        graph[stations[i].station_id] = [];
    }
    for (let i = 0; i < trains.length; i++) {
        for (let j = 0; j < trains[i].stops.length - 1; j++) {
            let from = trains[i].stops[j];
            let to = trains[i].stops[j + 1];
            let cost = to.fare;
            let time = to.arrival_time;
            let capacity = trains[i].capacity;
            //here time is equall to null or hh:mm
            graph[from.station_id].push({ to: to.station_id, cost, time, train_id: trains[i].train_id, capacity });
        }
    }
    let visited = {};
    let previous = {};

    let queue = new PriorityQueue();
    for (let i = 0; i < stations.length; i++) {
        visited[stations[i].station_id] = false;
        previous[stations[i].station_id] = null;
    }
    let cost = {};
    for (let i = 0; i < stations.length; i++) {
        cost[stations[i].station_id] = Infinity;
    }
    cost[from] = 0;
    queue.enqueue(from, 0);
    while (!queue.isEmpty()) {
        let current = queue.dequeue();
        if (visited[current]) {
            continue;
        }
        visited[current] = true;
        for (let i = 0; i < graph[current].length; i++) {
            let neighbor = graph[current][i].to;
            let newCost = cost[current] + graph[current][i].cost;
            let newTime = convertTimeToMinutes(graph[current][i].time);
            let timeAfterInMinutes = convertTimeToMinutes(timeAfter);
            if (newCost < cost[neighbor] && newTime > timeAfterInMinutes && graph[current][i].capacity > 0) {
                cost[neighbor] = newCost;
                previous[neighbor] = current;
                queue.enqueue(neighbor, newCost);
            }
        }
    }
    let path = [];
    let current = to;
    while (current) {
        path.push(current);
        current = previous[current];
    }
    path = path.reverse();
    if (path.length === 1) {
        return { message: `no routes available from station: ${from} to station: ${to}`, status: 403 };
    }
    let stationsInOrder = [];
    let totalCost = 0;
    let totalTime = 0;
    for (let i = 0; i < path.length - 1; i++) {
        let from = path[i];
        let to = path[i + 1];
        let train = graph[from].find(train => train.to === to);
        let station = stations.find(station => station.station_id === from);
        const fromDeparture = trains.find(train => train.train_id === train.train_id).stops.find(stop => stop.station_id === from).departure_time;
        const toStationArrive = trains.find(train => train.train_id === train.train_id).stops.find(stop => stop.station_id === to).arrival_time;
        stationsInOrder.push({ station_id: station.station_id, train_id: train.train_id, arrival_time: fromDeparture, departure_time: toStationArrive });
        totalCost += train.cost;
        totalTime += train.time;
    }
    return { cost: totalCost, time: totalTime, stations: stationsInOrder };
}
    


    
   



//@ROUTE - /api/routes?from={station_from}&to={station_to}&optimize={cost|time}
//@DESC - Get route
//@METHOD - GET
const getOptimalRoute = async (req, res) => {
    const { from, to, optimize } = req.query;
    try {
        const stations = await Station.find({});
        const trains = await Train.find({});
        if (optimize === 'cost') {
            const route = await getRouteByCost(stations, trains, from, to);
            if (route.message) {
                return res.status(route.status).json({ message: route.message });
            }
            res.status(200).json({ total_cost: route.cost, total_time: route.time, stations: route.stations });
        } else if (optimize === 'time') {
            const route = await getRouteByTime(stations, trains, from, to);
            if (route.message) {
                return res.status(route.status).json({ message: route.message });
            }
            res.status(200).json({ total_cost: route.cost, total_time: route.time, stations: route.stations });
        } else {
            res.status(400).json({ message: `invalid optimize: ${optimize}` });
        }
    } catch (error) {
        res.status(400).json({ error: error?.message });
    }
}





//@ROUTE - /api/tickets
//@DESC - Purchase a ticket
//@METHOD - POST
const purchaseTicket = async (req, res) => {
    const { wallet_id, time_after, station_from, station_to } = req.body;
    try {
        const stations = await Station.find({});
        const trains = await Train.find({});
        const wallet = await User.findOne({ user_id: wallet_id });
        if (!wallet) {
            return res.status(404).json({ message: `wallet with id: ${wallet_id} was not found` });
        }
        const route = await getRouteByCostTimeAfter(stations, trains, station_from, station_to, time_after);
        if (route.message) {
            return res.status(route.status).json({ message: route.message });
        }
        const totalCost = route.cost;
        if (wallet.balance < totalCost) {
            return res.status(402).json({ message: `recharge amount: ${totalCost - wallet.balance} to purchase the ticket` });
        }
        wallet.balance -= totalCost;
        await wallet.save();
        res.status(201).json({ ticket_id: 1, balance: wallet.balance, wallet_id, stations: route.stations });
    }
    catch (error) {
        res.status(400).json({ error: error?.message });
    }
}
   
    
    
    


module.exports = {
    addUser,
    getOptimalRoute,
    purchaseTicket
};