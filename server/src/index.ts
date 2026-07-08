import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { config } from './config/index';
import { errorHandler } from './middleware/error.middleware';
import { SocketService } from './services/socket.service';
import { SensorService } from './services/sensor.service';

// Route Imports
import authRoutes from './routes/auth.routes';
import incidentRoutes from './routes/incident.routes';
import alertRoutes from './routes/alert.routes';
import aiRoutes from './routes/ai.routes';
import analyticsRoutes from './routes/analytics.routes';

const app = express();
const httpServer = createServer(app);

// 1. Security Headers & CORS
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      const isAllowed =
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        origin.endsWith('.vercel.app') ||
        origin === 'https://fifa-client.vercel.app';
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, false); // Block other domains gracefully
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

// 2. Global Rate Limiter (Prevent brute force & DDoS)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', apiLimiter);

// 3. Request Parsers
app.use(express.json({ limit: '10kb' })); // Max payload size limit for security

// Custom robust Cookie Parser middleware (zero external package dependencies)
app.use((req, res, next) => {
  const cookies: Record<string, string> = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.split('=');
      if (name && rest.length > 0) {
        cookies[name.trim()] = rest.join('=').trim();
      }
    });
  }
  (req as any).cookies = cookies;
  next();
});

// 4. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);

// Simple Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// 5. Initialize WebSockets
SocketService.initialize(httpServer);

// 6. Global Error Boundary
app.use(errorHandler);

// 7. Initialize Telemetry Sensors & Start Server
const startServer = async () => {
  try {
    // Seed and start sensor fluctuations
    await SensorService.initialize();

    httpServer.listen(config.port, () => {
      console.log(`=========================================`);
      console.log(`  StadiumIQ API Server booted successfully `);
      console.log(`  Port: ${config.port}                        `);
      console.log(`  Environment: ${config.nodeEnv}             `);
      console.log(`=========================================`);
    });
  } catch (err) {
    console.error('Fatal error during server initialization:', err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Shutting down gracefully...');
  SensorService.stopSimulation();
  httpServer.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

export { app, httpServer };
