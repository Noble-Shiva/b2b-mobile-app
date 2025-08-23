import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

interface SupportState {
  tickets: SupportTicket[];
  messages: ChatMessage[];
}

const initialState: SupportState = {
  tickets: [],
  messages: [],
};

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    clearChat(state) {
      state.messages = [];
    },
    addTicket(state, action: PayloadAction<SupportTicket>) {
      state.tickets.push(action.payload);
    },
    updateTicket(state, action: PayloadAction<SupportTicket>) {
      const idx = state.tickets.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        state.tickets[idx] = action.payload;
      }
    },
  },
});

export const { addMessage, clearChat, addTicket, updateTicket } = supportSlice.actions;

export const selectSupportMessages = (state: { support: SupportState }) => state.support.messages;
export const selectSupportTickets = (state: { support: SupportState }) => state.support.tickets;

export default supportSlice.reducer; 