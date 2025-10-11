import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { id: 1, name: "Krish", role: "Developer" },
  { id: 2, name: "Aryan", role: "Designer" },
];

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    addEmployee: (state, action) => {
      state.push(action.payload);
    },
    updateEmployee: (state, action) => {
      const index = state.findIndex(e => e.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    deleteEmployee: (state, action) => {
      return state.filter(e => e.id !== action.payload);
    },
  },
});

export const { addEmployee, updateEmployee, deleteEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
