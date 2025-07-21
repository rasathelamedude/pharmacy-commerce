import Medication from "../models/medication.model.js";

export const getAllCartItems = async (req, res) => {
  try {
    const medicationIDs = req.user.cartItems.map((item) => item.product);
    const medications = await Medication.find({ _id: { $in: medicationIDs } });

    const cartMedications = medications.map((medication) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.product.toString() === medication._id.toString()
      );

      return { ...medication.toJSON(), quantity: item.quantity };
    });

    res.status(200).json({
      success: true,
      message: "Fetched cart medications successfully!",
      cartMedications,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Failed to fetch cart items",
      error: error.message,
    });
  }
};

export const addCartItem = async (req, res) => {
  try {
    const user = req.user;
    const { medicationId } = req.body;

    const existingMedication = user.cartItems?.find(
      (item) => item.product.toString() === medicationId.toString()
    );

    if (existingMedication) {
      existingMedication.quantity++;
    } else {
      user.cartItems.push({ product: medicationId });
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: "Successfully added item!",
      existingMedication,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to add item to cart",
      error: error.message,
    });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const user = req.user;
    const medicationId = req.params.cartProductId;
    const { quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }

    const cartItem = user.cartItems?.find(
      (item) => item.product.toString() === medicationId.toString()
    );

    if (quantity === 0) {
      user.cartItems = user.cartItems.filter(
        (item) => item.product.toString !== medicationId.toString()
      );
    } else {
      cartItem?.quantity += quantity;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Successfully updated item quantity",
    });
  } catch (error) {
    res.status().json({
      success: false,
      message: "Failed updating product quantity",
      error: error.message,
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const user = req.user;
    const { medicationId } = req.body;

    if (!medicationId) {
      return res.status(400).json({
        success: false,
        message: "Missing medication id",
      });
    }

    user.cartItems = user.cartItems.filter(
      (item) => item.product.toString() !== medicationId.toString()
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Successfully deleted cart items",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete cart items",
      error: error.message,
    });
  }
};
