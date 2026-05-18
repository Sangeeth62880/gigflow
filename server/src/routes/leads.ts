import { Router } from 'express';
import { LeadsController } from '@/controllers/leadsController';
import { asyncHandler } from '@/utils/asyncHandler';
import { validate } from '@/middleware/validate';
import { protect } from '@/middleware/auth';
import { createLeadSchema, updateLeadSchema, queryLeadsSchema } from '@/validators/leadSchemas';

const router = Router();

// All routes require authentication
router.use(protect);

router.post('/', validate(createLeadSchema), asyncHandler(LeadsController.createLead));
router.get('/', validate(queryLeadsSchema), asyncHandler(LeadsController.getLeads));
router.get('/export', validate(queryLeadsSchema), asyncHandler(LeadsController.exportLeads));

router.get('/:id', asyncHandler(LeadsController.getLeadById));
router.put('/:id', validate(updateLeadSchema), asyncHandler(LeadsController.updateLead));
router.delete('/:id', asyncHandler(LeadsController.deleteLead));

export default router;
