import express from 'express';
import cookieParser from 'cookie-parser';
import PostRoutes from './routes/post.route.js';
import AuthRoutes from './routes/auth.route.js';

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use("/api/posts", PostRoutes );
app.use("/api/auth", AuthRoutes );




app.listen(8080, () => {
    console.log('Server is running on port 8080');
});