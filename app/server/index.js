// server/index.js (or app.js)
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const admin = require('firebase-admin');
// initialize firebase-admin here with your service account if not already
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

app.use(cors());
app.use(express.json());

// register routes
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);

// error handling etc
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
