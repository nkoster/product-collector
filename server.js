require('dotenv').config()

const fs = require('fs')
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors());

app.get('/product/:code', (req, res) => {
  const code = req.params.code
  const fileName = `${process.env.PRODUCTS_DIR}/${code}.json`
  console.log(code, fileName)
  if (!code) {
    res.status(400).send(JSON.stringify({
      message: `Product code is required`
    }))
  }
  res.sendFile(fileName, {root: __dirname}, (error) => {
    if (error) {
      console.error(error)
      res.status(404).send(JSON.stringify({
        message: `Product ${code} not found`
      }))
    } else {
      console.log(`Sent ${fileName}`)
    }
  })
})

app.post('/product', (req, res) => {
  const product = req.body
  const code = product.code
  const fileName = `${process.env.PRODUCTS_DIR}/${code}.json`
  console.log(code)
  if (!code) {
    res.status(400).send(JSON.stringify({
      message: `Product code is required`
    }))
    return
  }
  fs.access(fileName, fs.constants.F_OK, (error) => {
    if (error) {
      console.log(`${fileName} does not exist`);
      fs.writeFile(fileName, JSON.stringify(product), (error) => {
        if (error) {
          console.error(error)
          res.status(500).send(JSON.stringify({
            message: `Product ${code} was NOT created`
          }))
        } else {
          res.status(201).send(JSON.stringify({
            message: `Product ${code} is created`
          }))
          console.log(`Text was written to ${fileName}`)
        }
      })
    } else {
      res.status(409).send(JSON.stringify({
        message: `Product ${code} already exists`
      }))
    }
  });
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
