/**
 * @file Handlers related to wallet relationships.
 */

import {Request, Response} from 'express'
import * as Checks from './lib/checks'
import * as dbRelations from './lib/db/relations'
import * as IFace from './lib/interfaces'

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
