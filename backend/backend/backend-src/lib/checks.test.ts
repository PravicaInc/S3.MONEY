import * as packageOps from '../db/packages';
import * as IFace from '../interfaces';
import { IRelationCreate, PackageRoles, PackageStatus } from '../interfaces';
import { S3MoneyError } from '../interfaces/error';

import {
  isValidTicker,
  validCancel,
  validCreate,
  validIconRequest,
  validPublish,
  validRelatedCreate,
  validRelatedDelete,
  validRelatedModify,
} from './checks';

jest.mock('../db/packages', () => ({
  getPackage: jest.fn(),
}));

describe('validCreate function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test case for a valid input
  it('should return no error for valid input', async () => {
    // Mock the return value of getPackage function
    (packageOps.getPackage as jest.Mock).mockResolvedValueOnce({
      deploy_status: PackageStatus.CREATED,
    });

    const validInput: IFace.ContractCreate = {
      ticker: '$TC',
      network: 'mainnet',
      name: 'Test Stablecoin',
      decimals: 8,
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      initialSupply: '1000',
      maxSupply: '1000000',
      roles: {
        [PackageRoles.MINT]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.BURN]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.FREEZE]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.PAUSE]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_IN]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_OUT]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      },
      packageName: 'test-package',
      description: 'Test description',
      icon_url: 'https://example.com/icon.png',
    };

    const result = await validCreate(validInput);

    expect(result.error).toBe('');
    expect(result.data).toEqual(validInput);
  });

  // Test case for missing address
  it('should return an error for missing address', async () => {
    const testData: Partial<IFace.ContractCreate> = {
      ticker: '$TC',
      name: 'Test Stablecoin',
      decimals: 7,
      initialSupply: '1000',
      maxSupply: '1000000',
      roles: {
        [PackageRoles.MINT]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.BURN]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.FREEZE]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.PAUSE]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_IN]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_OUT]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      },
      packageName: 'test-package',
      description: 'Test description',
      icon_url: 'https://example.com/icon.png',
    };

    try {
      await validCreate(testData as IFace.ContractCreate);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toBe('missing field: address');
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  // Test case for invalid role address
  it('should return an error for invalid role address', async () => {
    // Mock the return value of getPackage function
    (packageOps.getPackage as jest.Mock).mockResolvedValueOnce({
      deploy_status: PackageStatus.CREATED,
    });

    const testData: Partial<IFace.ContractCreate> = {
      ticker: '$TC',
      name: 'Test Stablecoin',
      decimals: 7,
      initialSupply: '1000',
      maxSupply: '1000000',
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      roles: {
        [PackageRoles.MINT]: '0x1234567890123456789012345678901234567890',
        [PackageRoles.BURN]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.FREEZE]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.PAUSE]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_IN]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_OUT]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      },
      packageName: 'test-package',
      description: 'Test description',
      icon_url: 'https://example.com/icon.png',
    };

    try {
      await validCreate(testData as IFace.ContractCreate);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toBe(
        'invalid role address: 0x1234567890123456789012345678901234567890'
      );
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  // Test case for invalid ticker
  it('should return an error for invalid ticker', async () => {
    const testData: Partial<IFace.ContractCreate> = {
      ticker: 'TC',
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      name: 'Test Stablecoin',
      decimals: 7,
      initialSupply: '1000',
      maxSupply: '1000000',
      roles: {
        [PackageRoles.MINT]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.BURN]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.FREEZE]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.PAUSE]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_IN]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_OUT]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      },
      packageName: 'test-package',
      description: 'Test description',
      icon_url: 'https://example.com/icon.png',
    };

    try {
      await validCreate(testData as IFace.ContractCreate);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toBe(
        'ticker must start with $: TC'
      );
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  // Test case for already published package
  it('should return an error when package is already published', async () => {
    // Mock the return value of getPackage function
    (packageOps.getPackage as jest.Mock).mockResolvedValueOnce({
      deploy_status: PackageStatus.PUBLISHED,
    });

    const testData: Partial<IFace.ContractCreate> = {
      ticker: '$TC',
      name: 'Test Stablecoin',
      decimals: 7,
      initialSupply: '1000',
      maxSupply: '1000000',
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      roles: {
        [PackageRoles.MINT]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.BURN]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.FREEZE]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.PAUSE]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_IN]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_OUT]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      },
      packageName: 'test-package',
      description: 'Test description',
      icon_url: 'https://example.com/icon.png',
    };

    try {
      await validCreate(testData as IFace.ContractCreate);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toBe(
        'package already published: 0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e/tc'
      );
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  //Test case for mismatching mint and burn addresses
  it('should return an error when mint and burn address are not same  ', async () => {
    (packageOps.getPackage as jest.Mock).mockResolvedValueOnce({
      deploy_status: PackageStatus.CREATED,
    });

    const testData: Partial<IFace.ContractCreate> = {
      ticker: '$TC',
      name: 'Test Stablecoin',
      decimals: 7,
      initialSupply: '1000',
      maxSupply: '1000000',
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      roles: {
        [PackageRoles.MINT]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.BURN]:
          '0x8bd6e484961f4d8cf16f5bdd6da78c7ad0d8739933ae36ca0e75a9d17ef79c73',
        [PackageRoles.FREEZE]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.PAUSE]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_IN]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_OUT]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      },
      packageName: 'test-package',
      description: 'Test description',
      icon_url: 'https://example.com/icon.png',
    };

    try {
      await validCreate(testData as IFace.ContractCreate);
    } catch (error) {
      const expectedErrorMessage =
        'mint and burn roles must be the same: ' +
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e, ' +
        '0x8bd6e484961f4d8cf16f5bdd6da78c7ad0d8739933ae36ca0e75a9d17ef79c73';

      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toBe(expectedErrorMessage);
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  //Test case for mismatching freeze and pause  addresses
  it('should return an error when freeze and pause  address are not same  ', async () => {
    (packageOps.getPackage as jest.Mock).mockResolvedValueOnce({
      deploy_status: PackageStatus.CREATED,
    });

    const testData: Partial<IFace.ContractCreate> = {
      ticker: '$TC',
      name: 'Test Stablecoin',
      decimals: 7,
      initialSupply: '1000',
      maxSupply: '1000000',
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      roles: {
        [PackageRoles.MINT]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.BURN]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.FREEZE]:
          '0x8bd6e484961f4d8cf16f5bdd6da78c7ad0d8739933ae36ca0e75a9d17ef79c73',
        [PackageRoles.PAUSE]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_IN]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_OUT]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      },
      packageName: 'test-package',
      description: 'Test description',
      icon_url: 'https://example.com/icon.png',
    };

    try {
      await validCreate(testData as IFace.ContractCreate);
    } catch (error) {
      const expectedErrorMessage =
        'freeze and pause roles must be the same:' +
        ' 0x8bd6e484961f4d8cf16f5bdd6da78c7ad0d8739933ae36ca0e75a9d17ef79c73,' +
        ' 0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e';

      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toBe(expectedErrorMessage);
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  // Test case for invalid decimals
  it('should return an error when decimals are incorrect', async () => {
    const testData: Partial<IFace.ContractCreate> = {
      ticker: '$TC',
      name: 'Test Stablecoin',
      decimals: 20,
      initialSupply: '1000',
      maxSupply: '1000000',
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      roles: {
        [PackageRoles.MINT]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.BURN]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.FREEZE]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.PAUSE]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_IN]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
        [PackageRoles.CASH_OUT]:
          '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      },
      packageName: 'test-package',
      description: 'Test description',
      icon_url: 'https://example.com/icon.png',
    };

    try {
      await validCreate(testData as IFace.ContractCreate);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toBe(
        'wrong number of decimals: 20'
      );
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });
});

describe('validCancel function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test case for a valid input
  it('should return no error for valid input', async () => {
    // Mock the return value of getPackage function
    (packageOps.getPackage as jest.Mock).mockResolvedValueOnce({
      deploy_status: PackageStatus.CREATED,
    });

    const validInput: IFace.IPackageCreated = {
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      ticker: '$TC',
      decimals: 8,
      created: false,
      initialSupply: '1000',
      maxSupply: '1000000',
    };

    const result = await validCancel(validInput);

    expect(result.error).toBe('');
    expect(result.data).toEqual(validInput);
  });

  // Test case for missing fields
  it('should return an error for missing fields', async () => {
    const testData: Partial<IFace.IPackageCreated> = {
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      created: false,
      initialSupply: '1000',
      maxSupply: '1000000',
    };

    try {
      await validCancel(testData as IFace.IPackageCreated);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toBe('missing field: ticker');
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  // Test case for invalid address
  it('should return an error for invalid address', async () => {
    const testData: IFace.IPackageCreated = {
      address: '0x1234567890123456789012345678901234567890',
      ticker: '$TC',
      decimals: 8,
      created: false,
      initialSupply: '1000',
      maxSupply: '1000000',
    };

    try {
      await validCancel(testData as IFace.IPackageCreated);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toContain('invalid address');
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  // Test case for incorrect 'created' field
  it('should return an error for incorrect "created" field', async () => {
    const testData: IFace.IPackageCreated = {
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      ticker: '$TC',
      decimals: 8,
      created: true,
      initialSupply: '1000',
      maxSupply: '1000000',
    };

    try {
      await validCancel(testData as IFace.IPackageCreated);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toBe('created should be false');
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  // Test case for attempting to cancel a published package
  it('should return an error for attempting to cancel a published package', async () => {
    // Mock getPackage to return a published package
    (packageOps.getPackage as jest.Mock).mockResolvedValue({
      deploy_status: PackageStatus.PUBLISHED,
    });

    const testData: IFace.IPackageCreated = {
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      ticker: '$TC',
      decimals: 8,
      created: false,
      initialSupply: '1000',
      maxSupply: '1000000',
    };

    try {
      await validCancel(testData as IFace.IPackageCreated);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toContain(
        'package already published'
      );
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });
});

describe('validPublish function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test case for a valid input
  it('should return no error for valid input', async () => {
    // Mock the return value of getPackage function
    (packageOps.getPackage as jest.Mock).mockResolvedValueOnce({
      decimals: 8,
    });

    const validInput: IFace.IPackageCreated = {
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      ticker: '$TC',
      created: true,
      initialSupply: '1000',
      maxSupply: '1000000',
      decimals: 8,
      txid: '9kdu2wsxGzcf9iKU29y9VSqUDLud9n51SmA72Y6obh2j',
      data: {
        digest: '9kdu2wsxGzcf9iKU29y9VSqUDLud9n51SmA72Y6obh2j',
        confirmedLocalExecution: true,
        transaction: {
          data: {
            messageVersion: 'v1',
            sender:
              '0x8bd6e484961f4d8cf16f5bdd6da78c7ad0d8739933ae36ca0e75a9d17ef79c73',
          },
        },
      },
    };

    const result = await validPublish(validInput);

    expect(result.error).toBe('');
    expect(result.data).toEqual(validInput);
  });

  // Test case for missing fields
  it('should return an error for missing fields', async () => {
    const testData: Partial<IFace.IPackageCreated> = {
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      ticker: '$TC',
      txid: '9kdu2wsxGzcf9iKU29y9VSqUDLud9n51SmA72Y6obh2j',
      data: {},
    };

    try {
      await validPublish(testData as IFace.IPackageCreated);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toBe('missing field: created');
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  // Test case for invalid address
  it('should return an error for invalid address', async () => {
    const testData: IFace.IPackageCreated = {
      address: 'invalid-address',
      ticker: '$TC',
      txid: 'txid',
      data: {},
      created: true,
      decimals: 18,
      initialSupply: '1000',
      maxSupply: '1000000',
    };

    try {
      await validPublish(testData as IFace.IPackageCreated);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toContain('invalid address');
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  // Test case for incorrect `created` field'
  it('should return an error for incorrect `created` field', async () => {
    const testData: IFace.IPackageCreated = {
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      ticker: '$TC',
      txid: 'txid',
      data: {},
      created: false,
      decimals: 8,
      initialSupply: '1000',
      maxSupply: '1000000',
    };

    try {
      await validPublish(testData as IFace.IPackageCreated);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toBe('created should be true');
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  // Test case for already published package
  it('should return an error for already published package', async () => {
    (packageOps.getPackage as jest.Mock).mockResolvedValueOnce({
      deploy_status: PackageStatus.PUBLISHED,
    });
    const testData: IFace.IPackageCreated = {
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      ticker: '$TC',
      created: true,
      initialSupply: '1000',
      maxSupply: '1000000',
      decimals: 8,
      txid: '9kdu2wsxGzcf9iKU29y9VSqUDLud9n51SmA72Y6obh2j',
      data: {
        digest: '9kdu2wsxGzcf9iKU29y9VSqUDLud9n51SmA72Y6obh2j',
        confirmedLocalExecution: true,
        transaction: {
          data: {
            messageVersion: 'v1',
            sender:
              '0x8bd6e484961f4d8cf16f5bdd6da78c7ad0d8739933ae36ca0e75a9d17ef79c73',
          },
        },
      },
    };

    try {
      await validPublish(testData as IFace.IPackageCreated);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toBe(
        'package already published: 0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e/tc'
      );
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  // Test case for package not created
  it('should return an error for package not created', async () => {
    // Mock getPackage to return null indicating package not created
    (packageOps.getPackage as jest.Mock).mockResolvedValue(null);

    const testData: IFace.IPackageCreated = {
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      ticker: '$TC',
      created: true,
      initialSupply: '1000',
      maxSupply: '1000000',
      decimals: 8,
      txid: '9kdu2wsxGzcf9iKU29y9VSqUDLud9n51SmA72Y6obh2j',
      data: {
        digest: '9kdu2wsxGzcf9iKU29y9VSqUDLud9n51SmA72Y6obh2j',
        confirmedLocalExecution: true,
        transaction: {
          data: {
            messageVersion: 'v1',
            sender:
              '0x8bd6e484961f4d8cf16f5bdd6da78c7ad0d8739933ae36ca0e75a9d17ef79c73',
          },
        },
      },
    };

    try {
      await validPublish(testData as IFace.IPackageCreated);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toBe(
        'package not created: 0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e/tc'
      );
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });
});

describe('validRelatedCreate function', () => {
  it('should return an error when required fields are missing', async () => {
    const testData: Partial<IRelationCreate> = {
      label: '', // Missing label field
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
    };

    try {
      await validRelatedCreate(testData as IRelationCreate);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toBe('missing field: label');
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  it('should return an error for invalid address', async () => {
    const testData: Partial<IRelationCreate> = {
      label: 'Test Label',
      address: 'invalidAddress',
    };

    try {
      await validRelatedCreate(testData as IRelationCreate);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toContain('invalid address:');
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  it('should return no error when all fields are valid', async () => {
    const testData: Partial<IRelationCreate> = {
      label: 'Test Label',
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
    };

    const result = await validRelatedCreate(testData as IRelationCreate);

    expect(result.error).toBe('');
    expect(result.data).toEqual(testData);
  });
});

describe('validRelatedDelete function', () => {
  it('should return an error when label field is missing', async () => {
    const testData: IFace.IRelationDelete = {
      label: '', // Missing label field
    };

    try {
      await validRelatedDelete(testData as IRelationCreate);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toContain('missing field: label');
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  it('should return no error when label field is provided', async () => {
    const testData: Partial<IFace.IRelationDelete> = {
      label: 'Test Label',
    };

    const result = await validRelatedDelete(testData as IFace.IRelationDelete);

    expect(result.error).toBe('');
    expect(result.data).toEqual(testData);
  });
});

describe('validRelatedModify function', () => {
  it('should return an error when label field is missing', async () => {
    const testData: IFace.IRelationRename = {
      label: '', // Missing label field
    };

    try {
      await validRelatedModify(testData as IRelationCreate);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toContain('missing field: label');
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  it('should return no error when label field is provided', async () => {
    const testData: Partial<IFace.IRelationDelete> = {
      label: 'Test Label',
    };

    const result = await validRelatedModify(testData as IFace.IRelationDelete);

    expect(result.error).toBe('');
    expect(result.data).toEqual(testData);
  });
});

describe('validIconRequest function', () => {
  it('should return an error when required fields are missing', () => {
    const testDataMissingAddress: Partial<IFace.IPackageIcon> = {
      // Missing address field
      fileName: 'icon.png',
    };

    const testDataMissingFileName: Partial<IFace.IPackageIcon> = {
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      // Missing fileName field
    };

    try {
      validIconRequest(testDataMissingAddress as IFace.IPackageIcon);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toContain(
        'missing field: address'
      );
      expect((error as S3MoneyError).errorCode).toBe(400);
    }

    try {
      validIconRequest(testDataMissingFileName as IFace.IPackageIcon);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toContain(
        'missing field: fileName'
      );
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  it('should return an error when address field is invalid', () => {
    const testDataInvalidAddress: Partial<IFace.IPackageIcon> = {
      address: 'invalid_address',
      fileName: 'icon.png',
    };

    try {
      validIconRequest(testDataInvalidAddress as IFace.IPackageIcon);
    } catch (error) {
      expect(error instanceof S3MoneyError).toBeTruthy();
      expect((error as S3MoneyError).errorMessage).toBe('Bad Request');
      expect((error as S3MoneyError).details).toContain('invalid address');
      expect((error as S3MoneyError).errorCode).toBe(400);
    }
  });

  it('should return no error when all fields are valid', () => {
    const testDataValid: Partial<IFace.IPackageIcon> = {
      address:
        '0x7b176b89ab5ed899d17b05ffb67b39eeda8aca3e7f41e40353937ed8c943725e',
      fileName: 'icon.png',
    };

    const result = validIconRequest(testDataValid as IFace.IPackageIcon);

    expect(result.error).toBeFalsy();
    expect(result.data).toEqual(testDataValid);
  });
});

describe('isValidTicker function', () => {
  it('should return an error for empty ticker', () => {
    const result = isValidTicker('');

    expect(result).toContain('invalid ticker name');
  });

  it('should return an error for ticker with just $', () => {
    const result = isValidTicker('$');

    expect(result).toContain('invalid ticker name');
  });

  it('should return an error for ticker longer than 6 characters', () => {
    const result = isValidTicker('$TOOLONGTICKER');

    expect(result).toContain('invalid ticker name');
  });

  it('should return an error for ticker not starting with $', () => {
    const result = isValidTicker('BTC');

    expect(result).toContain('ticker must start with $');
  });

  it('should return an error for ticker with special characters', () => {
    const result = isValidTicker('$BTC@');

    expect(result).toContain('ticker must be alphanumeric');
  });

  it('should return an error for reserved ticker names', () => {
    const result = isValidTicker('$COIN');

    expect(result).toContain('ticker name cannot be');
  });

  it('should return no error for valid ticker', () => {
    const result = isValidTicker('$BTC');

    expect(result).toBe('');
  });
});
