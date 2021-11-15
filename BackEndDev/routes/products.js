//previous working version commented out
/*var express = require('express');
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
			products.products.forEach((product) => { 
				let found=false
				if (product.product_id === String(req.params.id)) {
					res.send(product);
					found=true
				}
			});
			if (!found) {		
			res.status(404).send(); 
			}
		});
	return router;
};*/

var express = require('express');
var router = express.Router();
var products = require("../mockdata/products");

    router
        .get(async (req, res, next) => {
            // validation of user input
            try {
                // sql query
                const [rows, fields] = await db.query(
                    `SELECT * FROM product;`
                );
                // validation of db result
                if (rows) {
                    res.json(rows);
                } else {
                    // throw error if db returns nothing or errors out
                    throw new Error('No Products');
                }
                // send error status and send error message
            } catch (er) {
                res.status(400).send(er);
            }
        });
    router
        .route('/:id')
        .get(async (req, res, next) => {
            try {
                // sql query
                const [
                    rows,
                    fields,
                ] = await db.query(
                    `SELECT * FROM product WHERE product_id = ?;`,
                    [req.params.id]
                );

                // validation of db result
                if (rows && rows.length > 0) {
                    res.json(rows);
                } else {
                    throw new Error('not valid');
                }
                // send error status and send error message
            } catch (er) {
                res.status(400).send('Product not found');
            }
        })
        .put(async (req, res) => {
            const updatedProduct = req.body;

            try {
                await db.beginTransaction();

                const existingProductUpdated = await db.query(

                    `UPDATE product SET 
                    product_SKU = ?,
                    product_price = ?,
                    product_name = ?,
                    product_quantity = ?,
                    product_description = ?,
                    image_url = ?
                    WHERE product_id = ?;`,
                    [
                        updatedProduct.product_SKU,
                        updatedProduct.product_price,
                        updatedProduct.product_name,
                        updatedProduct.product_quantity,
                        updatedProduct.product_description,
                        updatedProduct.image_url,
                        req.params.id,
                    ]
                );

                await db.commit();

                if (existingProductUpdated[0].affectedRows > 0) {
                    res.json(updatedProduct);
                } else {
                    throw new Error('not valid');
                }
            } catch (er) {
                res.status(400).send(er);
            }
        })

    return router;
