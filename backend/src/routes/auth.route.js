
import express from 'express';
const router = express.Router();

router.get('/signup', (req, res) => {
    res.send('Auth route is working');
});

router.get('/login', (req, res) => {
    res.send('Login route is working');
});

router.get('/logout', (req, res) => {
    res.send('Logout route is working');
});




export default  router;