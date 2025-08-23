// Mock data for chat functionality
// In a real app, this would be replaced with actual API calls to a chat service

// Sample agent data
const agents = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    status: 'online',
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    status: 'online',
  },
  {
    id: '3',
    name: 'Jessica Williams',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
    status: 'offline',
  },
];

// Sample automated responses
const automatedResponses = [
  "Thank you for contacting QuickMart support. How can I help you today?",
  "I understand your concern. Let me look into that for you.",
  "I'm checking our system for more information about your order.",
  "Is there anything else you'd like to know about our services?",
  "I apologize for the inconvenience. We're working to resolve this issue as quickly as possible.",
  "Your satisfaction is our top priority. We'll make sure this is addressed properly.",
  "Thank you for your patience. I'm still looking into this matter.",
  "I've found the information you requested. Here's what I can tell you...",
  "Would you like me to connect you with a specialist who can provide more detailed assistance?",
  "Is there anything else I can help you with today?"
];

// API functions
export const getRandomAgent = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const onlineAgents = agents.filter(agent => agent.status === 'online');
      const randomIndex = Math.floor(Math.random() * onlineAgents.length);
      resolve(onlineAgents[randomIndex]);
    }, 500);
  });
};

export const getAutomatedResponse = (userMessage: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would use NLP to generate contextual responses
      // For this demo, we'll just return a random response
      const randomIndex = Math.floor(Math.random() * automatedResponses.length);
      resolve(automatedResponses[randomIndex]);
    }, 1000);
  });
};

export const sendChatMessage = (message: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would send the message to a backend service
      resolve({ success: true, messageId: Date.now().toString() });
    }, 300);
  });
};