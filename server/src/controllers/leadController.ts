import { Response } from 'express';
import mongoose from 'mongoose';
import { Lead } from '../models/Lead';
import { ApiError } from '../utils/ApiError';
import { AuthRequest, LeadSource, LeadStatus, PaginationMeta } from '../types';
import { leadsToCsv } from '../utils/csvExport';

interface LeadQuery {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: string;
  limit?: string;
}

const buildFilter = (query: LeadQuery): mongoose.FilterQuery<typeof Lead> => {
  const filter: mongoose.FilterQuery<typeof Lead> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.source) {
    filter.source = query.source;
  }

  if (query.search?.trim()) {
    const term = query.search.trim();
    filter.$or = [
      { name: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } },
    ];
  }

  return filter;
};

export const getLeads = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const query = req.query as LeadQuery;
  const page = Math.max(1, parseInt(query.page ?? '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? '10', 10)));
  const skip = (page - 1) * limit;
  const sortOrder = query.sort === 'oldest' ? 1 : -1;

  const filter = buildFilter(query);
  const [leads, totalRecords] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email'),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalRecords / limit) || 1;
  const pagination: PaginationMeta = {
    page,
    limit,
    totalPages,
    totalRecords,
  };

  res.json({
    success: true,
    data: { leads, pagination },
  });
};

export const getLeadById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const id = String(req.params.id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid lead ID');
  }

  const lead = await Lead.findById(id).populate('createdBy', 'name email');
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  res.json({
    success: true,
    data: { lead },
  });
};

export const createLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { name, email, status, source } = req.body as {
    name: string;
    email: string;
    status?: LeadStatus;
    source: LeadSource;
  };

  const lead = await Lead.create({
    name,
    email,
    status: status ?? 'New',
    source,
    createdBy: req.user!.userId,
  });

  res.status(201).json({
    success: true,
    message: 'Lead created successfully',
    data: { lead },
  });
};

export const updateLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const id = String(req.params.id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid lead ID');
  }

  const lead = await Lead.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  res.json({
    success: true,
    message: 'Lead updated successfully',
    data: { lead },
  });
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const id = String(req.params.id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid lead ID');
  }

  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  res.json({
    success: true,
    message: 'Lead deleted successfully',
  });
};

export const exportLeadsCsv = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const query = req.query as LeadQuery;
  const sortOrder = query.sort === 'oldest' ? 1 : -1;
  const filter = buildFilter(query);

  const leads = await Lead.find(filter).sort({ createdAt: sortOrder });
  const csv = leadsToCsv(leads);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="gigflow-leads-${Date.now()}.csv"`
  );
  res.send(csv);
};
