import { Router } from 'express';

import {
  getPeopleController,
  addPersonController,
  deletePersonController,
  personGetByIdController,
  updatePersonByIdController
} from './peopleController';

const router = Router();
router.get('/', getPeopleController);
router.post('/add', addPersonController);
router.delete('/delete/:id', deletePersonController);
router.get('/:person_id', personGetByIdController);
router.put('/', updatePersonByIdController);

export default router;
