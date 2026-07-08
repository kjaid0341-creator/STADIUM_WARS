import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AIService } from '../services/ai.service';
import { SensorService } from '../services/sensor.service';
import { AppError } from '../middleware/error.middleware';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

const ChatSchema = z.object({
  query: z.string().min(2, 'Query must be at least 2 characters').max(500),
  language: z.enum(['en', 'es', 'hi']).default('en'),
});

/**
 * @route   POST /api/ai/chat
 * @desc    Multilingual AI assistant chat for stadium directions/wayfinding
 * @access  Private (Authenticated users)
 */
router.post('/chat', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = ChatSchema.parse(req.body);
    
    const responseText = await AIService.getWayfindingResponse(
      validated.query,
      validated.language
    );

    res.json({
      status: 'success',
      data: {
        response: responseText,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Validation Error', 400, error.errors));
    }
    next(error);
  }
});

/**
 * @route   GET /api/ai/recommendations
 * @desc    Get AI-generated crowd flow action plans from live sensor streams
 * @access  Staff only (RBAC)
 */
router.get(
  '/recommendations',
  requireAuth,
  requireRole(['STAFF']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const latestReadings = await SensorService.getLatestReadings();
      
      const recommendations = await AIService.getCrowdRecommendations(
        latestReadings.map(r => ({
          sectionId: r.sectionId,
          crowdCount: r.crowdCount,
          capacity: r.capacity,
        }))
      );

      res.json({
        status: 'success',
        data: {
          recommendations,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
