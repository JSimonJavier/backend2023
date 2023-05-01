const express = require('express')
const ProductManager = require('./productManager.js')
const product_manager = new ProductManager('./src/files.json')

const app = express()
const PORT = 8080

app.use(express.json())

app.use(express.urlencoded({ extended: true }))


app.get('/products', async (req, res) => {

    try {

        const limit = req.query.limit
        const products = await product_manager.getProducts()

        if (limit) {
            return res.status(200).json(products.slice(0, limit))
        }

        return res.status(200).json(products)

    } catch (error) {

        return res.status(500).json({ message: 'error' })

    }

})


app.get('/products/:id', async (req, res) => {

    try {

        const id = req.params.id
        const productID = await product_manager.getProductsById(parseInt(id))

        if (!productID) {
            return res.status(404).json({ message: 'No se encontro el producto' })
        }

        return res.status(200).json(productID)

    } catch (error) {

        return res.status(500).json({ message: 'error' })

    }

})


app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}`);
})