const express = require('express');
const passport = require('passport');
const axios = require('axios');
require('../services/passport');


const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    // Send data back to the extension after successful authentication
    const successData = {
        user: req.user, // User data from Passport
    };

    // Render a success page that triggers communication back to the extension
    res.send(`<script>
        chrome.runtime.sendMessage({
            action: 'auth_success',
            user: ${JSON.stringify(successData)}
        });
        window.close();
    </script>`);
});
router.get('/me', (req, res) => {
    res.send(req.user)
})
// router.get('/me', async (req, res) => {
//     // Extract the access token from the Authorization header
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ success: false, message: 'Authorization token is missing or invalid' });
//     }

//     const accessToken = authHeader.split(' ')[1]; // Extract the token part

//     try {
//         // Validate the access token with Google OAuth or decode it
//         const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json`, {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });

//         // If valid, return the user info
//         const userInfo = response.data;

//         return res.status(200).json({
//             success: true,
//             user: {
//                 id: userInfo.id,
//                 email: userInfo.email,
//                 name: userInfo.name,
//                 picture: userInfo.picture,
//             },
//         });
//     } catch (error) {
//         console.error('Error validating token or fetching user info:', error);
//         return res.status(401).json({ success: false, message: 'Invalid or expired token' });
//     }
// });


// router.get('/logout', (req, res) => {
//     console.log('logging outNOW!!!');
//     req.logout();
//     res.redirect('/');
// })

router.get('/logout', async (req, res) => {
    console.log("LOG OUT !!!!!");
    const accessToken = req.session?.user?.access_token;

    if (!accessToken) {
        console.log("NO toke :(");
        return res.status(400).json({ success: false, message: 'No access token found' });
    }

    try {
        // Revoke the access token
        await axios.post(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, null, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        // Destroy the session and clear cookies
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ success: false, message: 'Failed to log out' });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ success: true, message: 'Logged out successfully and token revoked' });
        });
    } catch (error) {
        console.error('Error revoking token:', error);
        res.status(500).json({ success: false, message: 'Failed to revoke token' });
    }
});


router.post('/exchange', async (req, res) => {
    const { code } = req.body;

    try {
        // Exchange the authorization code for tokens
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.CHROME_URI, // Same as used in the frontend
            code,
            grant_type: 'authorization_code',
        });

        const { access_token, refresh_token, expires_in } = response.data;

        // Store tokens securely (e.g., in a database or session)
        req.session.user = { access_token, refresh_token, expires_in };

        res.json({ success: true, message: 'User authenticated successfully', access_token: access_token });
    } catch (error) {
        console.error('Error exchanging authorization code:', error);
        res.status(500).json({ success: false, message: 'Failed to authenticate' });
    }
});

module.exports = router;