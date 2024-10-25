import axios from 'axios';

const getAppsData = async () => {
  try {
    const response = await axios.get('/api/apps');
    return response.data;
  } catch (error) {
    console.error('Error fetching apps data:', error);
    throw error;
  }
};

export { getAppsData };
