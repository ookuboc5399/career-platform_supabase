import express from 'express';
import servicesRouter from './services';
import testimonialsRouter from './testimonials';
import blogRouter from './blog';
import contactRouter from './contact';
import faqRouter from './faq';

const router = express.Router();

router.use('/services', servicesRouter);
router.use('/testimonials', testimonialsRouter);
router.use('/blog', blogRouter);
router.use('/contact', contactRouter);
router.use('/faq', faqRouter);

export default router;
