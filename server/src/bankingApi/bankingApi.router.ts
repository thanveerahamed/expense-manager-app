import { Request, Response, Router } from 'express';
import {
  attemptRequisition,
  attemptRequisitionSuccess,
  createRequisition,
  getAccessToken,
  getBalances,
  getTransactions,
  updateRequisitionFailedStatus,
} from './bankingApi.service';
import { Transaction } from '../common/thirdParty/nordigen/types';
import { logError, logInfo } from '../common/logging';
import { getInstitutions } from '../common/thirdParty/nordigen/endpoints';
import { AxiosError } from 'axios';

export const bankingApiRouter = Router();

bankingApiRouter.get('/token', async (req: Request, res: Response) => {
  try {
    const accessToken = await getAccessToken();
    res.status(200).send(accessToken);
  } catch (e) {
    res.status(500).send(e);
  }
});

bankingApiRouter.post('/transactions', async (req: Request, res: Response) => {
  logInfo('Received call to transaction.', { payload: req.body });
  try {
    const transactions: Transaction[] = await getTransactions(
      req.body.accountId,
    );
    res.status(200).send(transactions);
  } catch (error: any) {
    logError(error);

    if (error instanceof AxiosError) {
      res.status(error.response?.status || 500).send(error.response?.data);
      return;
    }

    res.status(500).send({ error: JSON.stringify(error) });
  }
});

bankingApiRouter.post('/balances', async (req: Request, res: Response) => {
  try {
    const balances = await getBalances(req.body.accountId);
    res.status(200).send(balances);
  } catch (error: any) {
    logError(error);
    if (error.response?.data !== undefined) {
      res.status(error.response.data.status_code).send(error.response.data);
    } else {
      res.status(500).send(error);
    }
  }
});

bankingApiRouter.get(
  '/institutions/:countryCode',
  async (req: Request, res: Response) => {
    try {
      const institutions = await getInstitutions(req.params.countryCode);
      res.status(200).send(institutions);
    } catch (error: any) {
      logError(error);
      if (error.response?.data !== undefined) {
        res.status(error.response.data.status_code).send(error.response.data);
      } else {
        res.status(500).send(error);
      }
    }
  },
);

bankingApiRouter.post('/requisition', async (req: Request, res: Response) => {
  try {
    const { institution, redirectUrl, userId } = req.body;
    const requisition = await createRequisition(
      institution,
      redirectUrl,
      userId,
    );
    res.status(200).send(requisition);
  } catch (error: any) {
    logError(error);
    if (error.response?.data !== undefined) {
      res.status(error.response.data.status_code).send(error.response.data);
    } else {
      res.status(500).send(error);
    }
  }
});

bankingApiRouter.post(
  '/requisition/update/status',
  async (req: Request, res: Response) => {
    try {
      const { failed, userId } = req.body;
      await updateRequisitionFailedStatus(userId, failed);
      res.status(200).send({ success: true });
    } catch (error: any) {
      logError(error);
      res.status(500).send(error);
    }
  },
);

bankingApiRouter.post(
  '/requisition/attempt',
  async (req: Request, res: Response) => {
    try {
      const { redirectUrl, userId } = req.body;
      const data = await attemptRequisition({ redirectUrl, userId });
      res.status(200).send(data);
    } catch (error: any) {
      logError(error);
      res.status(500).send(error);
    }
  },
);

bankingApiRouter.post(
  '/requisition/attempt-success',
  async (req: Request, res: Response) => {
    try {
      const { reference, userId } = req.body;
      await attemptRequisitionSuccess({ userId, reference });
      res.status(200).send({ success: true });
    } catch (error: any) {
      logError(error);
      res.status(500).send(error);
    }
  },
);
