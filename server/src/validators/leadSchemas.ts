import { z } from 'zod';

export const leadStatusEnum = z.enum(['New', 'Contacted', 'Qualified', 'Lost']);
export const leadSourceEnum = z.enum(['Organic', 'Referral', 'LinkedIn', 'Twitter', 'Direct', 'Other', 'Website', 'Instagram']);

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').trim(),
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    status: leadStatusEnum.optional().default('New'),
    source: leadSourceEnum,
  }),
});

export const updateLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').trim().optional(),
    email: z.string().email('Invalid email address').trim().toLowerCase().optional(),
    status: leadStatusEnum.optional(),
    source: leadSourceEnum.optional(),
  }),
});

export const queryLeadsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(Number),
    limit: z.string().regex(/^\d+$/).optional().transform(Number),
    search: z.string().optional(),
    status: leadStatusEnum.optional(),
    source: leadSourceEnum.optional(),
    sort: z.enum(['latest', 'oldest']).optional().default('latest'),
  }),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>['body'];
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>['body'];
export type QueryLeadsInput = z.infer<typeof queryLeadsSchema>['query'];
