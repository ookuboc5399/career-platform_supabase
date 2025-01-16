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
const router = express_1.default.Router();
const database_1 = __importDefault(require("../config/database"));
const getAllPostsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
    return result.rows;
});
const getPostByIdFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
    return result.rows[0];
});
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield getAllPostsFromDb();
        res.json(posts);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = parseInt(req.params.id || '');
        if (isNaN(postId)) {
            res.status(400).json({ error: 'Invalid ID format' });
            return;
        }
        const post = yield getPostByIdFromDb(postId);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.json(post);
    }
    catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/', getAllPosts);
router.get('/:id', getPostById);
exports.default = router;
