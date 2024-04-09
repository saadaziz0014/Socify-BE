import jwt from 'jsonwebtoken'
import { config } from '../config';
export const authentication = (req: any, res: any, next: any) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, config.jwtSecret, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded.user;
        next();
    });
}