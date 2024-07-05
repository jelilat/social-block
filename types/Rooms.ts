export enum RoomType {
  LOBBY = 'lobby',
  PUBLIC = 'skyoffice',
  CUSTOM = 'custom',
  VIRUS_GAME = 'virus_game',
}

export interface IRoomData {
  name: string
  description: string
  creator: string // address
  password: string | null
  autoDispose: boolean
  tokenGating?: {
    contractAddress: string
    minimumAmount: number
    tokenType?: 'native' | 'erc20' | 'erc721' | 'erc1155'
    // chain: 'Ethereum' | 'BinanceSmartChain' | 'Polygon' | string; // Using Base for now
  }
  isPrivate: boolean
  entryFee?: {
    amount: number
    // currency?: 'ETH' | 'BNB' | 'MATIC' | string;
  }
  maxPlayers?: number
}
