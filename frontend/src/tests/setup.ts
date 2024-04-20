HTMLDialogElement.prototype.show = jest.fn(function mock(
  this: HTMLDialogElement
) {
  this.open = true;
});

HTMLDialogElement.prototype.showModal = jest.fn(function mock(
  this: HTMLDialogElement
) {
  this.open = true;
});

HTMLDialogElement.prototype.close = jest.fn(function mock(
  this: HTMLDialogElement
) {
  this.open = false;
});

jest.mock('@mysten/dapp-kit', () => {
  const originalModule = jest.requireActual('@mysten/dapp-kit');

  return {
    __esModule: true,
    ...originalModule,
    useAutoConnectWallet: jest.fn(() => ({})),
    useCurrentAccount: jest.fn(() => ({})),
    useCurrentWallet: jest.fn(() => ({})),
  };
});

jest.mock('../hooks/useStableCoinsList', () => {
  const originalModule = jest.requireActual('../hooks/useStableCoinsList');

  return {
    __esModule: true,
    ...originalModule,
    useStableCoinsList: jest.fn(() => ({
      data: {},
      isLoading: true,
    })),
  };
});

jest.mock('../hooks/useHasUserAccessToApp', () => {
  const originalModule = jest.requireActual('../hooks/useHasUserAccessToApp');

  return {
    __esModule: true,
    ...originalModule,
    useHasUserAccessToApp: jest.fn(() => ({
      data: true,
      isPending: false,
      isFetching: false,
      isLoading: false,
    })),
  };
});
