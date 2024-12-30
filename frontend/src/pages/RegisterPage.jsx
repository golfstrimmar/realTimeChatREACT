// src/components/Register.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../components/Loading/Loading";
import { setErrorMessage } from "../redux/actions/errorActions";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const socket = useSelector((state) => state.socket.socket);
  const [selectedRole, setSelectedRole] = useState("user");
  // ------------------------------------------------------

  // ------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    return errors;
  };
  // ------------------------------

  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/register`,
          formData
        );
        setTimeout(() => {
          dispatch(setErrorMessage("Registration successful"));
          setLoading(false);
          socket.emit("newUser", formData);

          navigate("/login");
        }, 2000);
      } catch (error) {
        setLoading(false);
        dispatch(setErrorMessage(error.response.data.message));
        console.error(error.response.data);
      }
    }
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setFormData({ ...formData, role: event.target.value });
  };
  useEffect(() => {
    if (selectedRole === "admin") {
    }
  }, [selectedRole]);
  return (
    <Container maxWidth="xs" className="pageContent">
      {loading && <Loading />}
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
          Registration
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              variant="outlined"
            />
          </div>
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
          <div>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select Role</FormLabel>
              <RadioGroup
                aria-label="role"
                name="role"
                value={selectedRole}
                onChange={handleRoleChange}
              >
                <FormControlLabel
                  value="admin"
                  control={<Radio />}
                  label="Admin"
                />
                <FormControlLabel
                  value="user"
                  control={<Radio />}
                  label="User"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 1 }}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
