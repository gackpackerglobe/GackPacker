const express = require('express');
const Admin = require('../model/admin.js')
const Package = require('../model/package.js')
const bcrypt = require('bcryptjs')
const fetch = require('node-fetch')
const jwt = require('jsonwebtoken');
const { compressAndOverwrite, upload } = require('../utils/imageCompresser.js');
const app = express();

const verifyAdmin = (req, res, next) => {
	try {
		if (req.cookies.admin_token) {
			let token = req.cookies.admin_token;
			console.log(token);
			let data = jwt.verify(token, process.env.JWT);
			console.log(data);
			next();
		}
		else {
			req.flash('error_messages', "Need Login");
			res.redirect('/login');
		}
	} catch (err) {
		req.flash('error_messages', "Server Error!");
		res.redirect('/');
	}
}

app.get('/', (req, res) => {
	res.render('index');
})
app.get('/contact', (req, res) => {
	res.render('contact')
})

app.get('/about', (req, res) => {
	res.render('about');
})
app.get('/login', (req, res) => {
	res.render('login');
})
app.post('/login', async (req, res) => {
	console.log(req.body);
	try {
		const { email, password } = req.body;
		const admin = await Admin.findOne({ email });
		if (!admin) {
			console.log("error");
			req.flash('error_messages', "You have no Admin Acess")
			return res.redirect('/login');
		}
		let check = await bcrypt.compare(password, admin.password);
		if (!check) {
			req.flash('error_messages', "Email/Password wrong")

			return res.redirect('/login');
		}
		let token = jwt.sign(admin._doc, process.env.JWT);
		res.cookie("admin_token", token, { maxAge: 24 * 3600 * 1000, httpOnly: true })
		res.redirect('/addPackage');
	} catch (error) {
		req.flash('error_messages', "Server Error!")
		return res.redirect('/login');
	}
})

app.get('/login', (req, res) => { res.render('login') })

app.get('/searchPackage', async (req, res) => {
	res.render('package');
})

app.get('/addPackage', verifyAdmin, (req, res) => { res.render('addPackage') })

app.get('/search', async (req, res) => {
	console.log(req.query);
	try {
		const places = await Package.aggregate([
			{
				'$match': {
					$or: [
						{
							'placeName': new RegExp(req.query.q, 'i')
						},
						{
							'city': new RegExp(req.query.q, 'i')
						},
						{
							'country': new RegExp(req.query.q, 'i')
						}, {
							'state': new RegExp(req.query.q, 'i')
						}
					]
				}
			}, {
				$project: {
					"itiny": 1,
					"sdate": 1,
					"edate": 1,
					"price": 1,
					placeName: 1,
					frontImg: {
						$arrayElemAt: ["$images", 0]
					},
					"city": 1,
					"country": 1,
					createdAt: 1,
				}
			}, {
				$sort: {
					createdAt: -1
				}
			}, {
				$skip: (parseInt(req.query.count) || 0) * 10,
			},
			{
				$limit: 10
			}
		]).exec();
		res.send(places);
	} catch (error) {
		console.log(error);
		res.status(500).json(error)
	}
})
app.get('/addPackage', (req, res) => {
	res.render('addPackage');
})
app.post('/addPackage', async (req, res) => {
	try {
		const { desc, itiny, sdate, edate, inclusion, exclusion, featured, price, state, country, city, placeName, images } = req.body.data;
		console.log(req.body.data.price)
		let newPackge = new Package({
			desc,
			images,
			itiny,
			sdate: new Date(req.body.data.sdate),
			edate: new Date(req.body.data.edate),
			inclusion,
			exclusion,
			featured,
			price: parseInt(req.body.data.price),
			state,
			country,
			city,
			placeName,
		})
		await newPackge.save();
		res.send({ success: true })
	} catch (error) {
		console.log(error);
		res.send({ success: false })
	}
})

app.get('/featuredPackage', async (req, res) => {
	try {
		let featuredPackages = await Package.aggregate([
			{
				$match: {
					featured: true,
				}
			},
			{
				$limit: 6,
			},
			{
				$project: {
					sdate: 1,
					edate: 1,
					price: 1,
					placeName: 1,
					featureImg: {
						$arrayElemAt: ["$images", 0]
					},
					country: 1,
				}
			}
		]).exec();
		res.send(featuredPackages);
	} catch (err) {
		res.status(500).json({ success: false, error: "Server Error!" });
	}
})


app.post('/fetchApis', (req, res, next) => {
	console.log(req.body);
	fetch(req.body.url).then(response => response.json()).then(data => {
		res.status(200).json(data)
	}).catch(error => {
		console.log(error);
		res.status(500).json({
			success: false,
			error: "Intenal Server Error!"
		})
	});
})

app.post('/uploadImage', upload.single('file'), (req, res, next) => compressAndOverwrite(req, res, next, 80, true, 0, 0, 600), (req, res) => {
	console.log(req.file);
	console.log(req.file.location)
	res.status(200).json(req.file)
})

app.get('/details', (req, res) => {
	res.render('details');
})
app.get('/details/:packageId', async (req, res) => {
	try {
		console.log(req.params.packageId);
		const { packageId } = req.params;
		const packge = await Package.find({ _id: packageId });
		res.json(packge);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			error: "Intenal Server Error!"
		})
	}
})

app.get('*', (req, res) => res.send("Page Not Found!"))


module.exports = app;