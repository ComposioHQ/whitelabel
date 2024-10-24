import axios from 'axios';

export const checkConnection = async (appName, entityId) => {
  try {
    const response = await axios.post('/api/checkconnection', {
      appName,
      entityId
    });
    return response.data.isConnected;
  } catch (error) {
    console.error('Error checking connection:', error);
    throw error;
  }
};
