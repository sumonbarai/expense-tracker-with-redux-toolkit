import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addTransaction,
  deleteTransaction,
  editTransaction,
  getTransactions,
} from "./transactionAPI";

const initialState = {
  isLoading: false,
  isError: false,
  transactions: [],
  error: "",
};

// transaction thunk
export const getTransactionsThunk = createAsyncThunk(
  "transaction/getTransactionsThunk",
  async () => {
    const transactions = await getTransactions();
    return transactions;
  }
);

export const addTransactionThunk = createAsyncThunk(
  "transaction/addTransactionThunk",
  async (data) => {
    const transaction = await addTransaction(data);
    return transaction;
  }
);

export const editTransactionThunk = createAsyncThunk(
  "transaction/editTransactionThunk",
  async ({ id, data }) => {
    const transaction = await editTransaction(id, data);
    return transaction;
  }
);
export const deleteTransactionThunk = createAsyncThunk(
  "transaction/deleteTransactionThunk",
  async (id) => {
    const transaction = await deleteTransaction(id);
    return transaction;
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  extraReducers: (builder) => {
    builder
      //  getTransaction
      .addCase(getTransactionsThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getTransactionsThunk.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(getTransactionsThunk.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.transactions = [];
        state.error = action.error?.message;
      })
      //   addTransaction
      .addCase(addTransactionThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(addTransactionThunk.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.transactions.push(action.payload);
      })
      .addCase(addTransactionThunk.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.error = action.error?.message;
      })
      //   edit transaction
      .addCase(editTransactionThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(editTransactionThunk.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        const updateAbleIndex = state.transactions.findIndex(
          (t) => t.id === action.payload.id
        );
        state.transactions[updateAbleIndex] = action.payload;
      })
      .addCase(editTransactionThunk.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.error = action.error?.message;
      })
      //   delete transaction
      .addCase(deleteTransactionThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteTransactionThunk.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.transactions = state.transactions.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(deleteTransactionThunk.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.error = action.error?.message;
      });
  },
});

export default transactionSlice.reducer;