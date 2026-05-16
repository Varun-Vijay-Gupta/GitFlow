import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCsv,
} from '../controllers/leadController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

const leadBodyValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status'),
  body('source')
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source'),
];

const listQueryValidation = [
  query('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status filter'),
  query('source')
    .optional()
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source filter'),
  query('sort')
    .optional()
    .isIn(['latest', 'oldest'])
    .withMessage('Sort must be latest or oldest'),
  query('page').optional().isInt({ min: 1 }).withMessage('Invalid page'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Invalid limit'),
];

router.use(protect);

router.get(
  '/',
  validate(listQueryValidation),
  asyncHandler(getLeads)
);

router.get(
  '/export/csv',
  validate(listQueryValidation),
  asyncHandler(exportLeadsCsv)
);

router.get(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid lead ID')]),
  asyncHandler(getLeadById)
);

router.post(
  '/',
  validate(leadBodyValidation),
  asyncHandler(createLead)
);

router.put(
  '/:id',
  authorize('admin'),
  validate([
    param('id').isMongoId().withMessage('Invalid lead ID'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('status')
      .optional()
      .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
      .withMessage('Invalid status'),
    body('source')
      .optional()
      .isIn(['Website', 'Instagram', 'Referral'])
      .withMessage('Invalid source'),
  ]),
  asyncHandler(updateLead)
);

router.delete(
  '/:id',
  authorize('admin'),
  validate([param('id').isMongoId().withMessage('Invalid lead ID')]),
  asyncHandler(deleteLead)
);

export default router;
