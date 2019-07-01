const fs = require("fs");
const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const db = jsonServer.router(path.resolve(__dirname, "../", "database", "db.json"));
const routes = JSON.parse(fs.readFileSync(__dirname + "/routes.json"));
const middlewares = jsonServer.defaults();

const port = 3000;
const host = "localhost";
const serverurl = `http://${host}:${port}`;


let actions = {
    "000050": {
        dispatchedMaterials: [],
        reservedMaterials: [],
        cancelledReservations: []
    },
    "000041": {
        dispatchedMaterials: [],
        reservedMaterials: [],
        cancelledReservations: []
    }
};

server.use(middlewares);

// PUT ROUTES
// server.put('/material/555051/reservation', (req, res) => {
//   res.sendStatus(200, "reservation updated")
// });


server.get('/engineer/000050/actions', (req, res) => {
    res.status(200).json(actions["000050"]);
});

server.get('/engineer/000041/actions', (req, res) => {
    res.status(200).json(actions["000041"]);
});

// server.post('/material/555051/reservation', (req, res) => res.status(200));

server.use(jsonServer.bodyParser);

server.use((req, res, next) => {

    if (req.method === "PUT" && req.originalUrl === "/material/555051/reservation" && req.body && req.body.material) {

        const {body} = req;
        const {material, guid} = body;
        const {quantity} = material;
        const {materialCode, owner, engineerId} = material;
        const engineerActions = actions[engineerId];

        if (quantity !== undefined && quantity === 0) {

            const newCancellation = {
                materialCode,
                owner,
                quantity,
                engineerId,
                inbound: true,
                "reservationDateTime": Date.now()
            };

            const existingCancelledReservations = actions[engineerId].cancelledReservations;
            const cancelledReservations = [...existingCancelledReservations, newCancellation];

            const newActions = {...engineerActions, cancelledReservations};
            actions[engineerId] = newActions;

            res.status(200);//.json({'message': 'reservation cancelled'});

        } else {
            res.status(200);//.json({'message': 'reservation updated'});
        }

        res.end();

        return;
    }

    if (req.method === "POST" && req.originalUrl === "/material/555051/reservation" && req.body && req.body.material) {

        const {body} = req;
        const {material, guid} = body;
        const {quantity, materialCode, engineerId, owner} = material;
        const engineerActions = actions[engineerId];

        if (quantity !== undefined && quantity > 0) {

            const reservedMaterials = [
                {
                    materialCode,
                    owner,
                    quantity,
                    engineerId,
                    inbound: true,
                    "reservationDateTime": Date.now()
                }
            ];

            const newActions = {...engineerActions, reservedMaterials};
            actions[engineerId] = newActions;

            res.status(200).json({'message': 'reservation created'});
            res.end();
            return;
        }
    }

    next()
});

server.use(jsonServer.rewriter(routes));
server.use(db);

server.listen(port, () => {
    console.log(`JSON Server is running at ${serverurl}`)
});

