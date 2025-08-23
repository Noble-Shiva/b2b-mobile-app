import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchFilters {
  priceRange: [number, number];
  sortBy: string;
  inStock: boolean;
  selectedItems?: string[];
}

interface SearchState {
  filters: SearchFilters;
  history: string[];
  suggestions: string[];
}

const initialState: SearchState = {
  filters: {
    priceRange: [0, 5000],
    sortBy: 'popularity',
    inStock: true,
    selectedItems: [],
  },
  history: [],
  suggestions: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<SearchFilters>) {
      state.filters = action.payload;
    },
    addToHistory(state, action: PayloadAction<string>) {
      if (!state.history.includes(action.payload)) {
        state.history.unshift(action.payload);
      }
    },
    clearHistory(state) {
      state.history = [];
    },
    setSuggestions(state, action: PayloadAction<string[]>) {
      state.suggestions = action.payload;
    },
  },
});

export const { setFilters, addToHistory, clearHistory, setSuggestions } = searchSlice.actions;

export const selectSearchFilters = (state: { search: SearchState }) => state.search.filters;
export const selectSearchHistory = (state: { search: SearchState }) => state.search.history;
export const selectSearchSuggestions = (state: { search: SearchState }) => state.search.suggestions;

export default searchSlice.reducer; 