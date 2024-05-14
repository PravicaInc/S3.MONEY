/**
 * @file Handlers related to wallet relationships.
 */

import { Router } from 'express';

import { handleCreateRelation, handleGetRelations, handleRenameRelation } from '../lib';

export function createRelationsRouter(): Router {
  const router = Router();

  router.get('/:pkgAddress', async (req, res, next) => {
    try {
      await handleGetRelations(req, res);
    }
    catch (error) {
      next(error);
    }
  });
  router.post('/:pkgAddress', async (req, res, next) => {
    try {
      await handleCreateRelation(req, res);
    }
    catch (error) {
      next(error);
    }
  });
  // implemented, but not part of the current deliverable
  // router.delete('/related/:pkgAddress/:slug', handleDeleteRelation)
  router.patch('/:pkgAddress/:slug', async (req, res, next) => {
    try {
      await handleRenameRelation(req, res);
    }
    catch (error) {
      next(error);
    }
  });

  return router;
}
