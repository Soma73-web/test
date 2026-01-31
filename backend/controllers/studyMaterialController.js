const { StudyMaterial } = require("../models");

// Get all study materials by subject (public for students)
const getStudyMaterialsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;

    const validSubjects = ["Biology", "Chemistry", "Physics", "Mathematics"];
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({ error: "Invalid subject" });
    }

    const materials = await StudyMaterial.findAll({
      where: {
        subject,
        isActive: true,
      },
      order: [
        ["orderIndex", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    res.json(materials);
  } catch (error) {
    console.error("Get study materials error:", error);
    res.status(500).json({ error: "Failed to fetch study materials" });
  }
};

// Get all study materials (admin only)
const getAllStudyMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.findAll({
      where: { isActive: true },
      order: [
        ["subject", "ASC"],
        ["orderIndex", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    res.json(materials);
  } catch (error) {
    console.error("Get all study materials error:", error);
    res.status(500).json({ error: "Failed to fetch study materials" });
  }
};

// Create study material (admin only)
const createStudyMaterial = async (req, res) => {
  try {
    const { subject, topic, videoUrl, description, duration, orderIndex } =
      req.body;
    const addedBy = req.admin?.username || "admin";

    // Validate required fields
    if (!subject || !topic || !videoUrl) {
      return res.status(400).json({
        error: "Subject, topic, and video URL are required",
      });
    }

    // Validate subject
    const validSubjects = ["Biology", "Chemistry", "Physics", "Mathematics"];
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({ error: "Invalid subject" });
    }

    // Convert YouTube URL to embed format if needed
    let embedUrl = videoUrl;
    if (
      videoUrl.includes("youtube.com/watch?v=") ||
      videoUrl.includes("youtu.be/")
    ) {
      const videoId = videoUrl.includes("youtube.com/watch?v=")
        ? videoUrl.split("v=")[1]?.split("&")[0]
        : videoUrl.split("youtu.be/")[1]?.split("?")[0];

      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }

    const material = await StudyMaterial.create({
      subject,
      topic,
      videoUrl: embedUrl,
      description,
      duration,
      orderIndex: orderIndex || 0,
      addedBy,
    });

    res.status(201).json({
      message: "Study material created successfully",
      material,
    });
  } catch (error) {
    console.error("Create study material error:", error);
    res.status(500).json({ error: "Failed to create study material" });
  }
};

// Update study material (admin only)
const updateStudyMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convert YouTube URL to embed format if needed
    if (updateData.videoUrl) {
      let embedUrl = updateData.videoUrl;
      if (
        updateData.videoUrl.includes("youtube.com/watch?v=") ||
        updateData.videoUrl.includes("youtu.be/")
      ) {
        const videoId = updateData.videoUrl.includes("youtube.com/watch?v=")
          ? updateData.videoUrl.split("v=")[1]?.split("&")[0]
          : updateData.videoUrl.split("youtu.be/")[1]?.split("?")[0];

        if (videoId) {
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
      }
      updateData.videoUrl = embedUrl;
    }

    await StudyMaterial.update(updateData, { where: { id } });

    const updatedMaterial = await StudyMaterial.findByPk(id);

    res.json({
      message: "Study material updated successfully",
      material: updatedMaterial,
    });
  } catch (error) {
    console.error("Update study material error:", error);
    res.status(500).json({ error: "Failed to update study material" });
  }
};

// Delete study material (admin only)
const deleteStudyMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    await StudyMaterial.update({ isActive: false }, { where: { id } });

    res.json({ message: "Study material deleted successfully" });
  } catch (error) {
    console.error("Delete study material error:", error);
    res.status(500).json({ error: "Failed to delete study material" });
  }
};

// Get subjects with material count
const getSubjectsWithCount = async (req, res) => {
  try {
    const subjects = ["Biology", "Chemistry", "Physics", "Mathematics"];
    const subjectsWithCount = [];

    for (const subject of subjects) {
      const count = await StudyMaterial.count({
        where: {
          subject,
          isActive: true,
        },
      });

      subjectsWithCount.push({
        subject,
        count,
      });
    }

    res.json(subjectsWithCount);
  } catch (error) {
    console.error("Get subjects with count error:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

module.exports = {
  getStudyMaterialsBySubject,
  getAllStudyMaterials,
  createStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
  getSubjectsWithCount,
};
