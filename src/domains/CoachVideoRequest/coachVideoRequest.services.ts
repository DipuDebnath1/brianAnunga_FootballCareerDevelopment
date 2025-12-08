import CoachVideoRequest, { IAMCoachVideoRequest } from "./coachVideoRequest.model";
import Coach from "../Coach/coach.model";

// Create a new coach video request
const createCoachVideoRequest = async (requestData: Partial<IAMCoachVideoRequest>) => {
  // Check if coach exists
  const coachExists = await Coach.findById(requestData.coach_id);
  if (!coachExists) {
    throw new Error("Coach not found");
  }

  const videoRequest = new CoachVideoRequest(requestData);
  return await videoRequest.save();
};

// Get coach video requests by coach_id
const getCoachVideoRequestsByCoachId = async (coachId: string) => {
  return await CoachVideoRequest.find({ coach_id: coachId }).populate('user_id', 'email username'); // Populate with user info
};

// Get coach video requests by user_id
const getCoachVideoRequestsByUserId = async (userId: string) => {
  return await CoachVideoRequest.find({ user_id: userId }).populate('coach_id', 'fullName email'); // Populate with coach info
};

// Update coach video request status
const updateCoachVideoRequestStatus = async (
  requestId: string,
  status: "pending" | "accept" | "decline" | "completed"
) => {
  return await CoachVideoRequest.findByIdAndUpdate(
    { _id: requestId },
    { $set: { status } },
    { new: true, runValidators: true }
  );
};

// Update coach video request with feedback
const updateCoachVideoRequestFeedback = async (
  requestId: string,
  feedback: string
) => {
  return await CoachVideoRequest.findByIdAndUpdate(
    { _id: requestId },
    { $set: { coach_feedback: feedback } },
    { new: true, runValidators: true }
  );
};

// Get all coach video requests with optional filters
const getAllCoachVideoRequests = async (
  userId?: string,
  coachId?: string,
  status?: "pending" | "accept" | "decline" | "completed"
) => {
  let query: any = {};

  // Add filters if provided
  if (userId) {
    query.user_id = userId;
  }

  if (coachId) {
    query.coach_id = coachId;
  }

  if (status) {
    query.status = status;
  }

  return await CoachVideoRequest.find(query)
    .populate('coach_id', 'fullName email')
    .populate('user_id', 'email username');
};

// Get single coach video request by ID
const getCoachVideoRequestById = async (id: string) => {
  return await CoachVideoRequest.findById(id)
    .populate('coach_id', 'fullName email')
    .populate('user_id', 'email username');
};

const coachVideoRequestService = {
  createCoachVideoRequest,
  getCoachVideoRequestsByCoachId,
  getCoachVideoRequestsByUserId,
  updateCoachVideoRequestStatus,
  updateCoachVideoRequestFeedback,
  getAllCoachVideoRequests,
  getCoachVideoRequestById,
};

export default coachVideoRequestService;