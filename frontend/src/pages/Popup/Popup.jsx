import React, { useState, useEffect } from "react";
import { Box, TextField, Button, List, ListItem, Typography } from "@mui/material";
import './Popup.css';

const Popup = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    // Check authentication by calling the backend
    fetch('http://localhost:4500/api/v1/auth/me', {
      method: 'GET',
      credentials: 'include', // Include cookies if using sessions
    })
      .then((response) => {
        if (!response.ok) {
          console.error(`HTTP error: ${response.status} ${response.statusText}`);
          throw new Error(`HTTP error: ${response.status}`);
        }
        console.log("RESPONSE1");
        console.log(response);
        console.log("RESPONSE2");
        return response.json();
      })
      .then((data) => {
        if (data && data._id) {
          setIsAuthenticated(true);
          setUser(data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

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

  const handleLogout = () => {
    // Call the backend to log out the user
    fetch('http://localhost:4500/api/v1/auth/logout', {
      method: 'GET',
      credentials: 'include', // Ensure cookies are included
    })
      .then((response) => {
        if (response.ok) {
          setIsAuthenticated(false);
          setUser(null);
          window.location.reload();
        } else {
          console.error('Failed to log out');
        }
      })
      .catch((error) => console.error('Error logging out:', error));
  };

  // const handleLogin = () => {
  //   // Redirect to the backend OAuth login URL
  //   window.location.href = 'http://localhost:4500/api/v1/auth/google';
  // };

  const handleLogin = () => {
    const redirectUri = chrome.identity.getRedirectURL('oauth2'); // Your redirect URI
    const authUrl = `http://localhost:4500/api/v1/auth/google?redirect_uri=${redirectUri}`;

    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true, // Opens an interactive login window
      },
      (responseUrl) => {
        // Process the OAuth response
        if (responseUrl) {
          console.log('User authenticated:', responseUrl);
          setIsAuthenticated(true); // Update state
          window.location.href = "popup.html";
          chrome.runtime.reload();
          // chrome.runtime.sendMessage({ action: 'reopen_popup' });
          // Optionally refresh the popup or fetch the user's data
        } else {
          console.error('Login failed');
        }
      }
    );
  };

  return (
    <div>
      {isAuthenticated ? (
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
            Welcome, {user?.name || "User"}!
          </Typography>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleLogout}
            sx={{ marginBottom: "16px", backgroundColor: "#ffcccc" }}
          >
            Logout
          </Button>

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
      ) : (
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
            Please Log In
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{ marginBottom: "16px" }}
          >
            Login
          </Button>
        </Box>
      )}
    </div>
  );
};

export default Popup;
