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

const Menu = sequelize.define('menus',
  {
    description: {
      type: Sequelize.STRING,
      field: "menu",
      allowNull: false
    },   
  },
  {
    timestamps: false,
    tableName: 'menu',
  })

  app.get("/menu",(req,res)=>{
    res.send("all menus")
  })

  const port =process.env.PORT|| 5000
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))