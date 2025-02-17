 const Sequelize = require('sequelize')
 const sequelize = new Sequelize(process.env.DATABASE_URL||'postgres://postgres:secret@localhost:5432/game', { define: { timestamps: false } })
 const express = require('express')
 const app = express()
const bodyParser = require('body-parser')
//app.use(express.static('public'))
app.use(bodyParser.json())

sequelize.sync() .then(() => {
  console.log('Sequelize updated database schema')
})
.catch(console.error)

const Teaminfo = sequelize.define('teaminfos',
  {
    description: {
      type: Sequelize.STRING,
      field: "description",
      allowNull: false
    },   
  },
  {
    timestamps: false,
    tableName: 'teaminfos',

  })



  const GameSchedule = sequelize.define('gameschedules',
  {
    score: {
      type: Sequelize.STRING,
      field: "score",
      allowNull: false
    },
    isWinner: {
      type: Sequelize.BOOLEAN,
      field: "isWinner",
      allowNull: false
    },  
    hasBeenPlayed: {
      type: Sequelize.BOOLEAN,
      field: "hasBeenPlayed",
      allowNull: false
    },
    opponent: {
      type: Sequelize.STRING,
      field: "opponent",
      allowNull: false
    }, 
    date: {
      type: Sequelize.DATE,
      field: "date",
      allowNull: false
    },  
  },
  {
    timestamps: false,
    tableName: 'gameschedules',

  })

app.get("/",(req,res)=>{
  res.send("hello world")
})
//menu table
const Menu = sequelize.define('menus',
  {
    description: {
      type: Sequelize.STRING,
      field: "menu",
      allowNull: false
    },  
  date:{
    type: Sequelize.DATE,
  }
  },
  {
    timestamps: false,
    tableName: 'menu',
  })

 const data = app.get("/menu",(req,res)=>{
  const time = req.body.queryResult.parameters.time
  Menu.findAll()
  .then(menuItem=>{
    res.json({menuItem, time})
  })
  .catch(console.error())
})



app.post("/webhook",(req,res)=>{  
 
 console.log("webhook enter");
  console.log(req.body );
 console.log(JSON.stringify(req.body ));

  
  if (req.body.queryResult.action === "schedule") {
  
  }
 else if (req.body.queryResult.action === "menu") {
   
   res.json({
            fulfillmentText: "Great! I've set your reservation for $number person on "+req.body.queryResult.parameters.date+" at"+ req.body.queryResult.parameters.time+". Do you have any special occasion?",
        });
  }
 else if (req.body.queryResult.action === "menuType") {
   console.log('hi',req.body.queryResult.action)
  
   res.json({
            fulfillmentText: "Great! "
        });
  }
  else if (req.body.queryResult.action === "teaminfo")
  {  
      Teaminfo.findByPk(req.params.id)
      .then(team => {    
        if (!team){
          res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'game schedule'
        })
          
        }
        else{
          return res.json({
            speech: team.description,
            displayText: team.description,
            source: 'team info'
        });
        }
      })
      .catch(error => next(error))
    
    }  
})


 const port =process.env.PORT|| 5000
 app.listen(port, () => console.log(`Example app listening on port ${port}!`))
