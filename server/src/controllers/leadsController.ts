import { Request, Response } from 'express';
import { LeadsService } from '@/services/leadsService';
import { ApiResponse } from '@/utils/ApiResponse';

export class LeadsController {
  static async createLead(req: Request, res: Response) {
    const lead = await LeadsService.createLead(req.body, req.user!.id);
    ApiResponse.created(res, 'Lead created successfully', lead);
  }

  static async getLeads(req: Request, res: Response) {
    const result = await LeadsService.getLeads(req.query as any, req.user!.id, req.user!.role);
    ApiResponse.ok(res, 'Leads fetched successfully', result);
  }

  static async getLeadById(req: Request, res: Response) {
    const lead = await LeadsService.getLeadById(req.params.id as string, req.user!.id, req.user!.role);
    ApiResponse.ok(res, 'Lead fetched successfully', lead);
  }

  static async updateLead(req: Request, res: Response) {
    const lead = await LeadsService.updateLead(req.params.id as string, req.body, req.user!.id, req.user!.role);
    ApiResponse.ok(res, 'Lead updated successfully', lead);
  }

  static async deleteLead(req: Request, res: Response) {
    await LeadsService.deleteLead(req.params.id as string, req.user!.id, req.user!.role);
    ApiResponse.ok(res, 'Lead deleted successfully');
  }

  static async exportLeads(req: Request, res: Response) {
    const leads = await LeadsService.exportLeads(req.query as any, req.user!.id, req.user!.role);
    ApiResponse.ok(res, 'Leads exported successfully', leads);
  }
}

