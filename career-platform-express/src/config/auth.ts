import { Configuration } from '@azure/msal-node';
import dotenv from 'dotenv';

dotenv.config();

// Azure AD B2C configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID || '',
    authority: `https://${process.env.AZURE_TENANT_NAME}.b2clogin.com/${process.env.AZURE_TENANT_NAME}.onmicrosoft.com/${process.env.AZURE_POLICY_NAME}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel: any, message: any) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: 3,
    },
  },
};

// Scopes for access token
export const tokenRequest = {
  scopes: ["https://graph.microsoft.com/.default"],
};

// API endpoints that require authentication
export const protectedResources = {
  apiEndpoint: {
    endpoint: process.env.API_URL || "http://localhost:3000/api/",
    scopes: [`${process.env.AZURE_CLIENT_ID}/access_as_user`],
  },
};
