require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { buildUserModelWithValidation } = require('./userModel');

function loadEnvironmentConfiguration() {
  const mandatoryVariables = ['MONGODB_URI'];
  const missingVariables = mandatoryVariables.filter(
    (variableName) => !process.env[variableName]
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing environment variables: ${missingVariables.join(', ')}`
    );
  }
}

async function initializeDatabaseConnection() {
  const mongoUri = process.env.MONGODB_URI;

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri);

  console.log('✅ Connected to MongoDB Atlas');
}

function constructExpressApplication() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  return app;
}

function registerUserCreationRoute(app, UserModel) {
  app.post('/users', async (req, res) => {
    try {
      const incomingPayload = req.body;

      const userDocument = new UserModel(incomingPayload);
      const storedUser = await userDocument.save();

      return res.status(201).json({
        message: 'User created successfully',
        user: storedUser
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationIssues = {};

        Object.keys(error.errors).forEach((fieldName) => {
          validationIssues[fieldName] = error.errors[fieldName].message;
        });

        return res.status(400).json({
          message: 'User validation failed',
          errors: validationIssues
        });
      }

      if (error.code === 11000) {
        return res.status(400).json({
          message: 'User validation failed',
          errors: {
            email: 'Email address must be unique'
          }
        });
      }

      console.error('Unexpected error while creating user:', error);

      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  });
}

function registerHealthCheckRoute(app) {
  app.get('/', (_req, res) => {
    res.json({
      message: 'COMP3133 Lab04 Users API is running'
    });
  });
}

function startHttpServer(app) {
  const port = process.env.PORT || 8081;

  app.listen(port, () => {
    console.log(`🚀 Server is listening on http://localhost:${port}`);
  });
}

async function bootstrapLab4UsersApi() {
  try {
    loadEnvironmentConfiguration();
    await initializeDatabaseConnection();

    const UserModel = buildUserModelWithValidation();

    const app = constructExpressApplication();

    registerHealthCheckRoute(app);
    registerUserCreationRoute(app, UserModel);

    startHttpServer(app);
  } catch (error) {
    console.error('Failed to start Lab04 Users API:', error);
    process.exit(1);
  }
}

bootstrapLab4UsersApi();

