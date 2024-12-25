import React, { useState } from "react";
import { setUser } from "../../redux/actions/authActions";
import "./Login.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useSelector, useDispatch } from "react-redux";
import { setOnlineUsers } from "../../redux/actions/onlineUsersActions";
// ======================
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const socket = useSelector((state) => state.socket.socket);
  // ---------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/login`,
          formData
        );
        const { user, token } = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser(user, token));
        setSuccessMessage("Login successful");
        socket.emit("userConnected", user, socket.id);
        socket.on("onlineUsers", (users) => {
          dispatch(setOnlineUsers(users));
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        setErrorMessage(error.response.data.message);
        console.error(error.response.data);
      }
    }
  };
  // ======================
  // Обработчик входа через Google
  const handleGoogleLoginSuccess = (response) => {
    const { credential } = response;

    axios
      .post(`${process.env.REACT_APP_API_URL}/auth/google`, {
        token: credential,
      })
      .then((res) => {
        const { user, token } = res.data;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        dispatch(setUser(user, token));
        setSuccessMessage("Google login successful");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        setErrorMessage("Google login failed");
        console.error(error);
      });
  };
  // Обработчик ошибки входа через Google
  const handleGoogleLoginFailure = (error) => {
    console.error("Google login failed", error);
    setErrorMessage("Google login failed");
  };
  // ======================
  return (
    <Container maxWidth="xs" className="loginPage pageContent">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
          mb: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              variant="outlined"
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              variant="outlined"
            />
          </div>
          {errors && <Typography color="error">{errorMessage}</Typography>}
          {successMessage && (
            <Typography color="success">{successMessage}</Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
        <Box className="googleLoginButton">
          <GoogleOAuthProvider clientId="704767415441-ckajbb1si9t44eb47grf4mmvda0g6rp3.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
            />
          </GoogleOAuthProvider>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
