"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedResources = exports.tokenRequest = exports.msalConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Azure AD B2C configuration
exports.msalConfig = {
    auth: {
        clientId: process.env.AZURE_CLIENT_ID || '',
        authority: `https://${process.env.AZURE_TENANT_NAME}.b2clogin.com/${process.env.AZURE_TENANT_NAME}.onmicrosoft.com/${process.env.AZURE_POLICY_NAME}`,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: 3,
        },
    },
};
// Scopes for access token
exports.tokenRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
};
// API endpoints that require authentication
exports.protectedResources = {
    apiEndpoint: {
        endpoint: process.env.API_URL || "http://localhost:3000/api/",
        scopes: [`${process.env.AZURE_CLIENT_ID}/access_as_user`],
    },
};
