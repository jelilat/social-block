import React from 'react'
import styled from 'styled-components'

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 400px;
  width: 100%;
`

interface ModalProps {
  content: string
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ content, onClose }) => {
  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>{content}</h3>
      </ModalContent>
    </ModalBackdrop>
  )
}

export default Modal
