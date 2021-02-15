require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('config');
const bearerToken = require('express-bearer-token');


//helpers
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// api config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bearerToken());
app.use(require('connect-multiparty')());
app.use(express.static(path.join(__dirname, 'public')));


//routes
require("./helpers/object-helpers");

const headrMiddleware = require('./middlewares/headers-middleware');
const responseMiddleware = require('./middlewares/response-middleware')

app.use(responseMiddleware);
app.use(headrMiddleware);

require('./app-start/route-init')(app).then(app => {
    const errorAuthMiddleware = require('./middlewares/error-handler-middleware');

    app.use(errorAuthMiddleware);

    app.listen(config.get('api-config').port, () => {
        console.log(`server is running ${config.get('api-config').port}`)
    });
});
module.exports = app;

