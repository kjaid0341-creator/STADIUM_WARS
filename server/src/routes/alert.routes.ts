import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { AppError } from '../middleware/error.middleware';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { SocketService } from '../services/socket.service';

const router = Router();

const AlertSchema = z.object({
  message: z.string().min(5, 'Alert message must be at least 5 characters').max(300),
  severity: z.enum(['INFO', 'WARNING', 'CRITICAL']),
});

/**
 * @route   POST /api/alerts
 * @desc    Broadcast a new emergency/operational alert
 * @access  Staff only (RBAC)
 */
router.post(
  '/',
  requireAuth,
  requireRole(['STAFF']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = AlertSchema.parse(req.body);

      const alert = await prisma.alert.create({
        data: {
          message: validated.message,
          severity: validated.severity,
          senderName: req.user!.name,
        },
      });

      // Broadcast alert in real-time to all connected WebSocket clients (Fans, Staff, Volunteers)
      SocketService.broadcastAlert(alert);

      res.status(201).json({
        status: 'success',
        data: { alert },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError('Validation Error', 400, error.errors));
      }
      next(error);
    }
  }
);

/**
 * @route   GET /api/alerts
 * @desc    Get recent alerts
 * @access  Authenticated users (Fans, Volunteers, Staff)
 */
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10, // Retrieve only the 10 most recent alerts
    });

    res.json({
      status: 'success',
      data: { alerts },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
