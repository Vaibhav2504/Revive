import { Router } from "express";
const router = Router();
import Hospital from "../models/Hospital.js";

router.post("/register", async (req, res) => {

    try {

        const hospital = new Hospital(req.body);

        await hospital.save();

        res.status(201).json({
            success: true,
            message: "Hospital Created"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

export default router;