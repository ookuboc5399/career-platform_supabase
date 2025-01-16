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
const createContactMessage = (name, email, message) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('INSERT INTO contact_messages (name, email, message, created_at, status) VALUES ($1, $2, $3, NOW(), $4) RETURNING *', [name, email, message, 'pending']);
    return result.rows[0];
});
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            res.status(400).json({ error: 'Name, email, and message are required' });
            return;
        }
        const contactMessage = yield createContactMessage(name, email, message);
        res.status(201).json({
            message: 'お問い合わせを受け付けました。担当者より連絡させていただきます。',
            data: contactMessage
        });
    }
    catch (error) {
        console.error('Error creating contact message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
