const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

const orders = []


const checkId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "Order not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const newMethod = (request, response, next) => {
    const method = request.method
    const url = request.url

    console.log(`method: ${method} url: ${url}`)

    next()
}

app.post('/orders', newMethod, (request, response) => {
    const { order, clientName, price, status } = request.body

    const requestNumber = { id: uuid.v4(), order, clientName, price, status }

    orders.push(requestNumber)

    return response.status(201).json(requestNumber)

})

app.get('/orders', newMethod, (request, response) => {
    return response.json(orders)

})

app.put('/orders/update/:id', checkId, newMethod, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updatedRequestNumber = { id, order, clientName, price, status }

    orders[index] = updatedRequestNumber

    return response.json(updatedRequestNumber)

})

app.delete('/orders/:id', checkId, newMethod, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()

})

app.get('/orders/:id', checkId, newMethod, (request, response) => {
    const index =  request.orderIndex
    return response.json(orders[index])
})

app.patch("/orders/status/:id", checkId, newMethod, (request, response) => {
    const index = request.orderIndex
    orders[index].status = "Pronto"
    return response.json(orders[index])
  })

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port} 🚀`)
})

