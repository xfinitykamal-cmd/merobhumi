import Plan from "../models/planmodel.js";
import User from "../models/Usermodel.js";

export const createPlan = async (req, res) => {
    try {
        const { name, price, listingLimit, featuredLimit, durationDays, description } = req.body;
        const plan = new Plan({ name, price, listingLimit, featuredLimit, durationDays, description });
        await plan.save();
        res.json({ success: true, message: "Plan created successfully", plan });
    } catch (error) {
        console.error("Error creating plan:", error);
        res.status(500).json({ success: false, message: "Error creating plan" });
    }
};

export const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find().sort({ price: 1 });
        res.json({ success: true, plans });
    } catch (error) {
        console.error("Error fetching plans:", error);
        res.status(500).json({ success: false, message: "Error fetching plans" });
    }
};

export const updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const plan = await Plan.findByIdAndUpdate(id, updates, { new: true });
        if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });
        res.json({ success: true, message: "Plan updated successfully", plan });
    } catch (error) {
        console.error("Error updating plan:", error);
        res.status(500).json({ success: false, message: "Error updating plan" });
    }
};

export const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        await Plan.findByIdAndDelete(id);
        res.json({ success: true, message: "Plan deleted successfully" });
    } catch (error) {
        console.error("Error deleting plan:", error);
        res.status(500).json({ success: false, message: "Error deleting plan" });
    }
};

export const subscribeToPlan = async (req, res) => {
    try {
        const { planId } = req.body;
        const plan = await Plan.findById(planId);
        if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + plan.durationDays);

        await User.findByIdAndUpdate(req.user._id, {
            activeSubscription: {
                plan: plan._id,
                startDate: new Date(),
                expiryDate: expiryDate,
                usedListings: 0
            }
        });

        res.json({ success: true, message: `Subscribed to ${plan.name} successfully` });
    } catch (error) {
        console.error("Error subscribing to plan:", error);
        res.status(500).json({ success: false, message: "Error subscribing to plan" });
    }
};
