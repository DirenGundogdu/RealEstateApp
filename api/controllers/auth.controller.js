import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create user and save to db
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        })

        res.status(201).json({ message: "User created successfully" });

    } catch (err) {

        console.log(err);
        res.status(500).json({ message: "Failed creating user" });

    }

}

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { username }
        })

        if (!user) return res.status(401).json({ message: "Invalid Credentials!" });

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(401).json({ message: "Invalid Credentials!" });

        // res.setHeader('Set-Cookie', 'test=' + "MyValue").json({ message: "Logged in successfully" });

        const age = 1000 * 60 * 60 * 24 * 7;
        const token = jwt.sign({id:user.id},process.env.JWT_SECRET_KEY, {expiresIn: age });
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            maxAge: age,
        }).status(200).json({ message: "Logged in successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed logging in" });
    }
}

export const logout = (req, res) => {
    res.clearCookie("token").json({ message: "Logged out successfully" });
}