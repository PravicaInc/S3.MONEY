/**
 * @file Handlers related to events and balances.
 */

import { Request, Response } from 'express';

import * as dbEvents from '../db/events';
import { ErrorType, invalidAddressErrorDetail, invalidPackageErrorDetail, S3MoneyError } from '../interfaces/error';

import * as Checks from './checks';

export async function handleGetBalances(req: Request, res: Response) {
  const { address } = req.params;

  if (Checks.isValidAddress(address)) {
    res.status(200).json({
      status: 'ok',
      balances: await dbEvents.getBalances(address),
    });
  }
  else {
    throw new S3MoneyError(ErrorType.BadRequest, invalidAddressErrorDetail(address));
  }
}

export async function handleGetAllocations(req: Request, res: Response) {
  const { address, ticker } = req.params;

  if (Checks.isValidPackage(address)) {
    res.status(200).json({
      status: 'ok',
      events: await dbEvents.getAllocations(address, ticker),
    });
  }
  else {
    throw new S3MoneyError(ErrorType.BadRequest, invalidPackageErrorDetail(address));
  }
}

export async function handleGetPackageEvents(req: Request, res: Response) {
  const { address, ticker } = req.params;

  if (Checks.isValidPackage(address)) {
    res.status(200).json({
      status: 'ok',
      events: await dbEvents.getPackageEvents(address, ticker),
    });
  }
  else {
    throw new S3MoneyError(ErrorType.BadRequest, invalidPackageErrorDetail(address));
  }
}

export async function handleGetAddressEvents(req: Request, res: Response) {
  const { address } = req.params;

  if (Checks.isValidAddress(address)) {
    res.status(200).json({
      status: 'ok',
      events: await dbEvents.getAddressEvents(address),
    });
  }
  else {
    throw new S3MoneyError(ErrorType.BadRequest, invalidAddressErrorDetail(address));
  }
}

// eof
