import React, { useState } from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../hooks'
import { Role } from '../../../types/IOfficeState'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

const MenuContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
`

const HamburgerButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  padding: 0;
  box-sizing: border-box;

  &:focus {
    outline: none;
  }

  div {
    width: 30px;
    height: 3px;
    background: #333;
    border-radius: 3px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    :first-child {
      transform: ${({ isOpen }: { isOpen: boolean }) => (isOpen ? 'rotate(45deg)' : 'rotate(0)')};
    }

    :nth-child(2) {
      opacity: ${({ isOpen }: { isOpen: boolean }) => (isOpen ? '0' : '1')};
      transform: ${({ isOpen }: { isOpen: boolean }) =>
        isOpen ? 'translateX(20px)' : 'translateX(0)'};
    }

    :nth-child(3) {
      transform: ${({ isOpen }: { isOpen: boolean }) => (isOpen ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }
`

const Menu = styled.nav<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  position: absolute;
  top: 40px;
  left: 0;
  width: 200px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transform: ${({ isOpen }) => (isOpen ? 'scaleY(1)' : 'scaleY(0)')};
  transform-origin: top;
  transition: transform 0.3s ease-in-out;
`

const MenuItem = styled.button`
  padding: 10px 0;
  color: #333;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  width: 100%;

  &:hover {
    color: #007bff;
  }
`

const PlayerList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const PlayerListItem = styled.li`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showInfectList, setShowInfectList] = useState(false)
  const [showKillList, setShowKillList] = useState(false)
  const player = useAppSelector((state) => state.player)
  const playerNameMap = useAppSelector((state) => state.user.playerNameMap)
  const playerId = useAppSelector((state) => state.user.sessionId)
  const game = phaserGame.scene.keys.game as Game

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleGetTested = () => {
    alert(`You are ${player.isInfected ? 'infected' : 'not infected'}.`)
  }

  const handleInvestigate = () => {
    alert('Journalist investigates')
  }

  const handleKill = (targetId: string) => {
    game.network.killPlayer(playerId, targetId)
  }

  const handleTerroristInfect = (targetId: string) => {
    game.network.infectPlayer(playerId, targetId)
  }

  const handleSelectPlayer = (playerId: string, action: 'infect' | 'kill') => {
    if (action === 'infect') {
      handleTerroristInfect(playerId)
      setShowInfectList(false)
    } else if (action === 'kill') {
      handleKill(playerId)
      setShowKillList(false)
    }
  }

  return (
    <MenuContainer>
      <HamburgerButton onClick={toggleMenu} isOpen={isOpen}>
        <div />
        <div />
        <div />
      </HamburgerButton>
      <Menu isOpen={isOpen}>
        <MenuItem onClick={handleGetTested}>Get Tested</MenuItem>
        {player.role === Role.Reporter && (
          <MenuItem onClick={handleInvestigate}>Investigate</MenuItem>
        )}
        {player.role === Role.Terrorist && (
          <>
            <MenuItem onClick={() => setShowInfectList(!showInfectList)}>Infect</MenuItem>
            {showInfectList && (
              <PlayerList>
                {Object.entries(playerNameMap).map(([id, name]) => (
                  <PlayerListItem key={id} onClick={() => handleSelectPlayer(id, 'infect')}>
                    {name}
                  </PlayerListItem>
                ))}
              </PlayerList>
            )}
          </>
        )}
        {(player.role === Role.Terrorist || player.role === Role.Police) && (
          <>
            <MenuItem onClick={() => setShowKillList(!showKillList)}>Kill</MenuItem>
            {showKillList && (
              <PlayerList>
                {Object.entries(playerNameMap).map(([id, name]) => (
                  <PlayerListItem key={id} onClick={() => handleSelectPlayer(id, 'kill')}>
                    {name}
                  </PlayerListItem>
                ))}
              </PlayerList>
            )}
          </>
        )}
      </Menu>
    </MenuContainer>
  )
}

export default HamburgerMenu
