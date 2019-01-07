import { Router } from 'express';

import {
  taskAddController,taskGetController,taskFileUploadController,updateTaskController,taskGetByIdController,updateTaskByIdController,updateTaskFilesByIdController
} from './taskController';

const router = Router();
router.post('/add', taskAddController);
router.get('/', taskGetController);
router.post('/upload/:uploaded_by', taskFileUploadController);
router.patch('/:id', updateTaskController);
router.get('/:task_id', taskGetByIdController);
router.put('/', updateTaskByIdController);
router.put('/upload', updateTaskFilesByIdController);
export default router;
