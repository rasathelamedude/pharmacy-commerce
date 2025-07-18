import Medication from "../models/medication.model.js";

export const getAllMedications = async (req, res) => {
  try {
    const medications = await Medication.find();

    if (medications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No medications found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medications fetched successfully",
      count: medications.length,
      medications,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Failed fetching all medications",
      error: error.message,
    });
  }
};

export const getFeaturedMedications = async (req, res) => {
  try {
    const featuredMedications = await Medication.find({ isFeatured: true });

    if (featuredMedications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No featured medications found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Featured medications fetched successfully",
      count: featuredMedications.length,
      featuredMedications,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Failed fetching featured medications",
      error: error.message,
    });
  }
};

export const getCategoryMedications = async (req, res) => {
  try {
    const medications = await Medication.find({
      category: req.params.categoryName,
    });

    if (medications.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No medications found for ${req.params.categoryName} category`,
      });
    }

    res.status(200).json({
      success: true,
      message: `${req.params.categoryName} medications fetched successfully`,
      count: medications.length,
      medications,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: `Failed fetching ${req.params.categoryName} medications`,
      error: error.message,
    });
  }
};

export const getRecommendedMedications = async (req, res) => {
  try {
    const medications = await Medication.aggregate([
      { $sample: { size: 3 } },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
          category: 1,
          strength: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Recommended medications fetched successfully",
      count: medications.length,
      medications,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Failed fetching recommended medications",
      error: error.message,
    });
  }
};

export const createMedication = async (req, res) => {
  try {
    const medicationData = req.body;

    const medication = await Medication.create(medicationData);

    res.status(201).json({
      success: true,
      message: "Medication created successfully",
      medication,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create medication",
      error: error.message,
    });
  }
};

export const toggleFeatureMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.medicationId);

    if (!medication) {
      return res.status(400).json({
        success: false,
        message: "Medication not found",
      });
    }

    medication.isFeatured = !medication.isFeatured;

    const updatedMedication = await medication.save();

    res.status(200).json({
      success: true,
      message: medication.isFeatured
        ? "Medication unfeatured successfully"
        : "Medication featured successfully",
      updatedMedication,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to feature medication",
      error: error.message,
    });
  }
};

export const deleteMedication = async (req, res) => {
  try {
    await Medication.findByIdAndDelete(req.params.medicationId);

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete medication",
      error: error.message,
    });
  }
};
