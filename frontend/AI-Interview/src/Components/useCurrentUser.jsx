import { useEffect, useState } from 'react';
import axios from 'axios';

const useCurrentUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    
    axios.get('http://localhost:8000/accounts/me/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setUser(res.data))
    .catch(err => console.log(err.response?.status, err.response?.data));
  }, []);

  return user;
};

export default useCurrentUser;