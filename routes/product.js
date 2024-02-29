const router = require('express').Router();
const product = require('../models/product');
const { verifyToken } = require('../validation');

//CRUD operations

//Create product - POST
router.post("/", verifyToken, (req, res) => {
    
    data = req.body;

    product.insertMany(data)
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( {message: err.message} ); })
});

//Read all products - GET
router.get("/", (req, res) => {
    product.find()
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( {message: err.message} ); })
});

//Read products in stock - GET
router.get("/instock", (req, res) => {
    product.find({inStock: true})
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( {message: err.message} ); })
});

//Read specific product - GET
router.get("/:id", (req, res) => {
    product.findById(req.params.id)
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( {message: err.message} ); })
});

//Update specific product - PUT
router.put("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    product.findByIdAndUpdate(id, req.body)
    .then(data => { 
        if(!data) {
            res.status(404).send( {message: "Product with id = " + id + " not found."} );
        }
        else {
            res.send( {message: "Product updated successfully."} );
        }
    })
    .catch(err => { res.status(500).send( {message: "Error updating product with id = " + id } ); })
});

//Delete specific product - DELETE
router.delete("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    product.findByIdAndDelete(id)
    .then(data => { 
        if(!data) {
            res.status(404).send( {message: "Product with id = " + id + " not found."} );
        }
        else {
            res.send( {message: "Product deleted successfully."} );
        }
    })
    .catch(err => { res.status(500).send( {message: "Error deleting product with id = " + id } ); })
});


module.exports = router;