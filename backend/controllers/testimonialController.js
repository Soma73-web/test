const { Testimonial } = require('../models'); // ✅ Correct import

// GET all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll();
    res.json(testimonials);
  } catch (err) {
    console.error('Error getting testimonials:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, message, video_link, instagram_link } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    await Testimonial.create({ name, message, video_link, instagram_link });
    res.status(201).json({ message: 'Testimonial created successfully' });
  } catch (err) {
    console.error('Error creating testimonial:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT update a testimonial by ID
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, message, video_link, instagram_link } = req.body;

    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    testimonial.name = name;
    testimonial.message = message;
    testimonial.video_link = video_link;
    testimonial.instagram_link = instagram_link;

    await testimonial.save();
    res.json({ message: 'Testimonial updated successfully' });
  } catch (err) {
    console.error('Error updating testimonial:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE a testimonial by ID
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Testimonial.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
