import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",   
      required: true,
    },
    searchQuery: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);


searchHistorySchema.index({ buyer: 1, createdAt: -1 });

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

export default SearchHistory;