import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/analytics
 * @desc    Get aggregated stats for the staff operations dashboard
 * @access  Staff only (RBAC)
 */
router.get(
  '/',
  requireAuth,
  requireRole(['STAFF']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Gather actual metrics from DB
      const totalIncidents = await prisma.incident.count();
      const openIncidents = await prisma.incident.count({ where: { status: 'OPEN' } });
      const activeUsers = await prisma.user.count();
      
      const incidentCountsByType = await prisma.incident.groupBy({
        by: ['type'],
        _count: {
          type: true,
        },
      });

      // 2. Generate simulated metrics for presentation
      const avgWaitTimes = [
        { hour: '09:00', gate3: 12, gate5: 25, gate12: 8 },
        { hour: '10:00', gate3: 15, gate5: 35, gate12: 10 },
        { hour: '11:00', gate3: 18, gate5: 48, gate12: 12 },
        { hour: '12:00', gate3: 28, gate5: 58, gate12: 15 }, // Match peak congestion
        { hour: '13:00', gate3: 20, gate5: 42, gate12: 18 },
        { hour: '14:00', gate3: 14, gate5: 22, gate12: 11 },
      ];

      const hourlyIncidents = [
        { hour: '09:00', medical: 1, security: 0, crowd: 2 },
        { hour: '10:00', medical: 2, security: 1, crowd: 4 },
        { hour: '11:00', medical: 0, security: 0, crowd: 7 },
        { hour: '12:00', medical: 3, security: 2, crowd: 12 },
        { hour: '13:00', medical: 1, security: 1, crowd: 5 },
        { hour: '14:00', medical: 0, security: 0, crowd: 2 },
      ];

      res.json({
        status: 'success',
        data: {
          metrics: {
            totalIncidents,
            openIncidents,
            activeUsers,
            avgWaitTimeMinutes: 24, // global average
            safetyRating: 98.4
          },
          incidentTypes: incidentCountsByType.map(group => ({
            type: group.type,
            count: group._count.type,
          })),
          waitTimesTimeSeries: avgWaitTimes,
          incidentsTimeSeries: hourlyIncidents,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
