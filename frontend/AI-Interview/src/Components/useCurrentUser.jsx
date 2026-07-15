import { useEffect, useState } from 'react';
import api from './apis/api'; // Import your custom axios instance with the interceptor

const useCurrentUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Now use 'api' instead of 'axios'
    api.get('http://localhost:8000/accounts/me/')
      .then(res => setUser(res.data))
      .catch(err => {
        // If it gets here, the refresh ALSO failed
        console.log("Failed to fetch user:", err.response?.status, err.response?.data);
      });
  }, []);

  return user;
};

export default useCurrentUser;