import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../ErrorHandler/AppError";
import { CoachTimeSlotBaseService } from "../../service";
import { ROLE } from "../../utills/roles";
import { DayOfWeek, ITimeSlot, TimeSlotByDayGroup, daysOfWeek } from "./coach.interface";
import {
  CreateTimeSlotInput,
  UpdateTimeSlotInput,
} from "./coach.validation";

const assertCoachRole = (role: string) => {
  if (role !== ROLE.coach) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only coaches can manage time slots"
    );
  }
};

const getOwnTimeSlot = async (coachId: string, slotId: string) => {
  const slot = await CoachTimeSlotBaseService.findById(slotId);

  if (!slot || slot.author.toString() !== coachId) {
    throw new AppError(httpStatus.NOT_FOUND, "Time slot not found");
  }

  return slot;
};

const groupTimeSlotsByDay = (
  slots: ITimeSlot[] | null,
  filterDay?: DayOfWeek
): TimeSlotByDayGroup[] => {
  const grouped = new Map<DayOfWeek, ITimeSlot[]>();

  for (const slot of slots ?? []) {
    const daySlots = grouped.get(slot.day) ?? [];
    daySlots.push(slot);
    grouped.set(slot.day, daySlots);
  }

  const daysToInclude = filterDay ? [filterDay] : [...daysOfWeek];

  return daysToInclude
    .filter((day) => grouped.has(day))
    .map((day) => ({
      day,
      slots: grouped
        .get(day)!
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        ),
    }));
};

const createTimeSlot = async (
  coachId: string,
  role: string,
  payload: CreateTimeSlotInput
) => {
  assertCoachRole(role);

  return CoachTimeSlotBaseService.create({
    author: new Types.ObjectId(coachId),
    day: payload.day,
    startTime: payload.startTime,
    endTime: payload.endTime,
  });
};

const getTimeSlots = async (
  coachId: string,
  role: string,
  day?: DayOfWeek
) => {
  assertCoachRole(role);

  const filters: Record<string, unknown> = { author: coachId };
  if (day) {
    filters.day = day;
  }

  const slots = await CoachTimeSlotBaseService.findMany({ filters });

  return groupTimeSlotsByDay(slots, day);
};

const getTimeSlotById = async (
  coachId: string,
  role: string,
  slotId: string
) => {
  assertCoachRole(role);
  return getOwnTimeSlot(coachId, slotId);
};

const updateTimeSlot = async (
  coachId: string,
  role: string,
  slotId: string,
  payload: UpdateTimeSlotInput
) => {
  assertCoachRole(role);
  await getOwnTimeSlot(coachId, slotId);

  const updateData: Partial<ITimeSlot> = {};

  if (payload.day !== undefined) updateData.day = payload.day;
  if (payload.startTime !== undefined) {
    updateData.startTime = payload.startTime;
  }
  if (payload.endTime !== undefined) updateData.endTime = payload.endTime;

  if (payload.startTime || payload.endTime) {
    const existing = await getOwnTimeSlot(coachId, slotId);
    const startTime = payload.startTime ?? existing.startTime;
    const endTime = payload.endTime ?? existing.endTime;

    if (endTime <= startTime) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "endTime must be after startTime"
      );
    }
  }

  const updated = await CoachTimeSlotBaseService.updateById(slotId, {
    $set: updateData,
  });

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Time slot not found");
  }

  return updated;
};

const deleteTimeSlot = async (
  coachId: string,
  role: string,
  slotId: string
) => {
  assertCoachRole(role);
  await getOwnTimeSlot(coachId, slotId);

  const deleted = await CoachTimeSlotBaseService.hardDeleteById(slotId);

  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Time slot not found");
  }

  return deleted;
};

export const CoachServices = {
  createTimeSlot,
  getTimeSlots,
  getTimeSlotById,
  updateTimeSlot,
  deleteTimeSlot,
};

export default CoachServices;
