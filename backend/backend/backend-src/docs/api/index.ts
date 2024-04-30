import heartbeat from './enviroment/heartbeat'
import getAllocation from './events/get-allocation'
import getBalance from './events/get-balance'
import getEvent from './events/get-event'
import getEventByAddress from './events/get-event-by-address'
import getHoldings from './holdings/get-holdings'
import cancelPackage from './package/cancel-package'
import createPackage from './package/create-package'
import generateIcon from './package/generate-icon'
import getFilteredPackages from './package/get-filtered-packages'
import getPackage from './package/get-package'
import publishPackage from './package/publish-package'
import createRelation from './relations/create-relation'
import getRelations from './relations/get-relations'
import renameRelations from './relations/rename-relations'
import getTxVol from './txVol/get-tx-vol'

export default module.exports = {
  paths: {
    '/t/env': {
      ...heartbeat,
    },
    '/v2/package/create': {
      ...createPackage,
    },
    '/v2/package/cancel': {
      ...cancelPackage,
    },
    '/v2/package/published': {
      ...publishPackage,
    },
    '/v2/package/generateIconURL': {
      ...generateIcon,
    },
    '/v2/package/:address': {
      ...getPackage,
    },
    '/v2/package/:address/:param': {
      ...getFilteredPackages,
    },
    '/v2/related/:pkgAddress': {
      ...getRelations,
      ...createRelation,
    },
    '/v2/:pkgAddress/:slug': {
      ...renameRelations,
    },
    '/:pkgAddress/:slug': {
      ...renameRelations,
    },
    '/v2/events/:address/:ticker': {
      ...getEvent,
    },
    '/v2/events/:address': {
      ...getEventByAddress,
    },
    '/v2/events/balances/:address': {
      ...getBalance,
    },
    '/v2/events/allocations/:address/:ticker': {
      ...getAllocation,
    },
    '/v2/txvol/:address/:ticker': {
      ...getTxVol,
    },
    '/v2/holdings/:address/:ticker': {
      ...getHoldings,
    },
  },
}
