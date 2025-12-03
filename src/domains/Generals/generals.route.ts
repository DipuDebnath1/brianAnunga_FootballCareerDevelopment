import { Router } from "express";
import generalsController from "./generals.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Subscription Routes
router.post(
  "/subscriptions",
  authMiddleware,
  generalsController.createSubscription
);
router.get("/subscriptions", generalsController.getAllSubscriptions);
router.patch(
  "/subscriptions/:id",
  authMiddleware,
  generalsController.updateSubscription
);
router.delete(
  "/subscriptions/:id",
  authMiddleware,
  generalsController.deleteSubscription
);

// Testimonial Routes
router.post("/testimonials", generalsController.createTestimonial);
router.get("/testimonials", generalsController.getAllTestimonials);
router.patch(
  "/testimonials/:id",
  authMiddleware,
  generalsController.updateTestimonial
);
router.delete(
  "/testimonials/:id",
  authMiddleware,
  generalsController.deleteTestimonial
);

export default router;
