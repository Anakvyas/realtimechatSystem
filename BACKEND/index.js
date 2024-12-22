require('dotenv').config()

const express  =  require('express')
const passport  = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server =http.createServer(app);
const MongoStore = require('connect-mongo');




const connectDB = require('./lib/db.js')
const authrouter= require('./routers/authrouter.js')
const User = require('./models/user.js')
const message = require('./models/message.js')
connectDB();

const sessions = {
        secret: 'REALTIMECHATSYSTEM',
        resave: false,
        saveUninitialized: true,
        cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true,
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        ttl: 7 * 24 * 60 * 60,
    }),
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessions));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
}));

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

let allusers = {};

// for socket --------------------------------------------------
const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    }
  });
  
    io.on('connection',(socket)=>{
    console.log('user connected' + socket.id);



    socket.on('user-connected',(data)=>{
        console.log(data);
        allusers[data] = socket.id;
        io.emit('update-users', allusers);
    })



    socket.on('sendmessage', async(data)=>{
        const { messageData } = data;

        const {senderId ,receiverId,text,image} = messageData;

        const newmessage = new message({senderId: senderId , receiverId: receiverId,text: text,image: image});
        await newmessage.save();

        if(allusers[receiverId]){
            socket.to(allusers[receiverId]).emit('receivemessage',newmessage);
        }

       

        // socket.emit('receivemessage',{senderId,text,image});
    })



        socket.on('disconnect', () => {
            for (let id in allusers) {
                if (allusers[id] === socket.id) {
                    delete allusers[id];
                    break;
                }
            }
            console.log('user disconnected:: ' + socket.id);
            io.emit('update-users', allusers);
        });
        

})



// ----------------------------------------------

// after all middlewares
app.use('/user',authrouter);


server.listen(process.env.PORT, () =>{
    console.log("port is running ");
})