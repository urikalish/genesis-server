"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var socket_io_1 = __importDefault(require("socket.io"));
var compression_1 = __importDefault(require("compression"));
var express_session_1 = __importDefault(require("express-session"));
var body_parser_1 = __importDefault(require("body-parser"));
var morgan_1 = __importDefault(require("morgan"));
var chalk_1 = __importDefault(require("chalk"));
var errorhandler_1 = __importDefault(require("errorhandler"));
var lusca_1 = __importDefault(require("lusca"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_flash_1 = __importDefault(require("express-flash"));
var path_1 = __importDefault(require("path"));
var mongoose_1 = __importDefault(require("mongoose"));
var passport_1 = __importDefault(require("passport"));
var express_validator_1 = __importDefault(require("express-validator"));
var express_status_monitor_1 = __importDefault(require("express-status-monitor"));
var node_sass_middleware_1 = __importDefault(require("node-sass-middleware"));
var http = __importStar(require("http"));
var socket_service_1 = __importDefault(require("./services/socket-service"));
var serial_service_1 = __importDefault(require("./services/serial-service"));
/**
 * API keys and Passport configuration.
 */
var api_1 = __importDefault(require("./routes/api"));
var auth_1 = __importDefault(require("./routes/auth"));
var MongoStore = require('connect-mongo')(express_session_1.default);
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv_1.default.load({ path: '.env.example' });
/**
 * Connect to MongoDB.
 */
mongoose_1.default.set('useFindAndModify', false);
mongoose_1.default.set('useCreateIndex', true);
mongoose_1.default.set('useNewUrlParser', true);
mongoose_1.default.connect(process.env.MONGODB_URI);
mongoose_1.default.connection.on('error', function (err) {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk_1.default.red('✗'));
    process.exit();
});
/**
 * Create server.
 */
var app = express_1.default();
var server = http.Server(app);
var io = socket_io_1.default(server);
/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT);
app.use(express_1.default.static('dist'));
app.use(express_status_monitor_1.default());
app.use(compression_1.default());
app.use(node_sass_middleware_1.default({
    src: path_1.default.join(__dirname, 'public'),
    dest: path_1.default.join(__dirname, 'public')
}));
app.use(morgan_1.default('dev'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_validator_1.default());
app.use(express_session_1.default({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 },
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        autoReconnect: true
    })
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_flash_1.default());
// app.use((req, res, next) => {
//   lusca.csrf()(req, res, next);
// });
app.use(lusca_1.default.xframe('SAMEORIGIN'));
app.use(lusca_1.default.xssProtection(true));
app.disable('x-powered-by');
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});
app.use('/', express_1.default.static(path_1.default.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/js/lib', express_1.default.static(path_1.default.join(__dirname, 'node_modules/popper.js/dist/umd'), { maxAge: 31557600000 }));
app.use('/js/lib', express_1.default.static(path_1.default.join(__dirname, 'node_modules/bootstrap/dist/js'), { maxAge: 31557600000 }));
app.use('/js/lib', express_1.default.static(path_1.default.join(__dirname, 'node_modules/jquery/dist'), { maxAge: 31557600000 }));
app.use('/webfonts', express_1.default.static(path_1.default.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), {
    maxAge: 31557600000
}));
/**
 * App routes.
 */
app.use('/api', api_1.default);
app.use('/auth', auth_1.default);
app.get('*', function (request, response) {
    response.sendFile(path_1.default.resolve(__dirname, '../../dist', 'index.html'));
});
/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler_1.default());
}
/**
 * Init SocketIO
 */
socket_service_1.default.initialize(io);
/**
 * Init Serial Port
 */
serial_service_1.default.initialize();
/**
 * Start server.
 */
server.listen(app.get('port'), function () {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk_1.default.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});
exports.default = app;
//# sourceMappingURL=server.js.map