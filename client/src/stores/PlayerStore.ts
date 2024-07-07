import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Role } from '../../../types/IOfficeState'

interface PlayerState {
  role: Role
  partnerName: string
  isInfected: boolean
  playerNames: string[]
}

const initialState: PlayerState = {
  role: Role.Civilian,
  partnerName: '',
  isInfected: false,
  playerNames: [],
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload
    },
    setPartnerName: (state, action: PayloadAction<string>) => {
      state.partnerName = action.payload
    },
    setIsInfected: (state, action: PayloadAction<boolean>) => {
      state.isInfected = action.payload
    },
    setPlayerNames: (state, action: PayloadAction<string[]>) => {
      state.playerNames = action.payload
    },
    addPlayerName: (state, action: PayloadAction<string>) => {
      state.playerNames.push(action.payload)
    },
  },
})

export const { setRole, setPartnerName, setIsInfected, setPlayerNames, addPlayerName } =
  playerSlice.actions
export default playerSlice.reducer
