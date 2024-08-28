import { Router } from "express";

const userRouter = Router();

/**
 * The Router here
 */
userRouter.post("/register", (req, res) => {
    res.send("User register");
});

export default userRouter;