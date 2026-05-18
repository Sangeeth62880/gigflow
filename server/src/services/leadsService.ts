import { Lead, ILead } from '@/models/Lead';
import { ApiError } from '@/utils/ApiError';
import { CreateLeadInput, UpdateLeadInput, QueryLeadsInput } from '@/validators/leadSchemas';

interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class LeadsService {
  static async createLead(data: CreateLeadInput, userId: string): Promise<ILead> {
    const existingLead = await Lead.findOne({ email: data.email, createdBy: userId });
    if (existingLead) {
      throw ApiError.conflict('Lead with this email already exists for your account');
    }

    const lead = await Lead.create({ ...data, createdBy: userId });
    return lead;
  }

  private static buildQuery(query: QueryLeadsInput, userId: string, role: string) {
    const filter: any = {};

    if (role !== 'admin') {
      filter.createdBy = userId;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.source) {
      filter.source = query.source;
    }

    if (query.search) {
      const escapedSearch = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Sanitize regex
      filter.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { email: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    const sortOpt = query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    return { filter, sortOpt };
  }

  static async getLeads(query: QueryLeadsInput, userId: string, role: string) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 50); // Hard cap limit
    const skip = (page - 1) * limit;

    const { filter, sortOpt } = this.buildQuery(query, userId, role);

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sortOpt as any)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email'),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    const pagination: PaginationResult = {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    return { leads, pagination };
  }

  static async getLeadById(id: string, userId: string, role: string): Promise<ILead> {
    const lead = await Lead.findById(id).populate('createdBy', 'name email');
    
    if (!lead) {
      throw ApiError.notFound('Lead not found');
    }

    if (role !== 'admin' && lead.createdBy._id.toString() !== userId) {
      throw ApiError.forbidden('You do not have permission to view this lead');
    }

    return lead;
  }

  static async updateLead(id: string, data: UpdateLeadInput, userId: string, role: string): Promise<ILead> {
    const lead = await this.getLeadById(id, userId, role);

    if (data.email && data.email !== lead.email) {
      const existingEmail = await Lead.findOne({ email: data.email, createdBy: lead.createdBy._id });
      if (existingEmail) {
        throw ApiError.conflict('Lead with this email already exists for this account');
      }
    }

    Object.assign(lead, data);
    await lead.save();
    return lead;
  }

  static async deleteLead(id: string, userId: string, role: string): Promise<void> {
    const lead = await this.getLeadById(id, userId, role);
    await lead.deleteOne();
  }

  static async exportLeads(query: QueryLeadsInput, userId: string, role: string): Promise<ILead[]> {
    const { filter, sortOpt } = this.buildQuery(query, userId, role);
    
    const leads = await Lead.find(filter)
      .sort(sortOpt as any)
      .populate('createdBy', 'name email');
      
    return leads;
  }
}
