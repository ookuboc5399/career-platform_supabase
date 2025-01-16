"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../config/database"));
const router = express_1.default.Router();
const getAllFaqs = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('SELECT * FROM faqs ORDER BY created_at DESC');
    return result.rows;
});
const getFaqsByCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('SELECT * FROM faqs WHERE category = $1', [category]);
    return result.rows;
});
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faqs = yield getAllFaqs();
        res.json(faqs);
    }
    catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.get('/:category', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.params;
        const faqs = yield getFaqsByCategory(category);
        res.json(faqs);
    }
    catch (error) {
        console.error('Error fetching FAQs by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
