// import React from 'react';
import React, { useState, useEffect } from "react";
import { Box, TextField, Button, List, ListItem, Typography } from "@mui/material";
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login state when the popup opens
    chrome.storage.sync.get(['token'], (result) => {
      if (result.token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  // const handleLogin = () => {
  //   // Redirect to your backend login URL
  //   const loginUrl = 'http://localhost:4500/api/v1/auth/google';
  //   window.open(loginUrl, '_blank');
  // };


  const [query, setQuery] = useState("");
  const [emails, setEmails] = useState([]);

  const handleSearch = () => {

    // Dummy email search logic for now
    const mockEmails = [
      { id: 1, subject: "Rejection from Company AAA", content: "We regret to inform you..." },
      { id: 2, subject: "Rejection from Company B", content: "Unfortunately, you were not selected..." },
      { id: 3, subject: "Follow-up with Company C", content: "Thank you for your application..." },
    ];

    const filteredEmails = mockEmails.filter(
      (email) =>
        email.subject.toLowerCase().includes(query.toLowerCase()) ||
        email.content.toLowerCase().includes(query.toLowerCase())
    );

    setEmails(filteredEmails);
  };
  return (

    <Box
      sx={{
        width: "100%",
        padding: "16px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Email Searcher
      </Typography>
      <TextField
        fullWidth
        label="Search Emails"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ marginBottom: "16px" }}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={handleSearch}
        sx={{ marginBottom: "16px" }}
      >
        Search
      </Button>

      <List
        sx={{
          maxHeight: "200px",
          overflowY: "auto",
          backgroundColor: "white",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {emails.map((email) => (
          <ListItem
            key={email.id}
            sx={{
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "8px",
              borderBottom: "1px solid #eee",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {email.subject}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {email.content}
            </Typography>
          </ListItem>
        ))}
        {emails.length === 0 && (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ marginTop: "16px" }}
          >
            No emails found.
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default Popup;
