import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks'
import { clearNotification } from '../stores/NotificationStore'
import Modal from './Modal'
import { Role } from '../../../types/IOfficeState'

const NotificationPopUp: React.FC<{ duration?: number }> = ({ duration = 5000 }) => {
  const message = useAppSelector((state) => state.notification.message)
  const round = useAppSelector((state) => state.notification.round)
  const winner = useAppSelector((state) => state.notification.winner)
  const player = useAppSelector((state) => state.player)
  const dispatch = useAppDispatch()
  const [isVisible, setIsVisible] = useState(false)
  const [content, setContent] = useState('')

  useEffect(() => {
    if (message && round > 0) {
      if (round === 1) {
        const role =
          player.role === Role.Terrorist
            ? `You are a Terrorist and your partner is ${player.partnerName}`
            : `You are a ${player.role}`
        setContent(`${message} \n\n${role}`)
      } else if (winner) {
        setContent(`${winner} won the game!`)
      } else {
        setContent(message)
      }
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        dispatch(clearNotification())
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [message, duration, round, dispatch, winner])

  return isVisible && message ? (
    <Modal content={content} onClose={() => setIsVisible(false)} />
  ) : null
}

export default NotificationPopUp
