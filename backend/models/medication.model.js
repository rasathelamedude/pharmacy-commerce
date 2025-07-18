import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      enum: [
        "Analgesic",
        "Antibiotic",
        "Antidepressant",
        "Antidiabetic",
        "Antifungal",
        "Antipyretic",
        "Antiseptic",
        "Antiviral",
      ],
    },
    dosageForm: {
      type: String,
      enum: [
        "Capsule",
        "Cream",
        "Drops",
        "Inhaler",
        "Injection",
        "Ointment",
        "Syrup",
        "Tablet",
      ],
    },
    strength: {
      value: {
        type: Number,
        required: true,
        min: 0,
      },
      unit: {
        type: String,
        required: true,
        trim: true,
        enum: ["mg", "ml"],
      },
    },
    indications: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      required: [true, "Product isFeatured is required"],
      default: false,
    },
    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Medication = mongoose.model("Medication", medicationSchema);

export default Medication;
