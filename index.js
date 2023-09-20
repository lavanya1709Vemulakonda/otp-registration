const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const app = express();
const Twilio = require("twilio")
const port = process.env.PORT || 4000;

mongoose.connect("mongodb+srv://lavanya:Vemulakonda1@cluster0.pmdhcki.mongodb.net/?retryWrites=true&w=majority/users", { useNewUrlParser: true, useUnifiedTopology: true });

// Define your user schema and model here using mongoose.

app.use(bodyparser.json());

// Define your routes for user registration, IP address validation, OTP generation, and validation here.


// Define your user schema and model using mongoose.

const User = mongoose.model('User', {
    username: String,
    ipAddress: String,
    otp: String,
    isVerified: Boolean,
  });
  
  // Route for user registration with IP address validation.
  app.post('/register', async (req, res) => {
    try {
      const userIpAddress = req.ip; // Get the user's IP address from the request.
  
      // Implement your IP address validation logic here.
      // For example, you can check if the IP address is from a specific country or range.
  
      if (isValidIpAddress(userIpAddress)) {
        // The user's IP address is valid; proceed with registration.
        // Generate a random OTP (e.g., 6-digit code).
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
        // Send OTP to the user's phone number using Twilio.
        // Make sure to set up Twilio credentials and initialize the Twilio client.
  
        // Save user data in the database.
        const user = new User({
          username: req.body.username,
          ipAddress: userIpAddress,
          otp,
          isVerified: false,
        });
        await user.save();
  
        res.status(201).json({ message: 'OTP sent successfully' });
      } else {
        // Invalid IP address; reject registration.
        res.status(403).json({ error: 'Invalid IP address' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  function isValidIpAddress(ipAddress) {
    // Implement your IP address validation logic here.
    // You can check against specific IP ranges, geolocation data, or other criteria.
    // Return true if the IP address is valid, and false if it's not.
    return true; // Change this to your actual validation logic.
  }

  // Route for OTP validation and user registration.
app.post('/verify', async (req, res) => {
    try {
      const { username, enteredOTP } = req.body;
  
      // Find the user in the database by username.
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (user.otp === enteredOTP) {
        // OTP is valid; mark the user as verified and complete registration.
        user.isVerified = true;
        await user.save();
  
        return res.status(200).json({ message: 'OTP verified successfully, user registered' });
      } else {
        return res.status(401).json({ error: 'Invalid OTP' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  