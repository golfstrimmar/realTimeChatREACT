import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  Divider,
  CardMedia,
} from "@mui/material";
import axios from "axios";
import "./Profile.scss";
import { ReactComponent as AvatarSVG } from "../../assets/svg/avatar.svg";

const Profile = () => {
  const user = useSelector((state) => state.auth.user); // Получаем пользователя из Redux
  const [orders, setOrders] = useState([]);
  const token = useSelector((state) => state.auth.token); // Получаем JWT токен из Redux

  // Формируем URL изображения, если оно есть у пользователя
  const imageUrl = user?.picture
    ? `${process.env.REACT_APP_API_URL}${user.picture}` // Добавляем путь к серверу
    : null;

  useEffect(() => {
    if (user && token) {
      console.log("user", user);
      const fetchOrders = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/orders`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const userOrders = response.data.filter(
            (order) => order.user._id === user.id
          );
          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchOrders();
    }
  }, [user, token]);

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
          <Typography variant="h6">
            Please log in to view your profile.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" className="pageContent">
      <Box>
        <Paper
          sx={{
            padding: 3,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
            mb: 4,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>

          {user.picture ? (
            <CardMedia
              component="img"
              image={imageUrl}
              alt="img"
              sx={{
                width: 200,
                height: 200,
                m: 2,
                borderRadius: "50%",
              }}
            />
          ) : (
            <AvatarSVG
              style={{ width: 200, height: 200, borderRadius: "50%", m: 2 }}
            />
          )}
          <Typography variant="h6" gutterBottom>
            Name: {user.name}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Email: {user.email}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
