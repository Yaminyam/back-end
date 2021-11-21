var express = require('express');
var router = express.Router();

const User = require('../model/User');
const bcrypt = require('bcryptjs');

//회원가입
router.post('/', async (req, res) => {
	let { password, email } = req.body;
	try {
		const userExistence = await User.findOne({ where: { email } });
		if (userExistence)
			return res.status(204).send({ error: 'not vaild email' });
		const salt = await bcrypt.genSalt(10);
		req.body.password = await bcrypt.hash(password, salt);
		let userCreate = await User.create(req.body);
		if (userCreate) return res.send('user is inserted');
		else return res.status(204).send({ error: 'fail to create user' });
	} catch { }
});
//로그인
router.post('/login', async (req, res) => {
	let { password, email } = req.body;
	try {
		const userExistence = await User.findOne({ where: { email } });
		if (!userExistence) return res.status(204).send({ error: 'fail to login' });
		const check = await bcrypt.compare(password, userExistence.password);
		if (check) {
			let data = {};
			data.id = userExistence.id;
			data.username = userExistence.username;
			data.email = userExistence.email;
			data.progress = userExistence.progress;
			res.send(data);
		} else {
			res.status(204).send({ error: 'fail to login' });
		}
	} catch { }
});
//유저들조회
router.get('/', async (req, res) => {
	try {
		const users = await User.findAll();
		let data = users.map((user) => {
			let editUser = {};
			editUser.id = user.id;
			editUser.username = user.username;
			editUser.email = user.email;
			editUser.progress = user.progress;
			return editUser;
		});
		res.send(data);
	} catch { }
});
//유저조회
router.get('/:id', async (req, res) => {
	const paramId = req.params.id;
	try {
		const userFind = await User.findOne({ where: { id: paramId } });
		if (!userFind) return res.status(500).send({ error: 'not vaild user' });
		let data = {};
		data.id = userFind.id;
		data.username = userFind.username;
		data.email = userFind.email;
		data.progress = userFind.progress;
		res.send(data);
	} catch { }
});
//유저 progress 수정
router.put('/:id', async (req, res) => {
	const paramId = req.params.id;
	const user = await User.findOne({ where: { id: paramId } });
	user.progress = user.progress + 1;
	await user.save();
	res.send('updated user progress');
});
//유저삭제(참고API)
router.delete('/:id', async (req, res) => {
	const paramId = req.params.id;
	await User.destroy({ where: { id: paramId } });
	res.send('removed user');
});

module.exports = router;
