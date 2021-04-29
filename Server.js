const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/CRUD',(err,database)=>{
    if(err) return console.log(err)
    db = database.db('CRUD')
    app.listen(4000,()=>{
        console.log('Listening at the port number 4000')
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    db.collection('Inventory').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('homepage.ejs',{data : result})

    })
})

app.get('/create',(req,res)=>{
    res.render("add.ejs")
})

app.get('/updatestock',(req,res)=>{
    res.render("update.ejs")
})

app.get('/delete',(req,res)=>{
    res.render("delete.ejs")
})


app.get('/',(req,res)=>{
    console.log("hi");
    res.send("hello");
})


app.post('/AddData',(req,res)=>{
    var flag=0;
    db.collection('Inventory').find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i<result.length;i++){
            console.log(result[i].pid+" "+req.body.pid)
            if(result[i].pid==req.body.pid){
                flag=1;
                s=result[i].stock
                break
            }
        }
        if(flag!=1){
            db.collection('Inventory').save(req.body, (err,result)=>{
                if(err) return console.log(err)
                res.redirect('/')
            })
        }
        else{
            console.log("Invalid Product Id")
        }
    })


    
})

app.post('/update',(req,res)=>{

    db.collection('Inventory').find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i<result.length;i++){
            if(result[i].pid==req.body.pid){
                s=result[i].stock
                break
            }
        }
        db.collection('Inventory').findOneAndUpdate({pid : req.body.pid},{
            $set: {stock: parseInt(s)+parseInt(req.body.stock)}},{sort :{pid:-1}},
            (err,result)=>{
                if(err) return res.send(err)
                //console.log(req.body.pid+' stock updated')
                res.redirect('/')
            })
    })
})

app.post('/delete',(req,res)=>{
    db.collection('Inventory').findOneAndDelete({pid:req.body.pid},(err,result)=>{
        //console.log(req.body)
        //console.log(req.body.pid)
        if(err) return console.log(err)
        res.redirect('/')
    })
})