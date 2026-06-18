import { Router } from 'express';
import { eventController } from '../controllers/eventController';
import { healthController } from '../controllers/healthController';

const router = Router();

router.get('/health', healthController.check.bind(healthController));
router.post('/events', eventController.storeEvent.bind(eventController));
router.get('/sessions', eventController.getSessions.bind(eventController));
router.get('/sessions/:sessionId', eventController.getSessionDetails.bind(eventController));
router.get('/heatmap', eventController.getHeatmapData.bind(eventController));

export default router;
