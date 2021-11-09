import { configureStore } from "@reduxjs/toolkit";
import docReducer from "../slices/docSlice";

export const store = configureStore({
  reducer: {
    doc: docReducer,
  },
});
