import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;

      const existingItem = state.items.find(
        (item) => item.productId === newItem.productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          productId: newItem.productId,
          sellerId: newItem.sellerId,
          name: newItem.name,
          price: newItem.price,
          image: newItem.image,
          quantity: 1,
        });
      }

      state.totalQuantity += 1;
      state.totalAmount += newItem.price;
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;

      const existingItem = state.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.price * existingItem.quantity;

        state.items = state.items.filter(
          (item) => item.productId !== productId
        );
      }
    },

    adjustQuantity: (state, action) => {
      const { productId, type } = action.payload;

      const item = state.items.find(
        (item) => item.productId === productId
      );

      if (item) {
        if (type === "increment") {
          item.quantity++;
          state.totalQuantity++;
          state.totalAmount += item.price;
        } else if (type === "decrement" && item.quantity > 1) {
          item.quantity--;
          state.totalQuantity--;
          state.totalAmount -= item.price;
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, adjustQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;