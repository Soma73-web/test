const db = require("../models");
const Admin = db.Admin;
require("dotenv").config();

const createAdmin = async () => {
  try {
    console.log("Creating admin account...");
    console.log("Database:", process.env.DB_NAME);
    console.log("Host:", process.env.DB_HOST);
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      console.log("Admin already exists!");
      return;
    }

    // Validate environment variables
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_NAME) {
      console.error("Missing required environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME");
      process.exit(1);
    }

    const adminData = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: process.env.ADMIN_NAME
    };

    const admin = await Admin.create(adminData);
    console.log("✅ Admin created successfully!");
    console.log("📧 Email:", admin.email);
    console.log("⚠️  IMPORTANT: Change the password after first login!");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
};

createAdmin();
