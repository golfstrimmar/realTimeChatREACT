import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  // const navigate = useNavigate();

  // const handleLogin = () => {
  //   if (username.trim()) {
  //     // Переход на главную страницу после успешного входа
  //     navigate("/");
  //   }
  // };

  return (
    <div className="page-container">
      <h1>Register to Chat</h1>
      {/* <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
      /> */}
      {/* <button onClick={handleLogin}>Login</button> */}
    </div>
  );
};

export default RegisterPage;
