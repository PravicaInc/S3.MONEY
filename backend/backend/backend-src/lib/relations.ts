/**
 * @file Handlers related to wallet relationships.
 */

import {Request, Response, Router} from 'express'
import * as Checks from './checks'
import * as dbRelations from './db/relations'
import * as IFace from './interfaces'

export function createRelationsRouter(): Router {
  const router = Router()

  router.get('/:pkgAddress', async (req, res, next) => {
    try {
      await handleGetRelations(req, res)
    } catch (error) {
      next(error)
    }
  })
  router.post('/:pkgAddress', async (req, res, next) => {
    try {
      await handleCreateRelation(req, res)
    } catch (error) {
      next(error)
    }
  })
  // implemented, but not part of the current deliverable
  // router.delete('/related/:pkgAddress/:slug', handleDeleteRelation)
  router.patch('/:pkgAddress/:slug', async (req, res, next) => {
    try {
      await handleRenameRelation(req, res)
    } catch (error) {
      next(error)
    }
  })

  return router
}

/**
 * Handler that returns a list of relations for a package.
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function handleGetRelations(req: Request, res: Response) {
  const {pkgAddress} = req.params
  if (Checks.isValidPackage(pkgAddress)) {
    res.status(200).json({
      status: 'ok',
      related: await dbRelations.getRelations(pkgAddress),
    })
  } else {
    res.status(400).json({
      status: 'error',
      message: `invalid package address: ${pkgAddress}`,
    })
  }
}

/**
 * Handler that creates a relation against a package.
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function handleCreateRelation(req: Request, res: Response) {
  const {pkgAddress} = req.params
  const v = await Checks.validRelatedCreate(req.body)
  if (Checks.isValidPackage(pkgAddress) && v.error === '') {
    const ret = await dbRelations.createRelation(pkgAddress, v.data as IFace.IRelationCreate)
    if (ret !== undefined && 'error' in ret) {
      res.status(400).json({
        status: 'error',
        message: ret.error,
      })
    } else {
      res.status(200).json({
        status: 'ok',
      })
    }
  } else if (v.error != '') {
    res.status(400).json({
      status: 'error',
      message: v.error,
    })
  } else {
    res.status(400).json({
      status: 'error',
      message: `invalid address: ${pkgAddress}`,
    })
  }
}

/**
 * Handler that deletes a relation on a package.
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function handleDeleteRelation(req: Request, res: Response) {
  const {pkgAddress, slug} = req.params
  if (Checks.isValidPackage(pkgAddress) && slug.trim() != '') {
    await dbRelations.deleteRelation(pkgAddress, slug)
    res.status(200).json({
      status: 'ok',
    })
  } else {
    res.status(400).json({
      status: 'error',
      message: `invalid address: ${pkgAddress}`,
    })
  }
}

/**
 * Handler that renames a relation on a package.
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function handleRenameRelation(req: Request, res: Response) {
  const {pkgAddress, slug} = req.params
  const v = await Checks.validRelatedModify(req.body)
  if (Checks.isValidPackage(pkgAddress) && v.error === '') {
    const ret = await dbRelations.renameRelation(pkgAddress, slug, v.data as IFace.IRelationRename)
    if (ret !== undefined && 'error' in ret) {
      res.status(400).json({
        status: 'error',
        message: ret.error,
      })
    } else {
      res.status(200).json({
        status: 'ok',
      })
    }
  } else if (v.error != '') {
    res.status(400).json({
      status: 'error',
      message: v.error,
    })
  } else {
    res.status(400).json({
      status: 'error',
      message: `invalid address: ${pkgAddress}`,
    })
  }
}

// eof
