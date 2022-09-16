import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const jwtSecret = 'your-jwt-secret';
const authTokenLifetime = 10;
const refreshTokenLifetime = 3600;
const user_id = '3a5d40a8-4b7b-470f-909e-442dfcc01ff9';
const port = 5000;

const app = express();

// Enable CORS
const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

//
app.get('/', function (req, res) {
  res.json({ msg: 'Example API for NextStaticSiteAuth.js' });
});

// Login route
app.post('/auth/login', async function (req, res) {
  const { body } = req;

  // Don't use this for production, it's only for testing
  // You should create your own login system
  if (!['user@example.com', 'norefresh@example.com'].includes(body.email)) {
    return res.status(401).json({});
  }
  if (body.password !== '123456') {
    return res.status(401).json({});
  }

  const authTokenExp = Math.floor(Date.now() / 1000) + authTokenLifetime;
  const refreshTokenExp = Math.floor(Date.now() / 1000) + refreshTokenLifetime;

  const authToken = jwt.sign({ exp: authTokenExp, user_id }, jwtSecret);

  const refreshToken = jwt.sign(
    {
      exp: refreshTokenExp,
      refresh_token: uuidv4(),
      user_id,
      ...(body.email === 'norefresh@example.com' && { no_refresh: true }),
    },
    jwtSecret,
  );

  res.setHeader('Access-Control-Expose-Headers', 'Authorization');
  res.setHeader('Authorization', 'Bearer ' + authToken);
  res.cookie('refresh_token', refreshToken, {
    path: '/',
    maxAge: refreshTokenLifetime * 1000,
    httpOnly: true, // You can't access these tokens in the client's javascript
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production' ? true : false, // Forces to use https in production
  });

  res.status(200).json({
    user_id,
    email: body.email,
  });
});

// Logout route
app.get('/auth/logout', function (req, res) {
  res.clearCookie('refresh_token', { path: '/' });
  res.status(200).json({ message: 'Bye bye...' });
});

// Refresh route
app.get('/auth/refresh', async function (req, res) {
  if (!req.cookies || !req.cookies.refresh_token) {
    res.status(401).json({ error: 'Missing refresh token' });
    return;
  }

  try {
    const decoded = jwt.verify(req.cookies.refresh_token, jwtSecret);

    // Only for testing!
    // If no_refresh is found in the refresh token, the user get's logged out
    if (decoded.no_refresh) {
      res.clearCookie('refresh_token', { path: '/' });
      res.status(403).json({ error: 'Not allowed to refresh the token' });
      return;
    }

    const authTokenExp = Math.floor(Date.now() / 1000) + authTokenLifetime;
    const refreshTokenExp =
      Math.floor(Date.now() / 1000) + refreshTokenLifetime;

    const authToken = jwt.sign({ exp: authTokenExp, user_id }, jwtSecret);

    const refreshToken = jwt.sign(
      {
        exp: refreshTokenExp,
        refresh_token: uuidv4(),
        user_id: user_id,
      },
      jwtSecret,
    );

    res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    res.setHeader('Authorization', 'Bearer ' + authToken);
    res.cookie('refresh_token', refreshToken, {
      path: '/',
      maxAge: refreshTokenLifetime * 1000,
      httpOnly: true, // You can't access these tokens in the client's javascript
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production' ? true : false, // Forces to use https in production
    });

    res.status(200).json({});
  } catch (err) {
    res.status(401).json({});
  }
});

// Data route
app.get('/data', function (req, res, next) {
  res.status(200).json({ content: 'External content', serverTime: new Date() });
});

// Start the server
app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
});
