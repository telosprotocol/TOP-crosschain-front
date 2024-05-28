export default [
  {
    inputs: [],

    stateMutability: 'nonpayable',

    type: 'constructor',
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
        internalType: 'address',

        name: '_asset',

        type: 'address',
      },

      {
        internalType: 'uint256',

        name: '_frozenDuration',

        type: 'uint256',
      },
    ],

    name: 'bindFrozen',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
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

        name: '_minTransferedToken',

        type: 'uint256',
      },

      {
        internalType: 'uint256',

        name: '_maxTransferedToken',

        type: 'uint256',
      },
    ],

    name: 'bindTransferedQuota',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
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

        name: '_timestamp',

        type: 'uint256',
      },
    ],

    name: 'checkFrozen',

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

        name: '_asset',

        type: 'address',
      },

      {
        internalType: 'uint256',

        name: '_amount',

        type: 'uint256',
      },
    ],

    name: 'checkTransferedQuota',

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

    name: 'forbiddens',

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

        name: '_forbiddenId',

        type: 'bytes32',
      },
    ],

    name: 'forbiden',

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

    name: 'grantRole',

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
    inputs: [
      {
        internalType: 'bytes32',

        name: '_forbiddenId',

        type: 'bytes32',
      },
    ],

    name: 'recover',

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

    name: 'renounceRole',

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

    name: 'revokeRole',

    outputs: [],

    stateMutability: 'nonpayable',

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
        internalType: 'address',

        name: '',

        type: 'address',
      },
    ],

    name: 'tokenFrozens',

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
    inputs: [
      {
        internalType: 'address',

        name: '',

        type: 'address',
      },
    ],

    name: 'tokenQuotas',

    outputs: [
      {
        internalType: 'uint256',

        name: 'maxTransferedToken',

        type: 'uint256',
      },

      {
        internalType: 'uint256',

        name: 'minTransferedToken',

        type: 'uint256',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },
];
