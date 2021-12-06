import express from 'express'
import { engine } from 'express-handlebars'
import dotenv from 'dotenv'

dotenv.config()
const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running")
});