import Stats from "../models/statsModel.js";
import Property from "../models/propertymodel.js";
import Appointment from "../models/appointmentModel.js";
import User from "../models/Usermodel.js";
import Inquiry from "../models/Inquiry.js";
import transporter from "../config/nodemailer.js";
import { getEmailTemplate } from "../email.js";

const formatRecentInquiries = (inquiries) => {
  return inquiries.map((inquiry) => ({
    type: "inquiry",
    description: `New inquiry for ${inquiry.property?.title || "Property"} by ${inquiry.buyerName}`,
    timestamp: inquiry.createdAt,
    date: inquiry.createdAt,
    title: `Inquiry: ${inquiry.buyerName}`,
  }));
};

const formatRecentAppointments = (appointments) => {
  return appointments.map((appointment) => ({
    type: "appointment",
    description:
      appointment.userId && appointment.propertyId
        ? `${appointment.userId.name} scheduled viewing for ${appointment.propertyId.title}`
        : "Appointment scheduled (details unavailable)",
    timestamp: appointment.createdAt,
    date: appointment.createdAt,
    title: `Viewing: ${appointment.userId?.name || "Client"}`,
  }));
};

const formatRecentProperties = (properties) => {
  return properties.map((property) => ({
    type: "property",
    description: `New property listed: ${property.title}`,
    timestamp: property.createdAt,
    date: property.createdAt,
    title: property.title,
  }));
};

// Add these helper functions before the existing exports
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalProperties,
      activeListings,
      totalUsers,
      pendingAppointments,
      pendingProperties,
      recentActivity,
      viewsData,
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: "approved" }),
      User.countDocuments(),
      Appointment.countDocuments({ status: "pending" }),
      Property.countDocuments({ status: "pending" }),
      Inquiry.countDocuments({ status: "new" }),
      getRecentActivity(),
      getViewsData(),
    ]);

    res.json({
      success: true,
      stats: {
        totalProperties,
        activeListings,
        totalUsers,
        pendingAppointments,
        pendingProperties,
        newInquiries,
        recentActivity,
        viewsData,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching admin statistics",
    });
  }
};

const getRecentActivity = async () => {
  try {
    const recentProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt");

    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("property", "title");

    return [
      ...formatRecentProperties(recentProperties),
      ...formatRecentAppointments(validAppointments),
      ...formatRecentInquiries(recentInquiries),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
  } catch (error) {
    console.error("Error getting recent activity:", error);
    return [];
  }
};

const getViewsData = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await Stats.aggregate([
      {
        $match: {
          endpoint: /^\/api\/products\/single\//,
          method: "GET",
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Generate dates for last 30 days
    const labels = [];
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      labels.push(dateString);

      const stat = stats.find((s) => s._id === dateString);
      data.push(stat ? stat.count : 0);
    }

    return {
      labels,
      datasets: [
        {
          label: "Property Views",
          data,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  } catch (error) {
    console.error("Error generating chart data:", error);
    return {
      labels: [],
      datasets: [
        {
          label: "Property Views",
          data: [],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }
};

// Add these new controller functions
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("propertyId", "title location")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
    });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    ).populate("propertyId userId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Send email notification using the template from email.js
    const mailOptions = {
      from: process.env.EMAIL,
      to: appointment.userId.email,
      subject: `Viewing Appointment ${status.charAt(0).toUpperCase() + status.slice(1)
        } - Merobhumi`,
      html: getEmailTemplate(appointment, status),
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Error updating appointment",
    });
  }
};

export const updatePropertyStatus = async (req, res) => {
  try {
    const { propertyId, status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const property = await Property.findByIdAndUpdate(
      propertyId,
      { status },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.json({
      success: true,
      message: `Property ${status} successfully`,
      property,
    });
  } catch (error) {
    console.error("Error updating property status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating property status",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};
