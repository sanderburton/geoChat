export const Message = ({ message }) => (
  <div className="horizontal-flex">
    <div className="user-name">{message.userName}:</div>
    <div className="message-contents left-margin">{message.contents}</div>
  </div>
);
