import axios from 'axios';
import { useEffect, useState } from 'react';

const useCurrentUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/api/users/auth/me/').then(r => console.log(r.data)).catch(e => console.log(e.response))
  }, []);

  return user;
};

export default useCurrentUser;