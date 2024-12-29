import React, { useState, useEffect } from "react";
import { Box, TextField, Button, List, ListItem, Typography } from "@mui/material";
import axios from 'axios';
import './Popup.css';


const Popup = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [query, setQuery] = useState("");
  const [emails, setEmails] = useState([]);

  // useEffect(() => {
  //   // Check authentication by calling the backend
  //   axios.get('http://localhost:4500/api/v1/auth/me', { withCredentials: true })
  //     .then((response) => {
  //       if (response.status === 200 && response.data && response.data._id) {
  //         setIsAuthenticated(true);
  //         setUser(response.data);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error during authentication check:', error);
  //     });
  // }, []);
  useEffect(() => {
    // console.log("HO");

    // console.log(process.env.REACT_APP_CLIENT_ID);
    chrome.storage.local.get(['accessToken'], (result) => {
      if (result.accessToken) {
        console.log('Access token retrieved:', result.accessToken);

        // Optionally validate token with backend
        axios
          .get('http://localhost:4500/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${result.accessToken}` },
            withCredentials: true,
          })
          .then((response) => {
            console.log(response);

            if (response.data) {
              console.log("HI");
              console.log(response.data);

              setIsAuthenticated(true);
              setUser(response.data);
            }
          })
          .catch((error) => {
            console.error('Error validating token:', error);
            handleLogout(); // Clear token if invalid
          });
      } else {
        console.log('No access token found, redirecting to login...');
        setIsAuthenticated(false);
      }
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

  // const handleLogout = () => {
  //   // Call the backend to log out the user
  //   axios.get('http://localhost:4500/api/v1/auth/logout', { withCredentials: true })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         setIsAuthenticated(false);
  //         setUser(null);
  //         window.location.reload();
  //       } else {
  //         console.error('Failed to log out:', response.data);
  //       }
  //     })
  //     .catch((error) => console.error('Error logging out:', error));
  // };
  const handleLogout = () => {
    axios
      .get('http://localhost:4500/api/v1/auth/logout', { withCredentials: true })
      .then((response) => {
        if (response.status === 200 && response.data.success) {
          console.log(response.data.message); // "Logged out successfully"
          setIsAuthenticated(false);
          setUser({});
          chrome.storage.local.remove(['accessToken'], () => {
            console.log('Access token cleared from chrome.storage');
          });
        } else {
          console.error('Failed to log out:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };


  const handleLogin = () => {
    const redirectUri = chrome.identity.getRedirectURL('oauth2');
    const clientId = '1094002364015-2o0v8cfoo2vpav356nae8ekbmeq0h3c7.apps.googleusercontent.com';
    const scope = 'email profile';
    const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    console.log("HI");
    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true, // Opens a popup for user interaction
      },
      (responseUrl) => {
        if (responseUrl) {
          console.log('OAuth Flow Completed:', responseUrl);

          // Extract the authorization code from the response URL
          const urlParams = new URLSearchParams(new URL(responseUrl).search);
          const authCode = urlParams.get('code');

          if (authCode) {
            // Send the authorization code to the backend
            axios.post('http://localhost:4500/api/v1/auth/exchange', { code: authCode }, { withCredentials: true })
              .then((response) => {
                console.log("resp");
                console.log(response);

                if (response.data.success) {
                  console.log('User authenticated successfully:', response.data);
                  // setIsAuthenticated(true);
                  // setUser(response.data);
                  chrome.storage.local.set({ accessToken: response.data.access_token }, () => {
                    console.log('Access token saved in chrome.storage');
                    console.log(response.data.access_token);
                    setIsAuthenticated(true);
                    setUser(response.data.user);
                  });
                } else {
                  console.error('Authentication failed:', response.data.message);
                }
              })
              .catch((error) => {
                console.error('Error sending code to backend:', error);
              });
          } else {
            console.error('Authorization code not found in response URL.');
          }
        } else {
          console.error('Login failed or was canceled.');
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
