import { createSlice } from "@reduxjs/toolkit";

export const docSlice = createSlice({
  name: "doc",
  initialState: {
    clickedDocs: []
  },
  reducers: {
    addToClickedDocs: (state, action) => {
      state.clickedDocs = [...state.clickedDocs, action.payload.id];
    },
    removeFromClickedDocs: (state, action) => {
      const index = state.clickedDocs.findIndex(
        (docId) => docId === action.payload.id
      );
      let newClicked = [...state.clickedDocs];

      if (index >= 0) {
        newClicked.splice(index, 1);
      } else {
        console.warn(
          `Can't remove doc (id: ${action.payload.id})!`
        );
      }

      state.clickedDocs = newClicked;
    }
  },
});

export const {
  addToClickedDocs,
  removeFromClickedDocs
} = docSlice.actions;


export const selectClickedDocs = (state) => state.doc.clickedDocs;

export default docSlice.reducer;
