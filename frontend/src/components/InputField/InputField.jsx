import React from "react";

const InputField = ({ message, setMessage, sendMessage }) => {
  return (
    <div className="input-container">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default InputField;
