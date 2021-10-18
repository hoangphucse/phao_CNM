const express = require('express')
const AWS = require('aws-sdk')
require('dotenv').config({ path: __dirname + '/.env' })

const app = express()

app.set('view engine', 'ejs')
app.set('views', './templates')
app.use(express.json({ extended: false }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./css'))

AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
})

const docClient = new AWS.DynamoDB.DocumentClient()

app.listen(3000, () => {
  console.log('server is running')
})

const TABLE_NAME = 'Company'

app.get('/', (req, res) => {
  const params = {
    TableName: TABLE_NAME,
  }

  docClient.scan(params, (err, data) => {
    if (err) {
      console.log(err)
      return res.send('Internal server error')
    } else {
      return res.render('home', { data: data.Items })
    }
  })
})

app.get('/products/:id', (req, res) => {
  const { id } = req.params
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id,
    },
  }

  docClient.get(params, (err, data) => {
    if (err) {
      console.log(err)
      return res.send('Internal server error')
    } else {
      return res.render('product', { data: data.Item })
    }
  })
})

app.get('/products/delete//:id', (req, res) => {
  const { id } = req.params
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id,
    },
  }

  docClient.delete(params, (err, data) => {
    if (err) {
      console.log(err)
      return res.send('Internal server error')
    } else {
      return res.redirect('/')
    }
  })
})

app.post('/', (req, res) => {
  const { id, name, url_image } = req.body
  const params = {
    TableName: TABLE_NAME,
    Item: {
      id,
      name,
      url_image,
    },
  }

  docClient.put(params, (err, data) => {
    if (err) {
      return res.send('Internal server error')
    } else {
      return res.redirect('/')
    }
  })
})
