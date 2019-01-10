import { Router } from 'express';

import {
dashController,
} from './dashController';

const router = Router();
router.get('/', dashController);

export default router;
