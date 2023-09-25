
const express = require('express');
const jwt = require("jsonwebtoken");
const config = require('./public/scripts/config');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.all('/user',(req, res, next) => {
    console.log('Por aqui pasamos');
    next();
});


//********User*********//
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

var username
var password
var tokenxd

app.post('/sinup', (req, res) => {

    //username = req.body.username
    //password = req.body.password

    console.log(`Post pagina de login ${req.body.username} `);
    console.log(`Post pagina de login ${req.body.password} `);
    


    if(`${req.body.username}` === 'Jose Perez' 
            && `${req.body.password}` === '29'){
            console.log('Nombre: ' + `${req.body.username}` + ', Password: ' + `${req.body.password}`);
            const user = {
                nombre : `${req.body.username}`,
                password: `${req.body.password}`
            }
            jwt.sign({user: user}, 'secretkey', {expiresIn:'60s'}, (err, token) => {
                //res.json({token: token});
                tokenxd = `${token}`,
                console.log(`el token es ${tokenxd} `)
                res.sendFile(__dirname + '/public/login.html');
            });
    }
    else{
            return res.status(401).json({
                auth: false,
                message: 'No token provided'
            });
    }
    
});

app.post('/sinin', verifyToken, (req, res) => {

    if(`${req.body.username}` === 'Jose Perez' 
            && `${req.body.password}` === '29'){

        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err){
                //res.sendStatus(403);
                res.sendFile(__dirname + '/public/error.html');
            }else{
                //res.json({
                //    mensaje: "Post fue Creado",
                //    authData: authData<
                //});
                res.sendFile(__dirname + '/public/index.html');
            }
        });
    }
    else{
            return res.status(401).json({
                auth: false,
                message: 'No token provided'
            });
    }

});

// prueba de token 
app.get('/index', verifyToken ,(req, res) => {

    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendFile(__dirname + '/public/error.html');
        }else{
            res.sendFile(__dirname + '/public/panels.html');
        }
    });
    
});


// Authorization: Bearer <token>
function verifyToken(req, res, next){

    const bearerHeader = `bearer ${tokenxd} `;

    //const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    }
    else{
        //res.status(401);
        res.sendFile(__dirname + '/public/error.html');
    }
}

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000,  http://localhost:3000/')
})