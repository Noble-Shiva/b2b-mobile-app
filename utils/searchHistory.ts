import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_HISTORY_KEY = '@search_history';

export const saveSearchHistory = async (query: string) => {
  try {
    const existingHistory = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    
    // Add new query at the beginning and remove duplicates
    const newHistory = [query, ...history.filter((item: string) => item !== query)].slice(0, 10);
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (error) {
    console.error('Error saving search history:', error);
    return [];
  }
};

export const getSearchHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
};

export const clearSearchHistory = async () => {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    return [];
  } catch (error) {
    console.error('Error clearing search history:', error);
    return [];
  }
}; 