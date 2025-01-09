const { Router } = require("express");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const z = require("zod");
const { userModel } = require("../db");
const { purchaseModel } = require("../db");
const { courseModel } = require("../db");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");

userRouter.post("/signup", async function (req, res) {
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(100),
        firstName: z.string().min(3).max(30),
        lastName: z.string().min(3).max(30),
    });

    const parsedDataSuccess = requiredBody.safeParse(req.body);

    if (!parsedDataSuccess.success) {
        return res.json({
            message: "Incorrect Format",
            error: parsedDataSuccess.error,
        });
    }

    const { email, password, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);

    try {
        await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });
    } catch (e) {
        return res.status(400).json({
            message: "You are already signup",
        });
    }

    res.json({
        message: "Signed up Successfull",
    });
});

userRouter.post("/signin", async function (req, res) {
    const requireBody = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const parsedDataWithSuccess = requireBody.safeParse(req.body);

    if (!parsedDataWithSuccess.success) {
        return res.json({
            message: "Incorrect Data Fotrmat",
            error: parsedDataWithSuccess.error,
        });
    }

    const { email, password } = req.body;
    const user = await userModel.findOne({
        email: email,
    });

    if (!user) {
        return res.status(403).json({
            message: "Incorrect Credentials !",
        });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
        const token = jwt.sign(
            {
                id: user._id,
            },
            JWT_USER_PASSWORD
        );

        res.json({
            token: token,
        });
    } else {
        res.status(403).json({
            message: "Invalid credentials!",
        });
    }
});

userRouter.get("/purchases", userMiddleware, async function (req, res) {
    const userId = req.userId;
    const purchases = await purchaseModel.find({
        userId: userId,
    });

    if (!purchases) {
        return res.status(404).json({
            message: "No purchases found",
        });
    }

    const purchasesCourseIds = purchases.map((purchase) => purchase.courseId);

    const courseData = await courseModel.find({
        _id: { $in: purchasesCourseIds },
    });

    res.status(200).json({
        purchases,
        courseData,
    });
});

module.exports = {
    userRouter: userRouter,
};
