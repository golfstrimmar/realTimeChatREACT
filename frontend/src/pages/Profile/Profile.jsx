import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Box, Typography, Paper, CardMedia } from "@mui/material";

import "./Profile.scss";
import { ReactComponent as AvatarSVG } from "../../assets/svg/avatar.svg";

// ================================
const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const imageUrl = user?.picture
    ? `${process.env.REACT_APP_API_URL}${user.picture}` // Добавляем путь к серверу
    : null;

  // ===================================
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

  // ===================================
  return (
    <Box className="pageContent">
      <Box>
        <Paper
          sx={{
            padding: 3,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" gutterBottom>
            {user.name}
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
            Email: {user.email}
          </Typography>
        </Paper>{" "}
      </Box>
    </Box>
  );
};

export default Profile;
