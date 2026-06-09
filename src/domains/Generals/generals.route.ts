import { Router } from "express";
import generalsController from "./generals.controller";
import auth from "../../middlewares/auth";

const router = Router();

// Subscription Routes
router.post(
  "/subscriptions",
  auth(),
  generalsController.createSubscription
);
router.get("/subscriptions", generalsController.getAllSubscriptions);
router.patch(
  "/subscriptions/:id",
  auth(),
  generalsController.updateSubscription
);
router.delete(
  "/subscriptions/:id",
  auth(),
  generalsController.deleteSubscription
);

// Testimonial Routes
router.post("/testimonials", generalsController.createTestimonial);
router.get("/testimonials", generalsController.getAllTestimonials);
router.patch(
  "/testimonials/:id",
  auth(),
  generalsController.updateTestimonial
);
router.delete(
  "/testimonials/:id",
  auth(),
  generalsController.deleteTestimonial
);

export default router;
