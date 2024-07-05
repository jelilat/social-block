import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useAppSelector, useAppDispatch } from '../hooks'
import { clearNotification } from '../stores/NotificationStore'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`

const Container = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: ${({ isVisible }) => (isVisible ? fadeIn : fadeOut)} 0.5s forwards;
  z-index: 1000;
`

const NotificationPopUp: React.FC<{ duration?: number }> = ({ duration = 3000 }) => {
  const message = useAppSelector((state) => state.notification.message)
  const dispatch = useAppDispatch()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        dispatch(clearNotification())
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [message, duration, dispatch])

  return isVisible && message ? <Container isVisible={isVisible}>{message}</Container> : null
}

export default NotificationPopUp
