import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Buyer from "../models/Buyer.js";



export const addToCart = async (req, res) => {
  try {
    const userId = req.user.buyerId; // from JWT
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity: quantity || 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({ product: productId, quantity: quantity || 1 });
      }

      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.buyerId;
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    res.status(200).json({
      success: true,
      cart: cart || { items: [] },
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.buyerId;
    const { productId, action } = req.body; 
    // action = "increase" | "decrease"

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    if (action === "increase") {
      item.quantity += 1;
    }

    if (action === "decrease") {
      item.quantity -= 1;

      // If quantity becomes 0 → remove item
      if (item.quantity <= 0) {
        cart.items = cart.items.filter(
          (i) => i.product.toString() !== productId
        );
      }
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ user: userId })
      .populate("items.product");

    res.status(200).json({
      success: true,
      cart: updatedCart,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.buyerId;
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: userId })
      .populate("items.product");

    res.status(200).json({
      success: true,
      cart: updatedCart,
    });

  } catch (error) {
    res.status(500).json({ success: false });
  }
};