const {Router} = require("express");
const adminRouter = Router();
const {adminModel} = require("../db");
const {courseModel} = require("../db");
const {adminMiddleware} = require("../middleware/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const z = require("zod");
const {JWT_ADMIN_PASSWORD} = require("../config");

adminRouter.post("/signup", async function(req, res){
    const requiredBody = z.object({
        email: z.string().email().min(5),
        password: z.string().min(5),
        firstName: z.string().min(3),
        lastName: z.string().min(3),
    });

    const parsedDataSuccess = requiredBody.safeParse(req.body);

    if(!parsedDataSuccess.success){
        return res.json({
            message: "Incorrect Format",
            error: parsedDataSuccess.error
        });
    }

    const {email, password, firstName, lastName} = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);

    try{
        await adminModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });
    } catch(e){
        return res.status(400).json({
            message: "You are already signup",
        });
    }

    res.json({
        message: "Sign-up Successfull"
    });
});

adminRouter.post("/signin", async function(req, res){
    const requireBody = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const parseDataWithSuccess = requireBody.safeParse(req.body);
    if(!parseDataWithSuccess){
        return res.json({
            message: "Incorrect data format",
            error: parseDataWithSuccess.error,
        });
    }

    const {email, password} = req.body;
    const admin = await adminModel.findOne({
        email: email,
    });

    if(!admin){
        return res.status(403).json({
            message: "Invalid credentials",
        });
    }

    const passwordMatched = await bcrypt.compare(password, admin.password);

    if(passwordMatched){
        const token = jwt.sign({
            id: admin._id
        }, JWT_ADMIN_PASSWORD);

        res.status(200).json({
            token: token,
        });
    }else{
        res.status(403).json({
            message: "Invalid credentials!"
        });
    }
});

adminRouter.post("/course", adminMiddleware, async function(req, res) {
    const adminId = req.adminId;
    const requireBody = z.object({
        title: z.string().min(3),
        description: z.string().min(10),
        imageUrl: z.string().url(),
        price: z.number().positive(),
    });

    const parseDataWithSuccess = requireBody.safeParse(req.body);

    if(!parseDataWithSuccess){
        return res.json({
            message: "Incorrect data format",
            error: parseDataWithSuccess.error,
        });
    }

    const {title, description, imageUrl, price} = req.body;
    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId,
    });

    res.status(201).json({
        message: "Course Created",
        courseId: course._id,
    });
});

adminRouter.put("/course", adminMiddleware, async function(req, res) {
    const adminId = req.userId;
    const requireBody = z.object({
        courseId: z.string().min(5),
        title: z.string().min(3).optional(),
        description: z.string().min(5).optional(),
        imageUrl: z.string().url().min(5).optional(),
        price: z.number().positive().optional(),
    });

    const parseDataWithSuccess = requireBody.safeParse(req.body);

    if(!parseDataWithSuccess){
        return res.json({
            message: "Incorrect data format",
            error: parseDataWithSuccess.error,
        });
    }

    const {title, description, imageUrl, price, courseId} = req.body;
    const course = await courseModel.findOne({
        _id: courseId,
        creatorId: adminId,
    });

    if(!course){
        return res.status(404).json({
            message: "Course not found!",
        });
    }

    await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId,
    },
    {
        title: title || course.title,
        description: description || course.description,
        imageUrl: imageUrl || course.imageUrl,
        price: price || course.price,
    });

    res.status(200).json({
        message: "Course updated!",
    });
});

adminRouter.get("/course/bulk", adminMiddleware, async function(req, res){
    const adminId = req.adminId;
    const courses = await courseModel.find({
        creatorId: adminId,
    });

    res.json({
        message: "Course Updated",
        courses: courses,
    });
});

module.exports = {
    adminRouter: adminRouter
};
