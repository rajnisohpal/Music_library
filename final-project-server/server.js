'use strict';



const express = require('express')
const DB = require('./dao')
const app = express()
const cors = require('cors')
app.use(express.static('public_html'))

//middleware

// parse the json body from req
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(cors())


//home page response
//GET the list of all the dresses
app.get("/", function (request, response) {
})


// REST API ------------------------------------------------------------------
app.get('/tracks', function (request, response) {
    DB.connect()
    DB.query("select * from track order by id asc", [], function (result) {
        console.log('Number of rows in table:' + result.rowCount)
        let reply = {}//initialize empty object
        //result.rowCount=0;//for testing only
        //response.send(result.rows)
        if (result.rowCount != 0) {
            reply.message = "Ok found " + result.rowCount + "track"
            reply.db_data = result.rows
            response.status(200).send(reply)
        }
        else {
            reply.message = "table empty"
            reply.db_data = {}
            response.status(404).send(reply)
        }
    })
})

////////////////////////// playlist get all
app.get('/playlists', function (request, response) {
    DB.connect()
    DB.query("select * from playlist order by id asc", [], function (result) {
        console.log('Number of rows in table:' + result.rowCount)
        let reply = {}//initialize empty object
        //result.rowCount=0;//for testing only
        //response.send(result.rows)
        if (result.rowCount != 0) {
            reply.message = "Ok found " + result.rowCount + "track"
            reply.db_data = result.rows
            response.status(200).send(reply)
        }
        else {
            reply.message = "table empty"
            reply.db_data = {}
            response.status(404).send(reply)
        }
    })
})


app.get('/tracks_list_all', function (request, response) {
    DB.connect()
    DB.query('select * from track', [], (result) => {
    let reply={};
        //response.render('master', { title: 'List of tracks', content: table_html })
        if (result.rowCount != 0) {
            reply.message = "Ok found " + result.rowCount + "track"
            reply.db_data = result.rows
            response.status(200).send(reply)
        }
        else {
            reply.message = "table empty"
            reply.db_data = {}
            response.status(404).send(reply)
        }
    });
});

app.get('/playlist/tracks', function (request, response) {
    DB.connect()
    DB.query('select * from track where playlist_id=$1', [request.query.id], (result) => {
    let reply={};
        //response.render('master', { title: 'List of tracks', content: table_html })
        if (result.rowCount != 0) {
            reply.message = "Ok found " + result.rowCount + "track"
            reply.db_data = result.rows
            response.status(200).send(reply)
        }
        else {
            reply.message = "table empty"
            reply.db_data = {}
            response.status(404).send(reply)
        }
    });
});

//---------------------------------------------------------------------------------------



// to delete------------------------------------------------------------------
//parameter in URl address

app.get('/detete/tracks/:id', function (request, response) {
    let id_from_url = request.params.id//id is from the url, the :id part
    if (id_from_url=="") {
        let reply = {}
        reply.message = "Error! id not set"
        reply, db_data = {}
        response.status(400).send(reply)
    } else {
        DB.connect()
        DB.query("select * from track where id=$1", [id_from_url], (result) => {


            let reply = {}//initialize empty object
            //result.rowCount=0;//for testing only
            //response.send(result.rows)
            if (result.rowCount != 0) {
                DB.query('delete from track where id=$1', [id_from_url], (result) => {
                    reply.message = "Ok 1 row deleted"
                    reply.db_data = {}
                    response.status(200).send(reply)
                })
            }
            else {
                reply.message = "track not found "
                reply.db_data = {}
                response.status(404).send(reply)
            }
        })
    }
})


//for insert
app.post("/tracks", function (req, res) {
    // id is from the form input name='id'
    console.log(req.body)
        let reply = {};
        DB.connect();
        DB.query(
            "insert into track(playlist_id,title,uri,master_id) values('"+req.body.playlist_id +"','"  +
            req.body.title +"','" +req.body.uri +"','" +req.body.master_id +"')",[],result => {
                reply.message = "track inserted";
                res.status(200).send(reply);
            });
            console.log(req.body)
   
});
app.listen(3001, function () {
    console.log('Server listening on port 3001')
})