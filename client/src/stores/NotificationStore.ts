import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Role } from '../../../types/IOfficeState'

interface NotificationState {
  message: string | null
  round: number
  winner: string | null
}

const initialState: NotificationState = {
  message: null,
  round: 0,
  winner: null,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setRound: (
      state,
      action: PayloadAction<{
        round: string
        deadPlayers: Map<string, Role | undefined>
        infectedPlayers: string[]
      }>
    ) => {
      let gameStartMesage = ''
      let gameState = ''
      if (action.payload.round === '1') {
        gameStartMesage = 'Game Started\n'
      } else {
        gameState = `\n\nDead Players:\n ${Array.from(action.payload.deadPlayers.entries())
          .map(([name, role]) => `${name} - ${role}`)
          .join('\n')} \n\nInfected Players:\n ${action.payload.infectedPlayers.join('\n')} `
      }
      state.message = `${gameStartMesage}Round ${action.payload.round}${gameState}`
      state.round = parseInt(action.payload.round)
    },
    setWinner: (state, action: PayloadAction<string | null>) => {
      state.winner = action.payload
    },
    setNotification: (state, action: PayloadAction<string | null>) => {
      state.message = action.payload
    },
    clearNotification: (state) => {
      state.message = null
    },
  },
})

export const { setRound, setNotification, clearNotification, setWinner } = notificationSlice.actions
export default notificationSlice.reducer
