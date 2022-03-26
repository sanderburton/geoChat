import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { AuthContext } from '../../utils/auth_context';
import { Button } from '../common/button';
import { Link } from 'react-router-dom';

export const Home = () => {
  const api = useContext(ApiContext);
  const [name, setName] = useState('');
  const [chatRooms, setChatRooms] = useState([]);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useContext(AuthContext);

  useEffect(async () => {
    if (coords) {
      const { chatRooms } = await api.get(`/chat_rooms?lat=${coords.lat}&lon=${coords.lon}`);
      // console.log(chatRooms);
      setChatRooms(chatRooms);
      setLoading(false);
    }
  }, [coords]);

  useEffect(async () => {
    setLoading(true);
    const res = await api.get('/users/me');
    setUser(res.user);
    setLoading(false);
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (coords === null || position.coords.latitude !== coords.lat || position.coords.longitude !== coords.lon) {
          setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
        }
      },
      (positionError) => {
        setLoading(false);
        console.log(positionError);
      },
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!coords) {
    return <div>Please allow this app to use your location, then refresh the page</div>;
  }

  const createRoom = async () => {
    if (name) {
      const { chatRoom } = await api.post('/chat_rooms', { name, lat: coords.lat, lon: coords.lon });
      setChatRooms([...chatRooms, chatRoom]);
      setName('');
    }
  };

  const logout = async () => {
    const res = await api.del('/sessions');
    if (res.success) {
      setAuthToken(null);
    }
  };

  return (
    <div className="vertical-flex">
      <h1 className="main-title">GeoChat</h1>
      <div className="horizontal-flex home">
        <div className="vertical-flex new-room-form">
          <div>Create a room at current location</div>
          <div className="horizontal-flex ">
            <input className="name-new-room" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <Button onClick={createRoom}>Create Room</Button>
          </div>
          <div className="horizontal-flex top-margin">
            <h1>Logged in as {user.firstName}</h1>
            <Button onClick={logout}>Logout</Button>
          </div>
        </div>

        {chatRooms.length >= 1 && (
          <div className="vertical-flex">
            Nearby Rooms (Within 5 miles)
            {chatRooms.map((chatRoom) => (
              <Link key={chatRoom.id} className="room-link top-margin" to={`/chat_rooms/${chatRoom.id}`}>
                {chatRoom.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
