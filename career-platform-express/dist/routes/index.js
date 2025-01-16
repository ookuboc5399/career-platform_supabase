"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const services_1 = __importDefault(require("./services"));
const testimonials_1 = __importDefault(require("./testimonials"));
const blog_1 = __importDefault(require("./blog"));
const contact_1 = __importDefault(require("./contact"));
const faq_1 = __importDefault(require("./faq"));
const router = express_1.default.Router();
router.use('/services', services_1.default);
router.use('/testimonials', testimonials_1.default);
router.use('/blog', blog_1.default);
router.use('/contact', contact_1.default);
router.use('/faq', faq_1.default);
exports.default = router;
