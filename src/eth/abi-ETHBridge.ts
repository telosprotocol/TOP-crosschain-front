export default [
  {
    anonymous: false,

    inputs: [
      {
        indexed: true,

        internalType: 'uint64',

        name: 'height',

        type: 'uint64',
      },

      {
        indexed: false,

        internalType: 'bytes32',

        name: 'blockHash',

        type: 'bytes32',
      },
    ],

    name: 'BlockHashAdded',

    type: 'event',
  },

  {
    anonymous: false,

    inputs: [
      {
        indexed: true,

        internalType: 'uint64',

        name: 'height',

        type: 'uint64',
      },

      {
        indexed: false,

        internalType: 'bytes32',

        name: 'blockHash',

        type: 'bytes32',
      },
    ],

    name: 'BlockHashReverted',

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

    name: 'ADDBLOCK_ROLE',

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
    inputs: [],

    name: 'BLACK_BURN_ROLE',

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
    inputs: [],

    name: 'BLACK_MINT_ROLE',

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
    inputs: [],

    name: 'CONTROLLED_ROLE',

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
    inputs: [],

    name: 'OWNER_ROLE',

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
    inputs: [],

    name: 'WITHDRAWAL_ROLE',

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
    inputs: [],

    name: '_initialized',

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

    name: '_initializing',

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
        internalType: 'bytes',

        name: 'data',

        type: 'bytes',
      },
    ],

    name: 'addLightClientBlocks',

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
    inputs: [
      {
        internalType: 'address',

        name: '',

        type: 'address',
      },
    ],

    name: 'balanceOf',

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
        internalType: 'bytes32',

        name: '',

        type: 'bytes32',
      },
    ],

    name: 'blockHashes',

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
        internalType: 'uint64',

        name: '',

        type: 'uint64',
      },
    ],

    name: 'blockHeights',

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
        internalType: 'uint64',

        name: '',

        type: 'uint64',
      },
    ],

    name: 'blockMerkleRoots',

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
    inputs: [],

    name: 'bridgeState',

    outputs: [
      {
        components: [
          {
            internalType: 'uint256',

            name: 'currentHeight',

            type: 'uint256',
          },

          {
            internalType: 'uint256',

            name: 'nextTimestamp',

            type: 'uint256',
          },

          {
            internalType: 'uint256',

            name: 'numBlockProducers',

            type: 'uint256',
          },
        ],

        internalType: 'struct TopBridge.BridgeState',

        name: 'state',

        type: 'tuple',
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
        internalType: 'bytes',

        name: 'data',

        type: 'bytes',
      },
    ],

    name: 'initWithBlock',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',

        name: '_lockEthAmount',

        type: 'uint256',
      },

      {
        internalType: 'address',

        name: '_owner',

        type: 'address',
      },
    ],

    name: 'initialize',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [],

    name: 'initialized',

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

    name: 'lastSubmitter',

    outputs: [
      {
        internalType: 'address',

        name: '',

        type: 'address',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [],

    name: 'lockEthAmount',

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

    name: 'maxMainHeight',

    outputs: [
      {
        internalType: 'uint64',

        name: '',

        type: 'uint64',
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
];
