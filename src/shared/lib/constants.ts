import { Token } from '@src/pages/types';
import tokens from '@assets/tokens.json';

export const TOKEN_LIST = tokens as Token[];

export const PROGRAMS = [
  {
    programId: '11111111111111111111111111111111',
    name: 'System Program',
  },
  {
    programId: 'Config1111111111111111111111111111111111111',
    name: 'Config Program',
  },
  {
    programId: 'Stake11111111111111111111111111111111111111',
    name: 'Stake Program',
  },
  {
    programId: 'Vote111111111111111111111111111111111111111',
    name: 'Vote Program',
  },
  {
    programId: 'AddressLookupTab1e1111111111111111111111111',
    name: 'Address Lookup Table Program',
  },
  {
    programId: 'BPFLoaderUpgradeab1e11111111111111111111111',
    name: 'BPF Loader Program',
  },
  {
    programId: 'Ed25519SigVerify111111111111111111111111111',
    name: 'ED25519 Program',
  },
  {
    programId: 'ComputeBudget111111111111111111111111111111',
    name: 'Compute Budget Program',
  },
  {
    programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    name: 'Token Program',
  },
  {
    programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    name: 'Token Program',
  },
  {
    programId: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
    name: 'Token2022 Program',
  },
  {
    programId: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    name: 'Associated Token Program',
  },
  {
    programId: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
    name: 'Token Metadata Program',
  },
  {
    programId: 'cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK',
    name: 'Bubblegum Program',
  },
  {
    programId: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
    name: 'Jupiter Aggregator v6',
  },
];

export const ENV = {
  SOLANA_RPC: import.meta.env.VITE_SOLANA_RPC,
  OPEN_ROUTER_API_KEY: import.meta.env.VITE_OPEN_ROUTER_API_KEY,
};
