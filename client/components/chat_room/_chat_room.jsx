import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiContext } from '../../utils/api_context';

import { Button } from '../common/button';
import { useMessages } from '../../utils/use_messages';
import { Message } from './_message';

export const ChatRoom = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [contents, setContents] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const api = useContext(ApiContext);
  const { id } = useParams();
  const [messages, sendMessage] = useMessages(chatRoom);
  const navigate = useNavigate();

  useEffect(async () => {
    const { user } = await api.get('/users/me');
    setUser(user);
    const { chatRoom } = await api.get(`/chat_rooms/${id}`);
    setChatRoom(chatRoom);
    setLoading(false);
  }, []);

  if (loading) return 'Loading...';
  console.log(messages);

  return (
    <div className="vertical-flex">
      <Button className="back-button my-button" onClick={() => navigate('/')}>
        Back to Rooms
      </Button>
      <div className="main-title">{chatRoom.name}</div>
      <div className="messages-area">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <div className="horizontal-flex">
        <textarea className="message-typer top-margin" value={contents} onChange={(e) => setContents(e.target.value)} />
        <Button
          onClick={() => {
            sendMessage(contents, user);
            setContents('');
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
