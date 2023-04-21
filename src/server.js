/**
 * @author Manas
 */
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')
const mongo = require('./config/mongo')
const { loggerUtil } = require('./utils/logger')

dotenv.config()
const app = express()
const logger = loggerUtil

//mongo connection func call
mongo()

const routes = require("./routes/index")

const { validationResult } = require('express-validator')

//testing
app.get('/api', (req , res) => {
	res.send("Hello from BUilt from Scratch API's!")
})

//validate req
app.use((req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		res.status(SC.WRONG_ENTITY).json({ error: errors.array() })
	}
	next()
})

//built-in middlewares
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cors())


// App Routes go here
routes(app)

//connection
const PORT =  process.env.PORT || 8002

app.listen(PORT, () => {
	logger(`Listening on port----------- ${PORT}`, 'SERVER')
})
