export default [
  {
    inputs: [
      {
        internalType: 'contract ITopProver',

        name: '_prover',

        type: 'address',
      },

      {
        internalType: 'uint64',

        name: '_minBlockAcceptanceHeight',

        type: 'uint64',
      },

      {
        internalType: 'address',

        name: '_owner',

        type: 'address',
      },

      {
        internalType: 'contract ILimit',

        name: 'limit',

        type: 'address',
      },

      {
        internalType: 'address',

        name: '_toAssetHash',

        type: 'address',
      },

      {
        internalType: 'address',

        name: '_peerLockProxyHash',

        type: 'address',
      },
    ],

    name: '_EthLocker_initialize',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',

        name: 'flags',

        type: 'uint256',
      },
    ],

    name: 'adminPause',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    anonymous: false,

    inputs: [
      {
        indexed: false,

        internalType: 'address',

        name: 'fromAssetHash',

        type: 'address',
      },

      {
        indexed: false,

        internalType: 'address',

        name: 'toAssetHash',

        type: 'address',
      },

      {
        indexed: false,

        internalType: 'address',

        name: 'peerLockProxyHash',

        type: 'address',
      },
    ],

    name: 'BindAsset',

    type: 'event',
  },

  {
    inputs: [
      {
        internalType: 'address',

        name: '_asset',

        type: 'address',
      },

      {
        internalType: 'uint256',

        name: '_withdrawQuota',

        type: 'uint256',
      },
    ],

    name: 'bindWithdrawQuota',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'bytes32',

        name: 'role',

        type: 'bytes32',
      },

      {
        internalType: 'address',

        name: 'account',

        type: 'address',
      },
    ],

    name: 'grantRole',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    anonymous: false,

    inputs: [
      {
        indexed: false,

        internalType: 'uint8',

        name: 'version',

        type: 'uint8',
      },
    ],

    name: 'Initialized',

    type: 'event',
  },

  {
    anonymous: false,

    inputs: [
      {
        indexed: true,

        internalType: 'address',

        name: 'fromToken',

        type: 'address',
      },

      {
        indexed: true,

        internalType: 'address',

        name: 'toToken',

        type: 'address',
      },

      {
        indexed: true,

        internalType: 'address',

        name: 'sender',

        type: 'address',
      },

      {
        indexed: false,

        internalType: 'uint256',

        name: 'amount',

        type: 'uint256',
      },

      {
        indexed: false,

        internalType: 'address',

        name: 'receiver',

        type: 'address',
      },

      {
        indexed: false,

        internalType: 'uint8',

        name: 'decimals',

        type: 'uint8',
      },
    ],

    name: 'Locked',

    type: 'event',
  },

  {
    inputs: [
      {
        internalType: 'address',

        name: 'fromAssetHash',

        type: 'address',
      },

      {
        internalType: 'uint256',

        name: 'amount',

        type: 'uint256',
      },

      {
        internalType: 'address',

        name: 'receiver',

        type: 'address',
      },
    ],

    name: 'lockToken',

    outputs: [],

    stateMutability: 'payable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'bytes32',

        name: 'role',

        type: 'bytes32',
      },

      {
        internalType: 'address',

        name: 'account',

        type: 'address',
      },
    ],

    name: 'revokeRole',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    anonymous: false,

    inputs: [
      {
        indexed: true,

        internalType: 'bytes32',

        name: 'role',

        type: 'bytes32',
      },

      {
        indexed: true,

        internalType: 'bytes32',

        name: 'previousAdminRole',

        type: 'bytes32',
      },

      {
        indexed: true,

        internalType: 'bytes32',

        name: 'newAdminRole',

        type: 'bytes32',
      },
    ],

    name: 'RoleAdminChanged',

    type: 'event',
  },

  {
    anonymous: false,

    inputs: [
      {
        indexed: true,

        internalType: 'bytes32',

        name: 'role',

        type: 'bytes32',
      },

      {
        indexed: true,

        internalType: 'address',

        name: 'account',

        type: 'address',
      },

      {
        indexed: true,

        internalType: 'address',

        name: 'sender',

        type: 'address',
      },
    ],

    name: 'RoleGranted',

    type: 'event',
  },

  {
    anonymous: false,

    inputs: [
      {
        indexed: true,

        internalType: 'bytes32',

        name: 'role',

        type: 'bytes32',
      },

      {
        indexed: true,

        internalType: 'address',

        name: 'account',

        type: 'address',
      },

      {
        indexed: true,

        internalType: 'address',

        name: 'sender',

        type: 'address',
      },
    ],

    name: 'RoleRevoked',

    type: 'event',
  },

  {
    anonymous: false,

    inputs: [
      {
        indexed: false,

        internalType: 'bytes32',

        name: 'proofIndex',

        type: 'bytes32',
      },

      {
        indexed: false,

        internalType: 'uint256',

        name: 'amount',

        type: 'uint256',
      },

      {
        indexed: false,

        internalType: 'address',

        name: 'recipient',

        type: 'address',
      },
    ],

    name: 'Unlocked',

    type: 'event',
  },

  {
    inputs: [
      {
        internalType: 'bytes',

        name: 'proofData',

        type: 'bytes',
      },

      {
        internalType: 'uint64',

        name: 'proofBlockHeight',

        type: 'uint64',
      },
    ],

    name: 'unlockToken',

    outputs: [],

    stateMutability: 'payable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'address',

        name: '',

        type: 'address',
      },
    ],

    name: 'assets',

    outputs: [
      {
        internalType: 'address',

        name: 'assetHash',

        type: 'address',
      },

      {
        internalType: 'address',

        name: 'lockProxyHash',

        type: 'address',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [],

    name: 'DEFAULT_ADMIN_ROLE',

    outputs: [
      {
        internalType: 'bytes32',

        name: '',

        type: 'bytes32',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'bytes32',

        name: 'role',

        type: 'bytes32',
      },
    ],

    name: 'getRoleAdmin',

    outputs: [
      {
        internalType: 'bytes32',

        name: '',

        type: 'bytes32',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'bytes32',

        name: 'role',

        type: 'bytes32',
      },

      {
        internalType: 'address',

        name: 'account',

        type: 'address',
      },
    ],

    name: 'hasRole',

    outputs: [
      {
        internalType: 'bool',

        name: '',

        type: 'bool',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [],

    name: 'limit',

    outputs: [
      {
        internalType: 'contract ILimit',

        name: '',

        type: 'address',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [],

    name: 'paused',

    outputs: [
      {
        internalType: 'uint256',

        name: '',

        type: 'uint256',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [],

    name: 'prover',

    outputs: [
      {
        internalType: 'contract ITopProver',

        name: '',

        type: 'address',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'bytes32',

        name: 'role',

        type: 'bytes32',
      },

      {
        internalType: 'address',

        name: 'account',

        type: 'address',
      },
    ],

    name: 'renounceRole',

    outputs: [],

    stateMutability: 'pure',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'bytes4',

        name: 'interfaceId',

        type: 'bytes4',
      },
    ],

    name: 'supportsInterface',

    outputs: [
      {
        internalType: 'bool',

        name: '',

        type: 'bool',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'bytes32',

        name: '',

        type: 'bytes32',
      },
    ],

    name: 'usedProofs',

    outputs: [
      {
        internalType: 'bool',

        name: '',

        type: 'bool',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'address',

        name: '',

        type: 'address',
      },
    ],

    name: 'withdrawHistories',

    outputs: [
      {
        internalType: 'uint256',

        name: 'time',

        type: 'uint256',
      },

      {
        internalType: 'uint256',

        name: 'accumulativeAmount',

        type: 'uint256',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'address',

        name: '',

        type: 'address',
      },
    ],

    name: 'withdrawQuotas',

    outputs: [
      {
        internalType: 'uint256',

        name: '',

        type: 'uint256',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },
];
