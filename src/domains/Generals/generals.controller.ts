import { Request, Response } from "express";
import generalsService from "./generals.services";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { Types } from "mongoose";

// Subscription Controllers
const createSubscription = async (req: Request, res: Response) => {
  try {
    const subscription = await generalsService.createSubscription(req.body);
    res.status(httpStatus.CREATED).json(
      response({
        message: "Subscription package created successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: subscription,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await generalsService.getAllSubscriptions();
    res.status(httpStatus.OK).json(
      response({
        message: "Subscriptions retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: subscriptions,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscription = await generalsService.updateSubscription(id, req.body);

    if (!subscription) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Subscription not found",
          status: "NOT_FOUND",
          statusCode: httpStatus.NOT_FOUND,
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Subscription updated successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: subscription,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const deleteSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscription = await generalsService.deleteSubscription(id);

    if (!subscription) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Subscription not found",
          status: "NOT_FOUND",
          statusCode: httpStatus.NOT_FOUND,
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Subscription deleted successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: subscription,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Testimonial Controllers
const createTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await generalsService.createTestimonial(req.body);
    res.status(httpStatus.CREATED).json(
      response({
        message: "Testimonial created successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: testimonial,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const getAllTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await generalsService.getAllTestimonials();
    res.status(httpStatus.OK).json(
      response({
        message: "Testimonials retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: testimonials,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const testimonial = await generalsService.updateTestimonial(id, req.body);

    if (!testimonial) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Testimonial not found",
          status: "NOT_FOUND",
          statusCode: httpStatus.NOT_FOUND,
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Testimonial updated successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: testimonial,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const testimonial = await generalsService.deleteTestimonial(id);

    if (!testimonial) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Testimonial not found",
          status: "NOT_FOUND",
          statusCode: httpStatus.NOT_FOUND,
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Testimonial deleted successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: testimonial,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

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
