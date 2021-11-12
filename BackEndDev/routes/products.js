var express = require('express');
var router = express.Router();
var products = require("../mockData.json/products.json");


module.exports = function (db) {
	router
		.route('/')
		.get((req, res, next) => {
			res.json(products);
		})
		.post((req, res) => {
			// validate and post new products
		});
	router
		.route('/:id')
		.get((req, res, next) => {
			let found=false
			products.products.forEach((product) => { 
				if (product.product_id === String(req.params.id)) {
					res.send(product);
					found=true
				}
			});
			if (!found) {		
				res.status(404).send("not found"); 
			}
		});
	return router;
};
