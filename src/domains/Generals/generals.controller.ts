import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import generalsService from "./generals.services";

const createSubscription: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const subscription = await generalsService.createSubscription(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Subscription package created successfully",
      data: subscription,
    });
  }
);

const getAllSubscriptions: RequestHandler = catchAsync(
  async (_req: Request, res: Response) => {
    const subscriptions = await generalsService.getAllSubscriptions();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Subscriptions retrieved successfully",
      data: subscriptions,
    });
  }
);

const updateSubscription: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const subscription = await generalsService.updateSubscription(
      req.params.id as string,
      req.body
    );

    if (!subscription) {
      throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Subscription updated successfully",
      data: subscription,
    });
  }
);

const deleteSubscription: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const subscription = await generalsService.deleteSubscription(
      req.params.id as string
    );

    if (!subscription) {
      throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Subscription deleted successfully",
      data: subscription,
    });
  }
);

const createTestimonial: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const testimonial = await generalsService.createTestimonial(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Testimonial created successfully",
      data: testimonial,
    });
  }
);

const getAllTestimonials: RequestHandler = catchAsync(
  async (_req: Request, res: Response) => {
    const testimonials = await generalsService.getAllTestimonials();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Testimonials retrieved successfully",
      data: testimonials,
    });
  }
);

const updateTestimonial: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const testimonial = await generalsService.updateTestimonial(
      req.params.id as string,
      req.body
    );

    if (!testimonial) {
      throw new AppError(httpStatus.NOT_FOUND, "Testimonial not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  }
);

const deleteTestimonial: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const testimonial = await generalsService.deleteTestimonial(
      req.params.id as string
    );

    if (!testimonial) {
      throw new AppError(httpStatus.NOT_FOUND, "Testimonial not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Testimonial deleted successfully",
      data: testimonial,
    });
  }
);

export default {
  createSubscription,
  getAllSubscriptions,
  updateSubscription,
  deleteSubscription,
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
};
