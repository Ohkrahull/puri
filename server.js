// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { initializeApp, cert } = require('firebase-admin/app');
// const { getFirestore } = require('firebase-admin/firestore');
// const nodemailer = require('nodemailer');
// const bcrypt = require('bcryptjs');
// const { v4: uuidv4 } = require('uuid');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Initialize Firebase Admin
// const serviceAccount = require('./path/to/your/serviceAccountKey.json');
// initializeApp({
//   credential: cert(serviceAccount)
// });

// const db = getFirestore();

// // Nodemailer transporter
// let transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: process.env.EMAIL_SECURE === 'true',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// app.post('/api/forgot-password', async (req, res) => {
//   try {
//     const { email } = req.body;
//     const usersRef = db.collection('staffUsers');
//     const snapshot = await usersRef.where('email', '==', email).get();

//     if (snapshot.empty) {
//       return res.status(404).json({ message: 'No user found with this email address.' });
//     }

//     const userDoc = snapshot.docs[0];
//     const userId = userDoc.id;

//     const resetToken = uuidv4();
//     const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

//     await usersRef.doc(userId).update({
//       resetToken,
//       resetTokenExpires: resetTokenExpires.toISOString(),
//     });

//     const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

//     await transporter.sendMail({
//       from: `"Your App Name" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Password Reset Request",
//       text: `Please use the following link to reset your password: ${resetLink}`,
//       html: `<p>Please use the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
//     });

//     res.json({ message: 'Password reset email sent successfully' });
//   } catch (error) {
//     console.error('Error in forgot password:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// app.post('/api/reset-password', async (req, res) => {
//   try {
//     const { token, newPassword } = req.body;
//     const usersRef = db.collection('staffUsers');
//     const snapshot = await usersRef.where('resetToken', '==', token).get();

//     if (snapshot.empty) {
//       return res.status(400).json({ message: 'Invalid or expired reset token.' });
//     }

//     const userDoc = snapshot.docs[0];
//     const userData = userDoc.data();

//     if (new Date() > new Date(userData.resetTokenExpires)) {
//       return res.status(400).json({ message: 'Reset token has expired.' });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     await usersRef.doc(userDoc.id).update({
//       password: hashedPassword,
//       resetToken: null,
//       resetTokenExpires: null,
//     });

//     res.json({ message: 'Password has been reset successfully' });
//   } catch (error) {
//     console.error('Error in reset password:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// app.get('/api/check-email', async (req, res) => {
//   try {
//     const { email } = req.query;
//     const usersRef = db.collection('staffUsers');
//     const snapshot = await usersRef.where('email', '==', email).get();

//     res.json({ exists: !snapshot.empty });
//   } catch (error) {
//     console.error('Error checking email:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));