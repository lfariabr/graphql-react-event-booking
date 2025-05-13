import jwt, { JwtPayload } from "jsonwebtoken";

export function isAuth(req: any, res: any, next: any) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(" ")[1]; // Authorization: Bearer <token>
    if (!token || token === "") {
        req.isAuth = false;
        return next();
    }
    let decodedToken: string | JwtPayload;
    try {
        decodedToken = jwt.verify(token, "secret");
    } catch (error: any) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = (decodedToken as JwtPayload).userId;
    next();
}