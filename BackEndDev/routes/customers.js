var express = require('express');
var router = express.Router();
var customers = require('../mockData.json/customers.json');
const { json } = require('express');

module.exports = function (db) {
	router
		.route('/')
		.get(async (req, res, next) => {
			// validation of user input
			try {
				// sql query
				const [rows, fields] = await db.query(
					`SELECT * FROM customer;`
				);
				// validation of db result
				if (rows) {
					res.json(rows);
				} else {
					// throw error if db returns nothing or errors out
					throw new Error('No Customers');
				}
				// send error status and send error message
			} catch (er) {
				res.status(400).send(er);
			}
		})
		.post(async (req, res) => {
			let validCustomer = false;
			const newCustomer = req.body;

			// validate newCustomer data fields (number and types)
			if (
				newCustomer.first_name &&
				typeof newCustomer.first_name === 'string' &&
				newCustomer.middle_name &&
				typeof newCustomer.middle_name === 'string' &&
				newCustomer.last_name &&
				typeof newCustomer.last_name === 'string' &&
				newCustomer.phone_country_code &&
				typeof newCustomer.phone_country_code === 'number' &&
				newCustomer.phone &&
				typeof newCustomer.phone === 'number' &&
				newCustomer.email &&
				typeof newCustomer.email === 'string' &&
				newCustomer.customer_notes &&
				typeof newCustomer.customer_notes === 'string' &&
				newCustomer.street &&
				typeof newCustomer.street === 'string' &&
				newCustomer.city &&
				typeof newCustomer.city === 'string' &&
				newCustomer.zip_code &&
				typeof newCustomer.zip_code === 'string' &&
				newCustomer.country &&
				typeof newCustomer.country === 'string'
			) {
				validCustomer = true;
			}

			if (validCustomer) {
				// logic to INSERT this customer into database here
				try {
					// start a transaction
					await db.beginTransaction();

					const newCustomerAdded = await db.query(
						`INSERT into customer 
						(customer_id, first_name, middle_name, last_name, phone_country_code, phone, email, customer_notes, street, city, zip_code, country)
						VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`,
						[
							newCustomer.customer_id,
							newCustomer.first_name,
							newCustomer.middle_name,
							newCustomer.last_name,
							newCustomer.phone_country_code,
							newCustomer.phone,
							newCustomer.email,
							newCustomer.customer_notes,
							newCustomer.street,
							newCustomer.city,
							newCustomer.zip_code,
							newCustomer.country,
						]
					);

					// commit the transaction
					await db.commit();

					res.send(newCustomer);
				} catch (er) {
					res.status(400).send(er);
				}
			} else {
				console.log('Invalid customer');
				res.status(404).send();
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
					`SELECT * FROM customer WHERE customer_id = ?;`,
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
				res.status(400).send('Customer not found');
			}
		})
		.put(async (req, res) => {
			const updatedCustomer = req.body;

			try {
				await db.beginTransaction();

				const existingCustomerUpdated = await db.query(
					`UPDATE customer SET 
					first_name = ?,
					middle_name = ?,
					last_name = ?,
					phone_country_code = ?,
					phone = ?,
					email = ?,
					customer_notes = ?,
					street = ?,
					city = ?,
					zip_code = ?,
					country = ?
					WHERE customer_id = ?;`,
					[
						updatedCustomer.first_name,
						updatedCustomer.middle_name,
						updatedCustomer.last_name,
						updatedCustomer.phone_country_code,
						updatedCustomer.phone,
						updatedCustomer.email,
						updatedCustomer.customer_notes,
						updatedCustomer.street,
						updatedCustomer.city,
						updatedCustomer.zip_code,
						updatedCustomer.country,
						req.params.id,
					]
				);

				await db.commit();

				if (existingCustomerUpdated[0].affectedRows > 0) {
					res.json(updatedCustomer);
				} else {
					throw new Error('not valid');
				}
			} catch (er) {
				res.status(400).send(er);
			}
		})
		.delete(async (req, res) => {
			try {
				await db.beginTransaction();

				const existingCustomerDeleted = await db.query(
					`DELETE FROM customer
					WHERE customer_id = ?;`,
					[req.params.id]
				);

				await db.commit();

				if (existingCustomerDeleted[0].affectedRows > 0) {
					res.send('Successfully deleted customer');
				} else {
					throw new Error('not valid');
				}
			} catch (er) {
				res.status(400).send('customer not found');
			}
		});

	return router;
};
