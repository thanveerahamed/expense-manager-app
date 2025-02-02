import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { isAuthenticatedUser } from './common/authentication';
import { bankingApiRouter } from './bankingApi/bankingApi.router';
import { categoryRouter } from './category/category.router';
import { transactionsRouter } from './transactions/transactions.router';
import { logError, logInfo } from './common/logging';
import { labelsRouter } from './labels/labels.router';
import { budgetsRouter } from './budgets/budgets.router';
import { monthsRouter } from './months/months.router';
import { jobsRouter } from './jobs/jobs.router';
import { dashboardRouter } from './dashboard/dashboard.router';
import { labelsOverviewsRouter } from './labelsOverviews/labelsOverviews.router';
import { getEnvironmentVariable } from './common/environment';

const startServer = async (): Promise<void> => {
  if (!getEnvironmentVariable('PORT')) {
    process.exit(1);
    return;
  }

  try {
    const PORT: number = parseInt(getEnvironmentVariable('PORT'), 10);

    const expressApp = express();
    expressApp.use(helmet());
    expressApp.use(cors());
    expressApp.use(express.json());

    expressApp.use('/', async (req, res, next) => {
      const userId = await isAuthenticatedUser(req.headers.authorization);
      if (userId !== undefined) {
        req.body = {
          ...(req.body ? { ...req.body } : {}),
          userId,
        };
        next();
      } else {
        res.status(401).send({
          error: 'Unauthorized',
        });
      }
    });

    expressApp.use('/api/v1/banking', bankingApiRouter);
    expressApp.use('/api/v1/category', categoryRouter);
    expressApp.use('/api/v1/transactions', transactionsRouter);
    expressApp.use('/api/v1/labels', labelsRouter);
    expressApp.use('/api/v1/budgets', budgetsRouter);
    expressApp.use('/api/v1/months', monthsRouter);
    expressApp.use('/api/v1/jobs', jobsRouter);
    expressApp.use('/api/v1/dashboard', dashboardRouter);
    expressApp.use('/api/v1/labelsOverviews', labelsOverviewsRouter);

    expressApp.listen(PORT, () => {
      logInfo(`Listening on port ${PORT}`);
    });
  } catch (error: any) {
    logError('Startup error', { location: 'startup', error });
  }
};

startServer()
  .then(() => {
    logInfo('Server started');
  })
  .catch((error) => {
    logError('Unable to start the server. Reason: ' + error.message);
  });
