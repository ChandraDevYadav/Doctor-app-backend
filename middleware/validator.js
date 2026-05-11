const { z } = require("zod");

exports.validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", "),
    });
  }
};

// Example Schemas
exports.registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["patient", "doctor", "admin"]),
  }),
});

exports.loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

exports.bookAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string(),
    date: z.string(),
    timeSlot: z.string(),
  }),
});
