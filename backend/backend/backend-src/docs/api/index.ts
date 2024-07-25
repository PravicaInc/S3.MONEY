import deprecatedGetEventByAddress from './events/deprecated-get-address-event';
import deprecatedGetAllocation from './events/deprecated-get-allocation';
import deprecatedGetBalance from './events/deprecated-get-balance';
import deprecatedGetEvent from './events/deprecated-get-package-event';
import getAddressEvent from './events/get-address-event';
import getAllocation from './events/get-allocation';
import getBalance from './events/get-balance';
import getPackageEvent from './events/get-package-event';
import heartbeat from './enviroment/heartbeat';
import deprecatedGetHoldings from './holdings/deprecated-get-holdings';
import getHoldings from './holdings/get-holdings';
import cancelPackage from './package/cancel-package';
import createPackage from './package/create-package';
import deprecatedCancelPackage from './package/deprecated-cancel-package';
import deprecatedCreatePackage from './package/deprecated-create-package';
import deprecatedGenerateIcon from './package/deprecated-generate-icon';
import deprecatedGetFilteredPackages from './package/deprecated-get-filtered-packages';
import deprecatedGetPackage from './package/deprecated-get-package';
import deprecatedPublishPackage from './package/deprecated-publish-package';
import generateIcon from './package/generate-icon';
import getFilteredPackages from './package/get-filtered-packages';
import getPackage from './package/get-package';
import publishPackage from './package/publish-package';
import createRelation from './relations/create-relation';
import deprecatedCreateRelation from './relations/deprecated-create-relation';
import deprecatedGetRelations from './relations/deprecated-get-relations';
import deprecatedRenameRelations from './relations/deprecated-rename-relations';
import getRelations from './relations/get-relations';
import renameRelations from './relations/rename-relations';
import deprecatedGetTxVol from './txVol/deprecated-get-tx-vol';
import getTxVol from './txVol/get-tx-vol';
import getNonce from './users/get-nonce';
import authenticate from './users/authenticate';

export default module.exports = {
  paths: {
    '/t/env': {
      ...heartbeat,
    },
    '/v2/packages/create': {
      ...createPackage,
    },
    '/v2/packages/cancel': {
      ...cancelPackage,
    },
    '/v2/packages/published': {
      ...publishPackage,
    },
    '/v2/packages/generateIconURL': {
      ...generateIcon,
    },
    '/v2/packages/{address}': {
      ...getPackage,
    },
    '/v2/packages/{address}/{param}': {
      ...getFilteredPackages,
    },
    '/create': {
      ...deprecatedCreatePackage,
    },
    '/cancel': {
      ...deprecatedCancelPackage,
    },
    '/published': {
      ...deprecatedPublishPackage,
    },
    '/generateIconURL': {
      ...deprecatedGenerateIcon,
    },

    '/v2/related/{pkgAddress}': {
      ...getRelations,
      ...createRelation,
    },
    '/v2/related/{pkgAddress}/{slug}': {
      ...renameRelations,
    },
    '/v2/events/package/{address}/{ticker}': {
      ...getPackageEvent,
    },
    '/v2/events/address/{address}': {
      ...getAddressEvent,
    },
    '/v2/events/balances/{address}': {
      ...getBalance,
    },
    '/v2/events/allocations/{address}/{ticker}': {
      ...getAllocation,
    },
    '/v2/txvol/{address}/{ticker}': {
      ...getTxVol,
    },
    '/v2/holdings/{address}/{ticker}': {
      ...getHoldings,
    },
    '/packages/{address}/{param}': {
      ...deprecatedGetFilteredPackages,
    },
    '/packages/{address}': {
      ...deprecatedGetPackage,
    },
    '/related/{pkgAddress}': {
      ...deprecatedGetRelations,
      ...deprecatedCreateRelation,
    },
    '/related/{pkgAddress}/{slug}': {
      ...deprecatedRenameRelations,
    },
    '/package-events/{address}/{ticker}': {
      ...deprecatedGetEvent,
    },
    '/address-events/{address}': {
      ...deprecatedGetEventByAddress,
    },
    '/balances/{address}': {
      ...deprecatedGetBalance,
    },
    '/allocations/{address}/{ticker}': {
      ...deprecatedGetAllocation,
    },
    '/txvol/{address}/{ticker}': {
      ...deprecatedGetTxVol,
    },
    '/holdings/{address}/{ticker}': {
      ...deprecatedGetHoldings,
    },
    '/v2/users/getNonce/{address}': {
      ...getNonce,
    },
    '/v2/users/authenticate': {
      ...authenticate,
    },
  },
};
