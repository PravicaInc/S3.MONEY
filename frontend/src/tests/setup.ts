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

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    useAutoConnectWallet: jest.fn(() => ({})),
    useCurrentAccount: jest.fn(() => ({})),
    useCurrentWallet: jest.fn(() => ({})),
  };
});
