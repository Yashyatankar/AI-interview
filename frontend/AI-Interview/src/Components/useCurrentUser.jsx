import axios from 'axios';
import { useEffect, useState } from 'react';

const useCurrentUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('auth/me/')
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  return user;
};

export default useCurrentUser;