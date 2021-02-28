const express = require('express')
const path = require('path')
const checkListRoute = require('./src/routes/CheckList')
const taskRoute = require('./src/routes/Task')
const rootRouter = require('./src/routes/index')
const methodOverride = require('method-override')
require('./config/database')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', rootRouter) 
app.use('/checklists', checkListRoute)
app.use('/checklists', taskRoute.fosterRoute)
app.use('/tasks', taskRoute.simpleRoute)

app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')

app.listen(30000, () => {
  console.log('Server started!')
})