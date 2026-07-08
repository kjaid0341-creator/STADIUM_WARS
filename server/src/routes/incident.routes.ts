import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { AppError } from '../middleware/error.middleware';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { SocketService } from '../services/socket.service';

const router = Router();

const IncidentSchema = z.object({
  type: z.enum(['CROWD_CONGESTION', 'MEDICAL', 'SECURITY', 'FACILITY_ISSUE', 'OTHER']),
  location: z.string().min(2, 'Location details are required').max(100),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  description: z.string().min(5, 'Description must be at least 5 characters long').max(1000),
});

const UpdateStatusSchema = z.object({
  status: z.enum(['OPEN', 'RESOLVING', 'RESOLVED']),
});

/**
 * @route   POST /api/incidents
 * @desc    Log a new incident
 * @access  Staff and Volunteers only
 */
router.post(
  '/',
  requireAuth,
  requireRole(['STAFF', 'VOLUNTEER']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = IncidentSchema.parse(req.body);

      const incident = await prisma.incident.create({
        data: {
          type: validated.type,
          location: validated.location,
          severity: validated.severity,
          description: validated.description,
          reporterName: req.user!.name,
        },
      });

      // Broadcast to all staff/volunteers connected via WebSocket
      SocketService.broadcastIncident(incident);

      res.status(201).json({
        status: 'success',
        data: { incident },
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
 * @route   GET /api/incidents
 * @desc    Get all logged incidents
 * @access  Staff and Volunteers only
 */
router.get(
  '/',
  requireAuth,
  requireRole(['STAFF', 'VOLUNTEER']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const incidents = await prisma.incident.findMany({
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        status: 'success',
        data: { incidents },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   PATCH /api/incidents/:id/status
 * @desc    Update incident resolving status
 * @access  Staff only (RBAC protected)
 */
router.patch(
  '/:id/status',
  requireAuth,
  requireRole(['STAFF']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const validated = UpdateStatusSchema.parse(req.body);

      const incidentId = parseInt(id, 10);
      if (isNaN(incidentId)) {
        return next(new AppError('Invalid incident ID', 400));
      }

      const existing = await prisma.incident.findUnique({
        where: { id: incidentId },
      });

      if (!existing) {
        return next(new AppError('Incident not found', 404));
      }

      const updated = await prisma.incident.update({
        where: { id: incidentId },
        data: { status: validated.status },
      });

      // Broadcast the update
      SocketService.broadcastIncident(updated);

      res.json({
        status: 'success',
        data: { incident: updated },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError('Validation Error', 400, error.errors));
      }
      next(error);
    }
  }
);

export default router;
