require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

//security
const helmet = require('helmet')
const cors = require('cors')
const exp = require('express-rate-limit')
const xss = require('xss-clean')

const notFoundMiddleWare = require('./middleware/not-found')
const mongoDBError = require('./middleware/mongoDBErrors')
//files
const connectDB = require('./DB/Db')
const route = require('./router/routes')

app.set('trust proxy', 1)

app.use(xss({
    windowMs: 15 * 60 * 1000, 
	max: 100,
}))

//middleware
app.use(express.json())
app.use(helmet())
app.use(xss())
app.use(cors())



app.use('/api/v1',route)

app.use(notFoundMiddleWare)
app.use(mongoDBError)

const port = process.env.PORT || 3000


const start = async() =>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,() => console.log(`listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}


start()


