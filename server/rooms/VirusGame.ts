import { Client } from 'colyseus'
import { SkyOffice } from './SkyOffice'
import { Winner, Role } from '../types'
import { ArraySchema } from '@colyseus/schema'
import { Player } from './schema/OfficeState'
import { IRoomData } from '../../types/Rooms'
import { Message } from '../../types/Messages'

export class VirusGame extends SkyOffice {
  maxClients = 12

  async onCreate(options: IRoomData) {
    super.onCreate(options)

    this.onMessage(
      Message.INFECT_PLAYER,
      (client, message: { assailantId: string; targetId: string }) => {
        const assailant = this.state.players.get(message.assailantId)
        const target = this.state.players.get(message.targetId)
        if (assailant && target) {
          // TODO: Assailant can only infect a target if they've spoken to them for atleast 1 minute
          if (assailant.role == Role.Terrorist) {
            this.infectPlayer(target)
          }
        }
      }
    )

    this.onMessage(
      Message.GIVE_ANTIDOTE,
      (client, message: { giverId: string; receiverId: string }) => {
        const giver = this.state.players.get(message.giverId)
        const receiver = this.state.players.get(message.receiverId)
        if (giver && receiver) {
          if (giver.role == Role.Terrorist && giver.numOfAntidotes > 0) {
            if (receiver.isInfected) {
              receiver.isInfected = false
              receiver.roundInfected = 0
            }
            // can only use one of an antidote or bullet per round
            giver.numOfAntidotes--
            giver.numOfBullets--
          }
        }
      }
    )

    this.onMessage(
      Message.KILL_PLAYER,
      (client, message: { assassinId: string; targetId: string }) => {
        const assassin = this.state.players.get(message.assassinId)
        const target = this.state.players.get(message.targetId)
        // TODO: Assassin can only kill a target from a particular distance through certain gestures
        if (assassin && target) {
          if (
            (assassin.role == Role.Police || assassin.role == Role.Terrorist) &&
            assassin.numOfBullets > 0
          ) {
            target.isDead = true
            this.state.deadPlayers.push(client.sessionId)
          }
          // can only use one bullet per round
          assassin.numOfBullets--
          assassin.numOfAntidotes = 0
        }
      }
    )

    this.onMessage(Message.GET_TESTED, (client, message: { playerId: string }) => {
      const player = this.state.players.get(message.playerId)
      if (player) {
        player.testKits--
        return {
          isInfected: player?.isInfected,
        }
      }
    })
  }

  onJoin(client: Client, options: any) {
    super.onJoin(client, options)

    // Check if the game should start
    if (this.state.players.size >= this.maxClients) {
      this.startGame()
    }
  }

  private startGame() {
    this.state.gameStarted = true
    this.state.round = 1
    this.state.timeRoundStarted = Date.now()
    this.assignRoles()
    this.setPlayerOrder()
    this.broadcast('gameStart')
  }

  private setPlayerOrder() {
    this.state.playerOrder = new ArraySchema<string>(...this.state.players.keys())
  }

  private assignRoles() {
    const roles = this.generateRoles()
    const playerIds = Array.from(this.state.players.keys())

    let civilianWithAntibodies = false
    let terrorists: string[] = []

    playerIds.forEach((playerId, index) => {
      const player = this.state.players.get(playerId)
      if (player) {
        player.role = roles[index]

        switch (player.role) {
          case Role.Terrorist:
            player.numOfBullets = 1
            player.numOfAntidotes = 1
            terrorists.push(playerId)
            break
          case Role.Police:
            player.numOfBullets = 1
            break
          case Role.Civilian:
            if (!civilianWithAntibodies) {
              player.hasAntibodies = Math.random() < 0.2 // 20% chance for the first civilian to get antibodies
              if (player.hasAntibodies) civilianWithAntibodies = true
            }
            break
        }

        // Send private message to each player with their role
        this.clients.forEach((client) => {
          if (client.sessionId === playerId) {
            client.send(Message.ROLE_CHANGED, { role: player.role })
          }
        })
      }
    })

    // Inform terrorists of their partners
    if (terrorists.length > 1) {
      terrorists.forEach((terroristId) => {
        const partnerId = terrorists.find((id) => id !== terroristId)
        if (partnerId) {
          const partner = this.state.players.get(partnerId)
          this.clients.forEach((client) => {
            if (client.sessionId === terroristId) {
              client.send(Message.TERRORIST_PARTNER, { partnerName: partner?.name })
            }
          })
        }
      })
    }

    // If no civilian got antibodies, randomly assign to one
    if (!civilianWithAntibodies) {
      const civilians = playerIds.filter((id) => this.state.players.get(id)?.role === Role.Civilian)
      if (civilians.length > 0) {
        const randomCivilian = civilians[Math.floor(Math.random() * civilians.length)]
        const player = this.state.players.get(randomCivilian)
        if (player) player.hasAntibodies = true
      }
    }
  }

  private generateRoles(): Role[] {
    const roleDistribution = [
      Role.Civilian,
      Role.Civilian,
      Role.Civilian,
      Role.Civilian,
      Role.Civilian,
      Role.Terrorist,
      Role.Terrorist,
      Role.Researcher,
      Role.Researcher,
      Role.Police,
      Role.Fanatic,
      Role.Reporter,
    ]

    // Shuffle the roles
    for (let i = roleDistribution.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[roleDistribution[i], roleDistribution[j]] = [roleDistribution[j], roleDistribution[i]]
    }

    return roleDistribution
  }

  onLeave(client: Client, consented: boolean) {
    super.onLeave(client, consented)

    // TODO: Find a way to substitute players that leave instead of killing them and ruining the game for other players
    const player = this.state.players.get(client.sessionId)
    if (player) {
      this.state.deadPlayers.push(client.sessionId)
      player.isDead = true
    }
  }

  private progressRound() {
    this.handleInfections()
    this.checkPlayerStatus()
    this.state.round++
    this.state.timeRoundStarted = Date.now()

    const winner = this.checkWinners()
    if (winner || this.state.round > 5) {
      this.broadcast('game-ended', { winner })
    } else {
      this.broadcast('roundUpdate', { round: this.state.round })
    }
  }

  private handleInfections() {
    const playerOrder = this.state.playerOrder
    playerOrder.forEach((playerId, index) => {
      const player = this.state.players.get(playerId)
      if (player && player.isInfected && player.roundInfected <= this.state.round) {
        // Infect neighbors
        const leftIndex = (index - 1 + playerOrder.length) % playerOrder.length
        const rightIndex = (index + 1) % playerOrder.length
        this.infectPlayer(this.state.players.get(playerOrder[leftIndex]))
        this.infectPlayer(this.state.players.get(playerOrder[rightIndex]))

        // Reset the number of bullets for police and terrorists
        if (player.role == Role.Terrorist || player.role == Role.Police) {
          player.numOfBullets = 1
        }

        // Reset the number of antidotes for terrorists
        if (player.role == Role.Terrorist) {
          player.numOfAntidotes = 1
        }
      }
    })
  }

  private infectPlayer(player: Player | undefined) {
    // Player can still be infected if they have antibodies. They just won't die
    if (player && !player.isDead) {
      player.isInfected = true
      player.roundInfected = this.state.round + 1
    }
  }

  private checkPlayerStatus() {
    this.state.playerOrder.forEach((playerId) => {
      const player = this.state.players.get(playerId)
      if (player && player.isInfected && player.roundInfected != 0) {
        if (this.state.round - player.roundInfected >= 2) {
          if (!player.hasAntibodies) {
            player.isDead = true
            this.state.deadPlayers.push(playerId)
          } else {
            // player with antibodies gets cured after 2 rounds
            player.isInfected = false
            player.roundInfected = 0
          }
        }
      }
    })
  }

  update() {
    if (this.state.gameStarted) {
      const currentTime = Date.now()
      if (currentTime - this.state.timeRoundStarted >= 5 * 60 * 1000) {
        this.progressRound()
      }
    }
  }

  checkWinners() {
    let deadTerrorists = 0
    let deadCivilians = 0
    let winner: Winner | null = null
    let antiBodyPlayerDead = false

    const deadPlayersId = this.state.deadPlayers
    for (const deadId of deadPlayersId) {
      const deadPlayer = this.state.players.get(deadId)
      if (deadPlayer && deadPlayer.role == Role.Terrorist) {
        deadTerrorists++
      } else {
        deadCivilians++
      }
      if (deadPlayer && deadPlayer.hasAntibodies) {
        antiBodyPlayerDead = true
      }
      if (deadTerrorists >= 2) {
        winner = Role.Civilian
        break
      } else if (deadCivilians >= 10 && !antiBodyPlayerDead) {
        winner = Role.Terrorist
        break
      }
    }

    // Terrorists win if round is over 5 and they are not dead yet
    if (!winner && this.state.round > 5) {
      winner =
        deadTerrorists < 2 && !antiBodyPlayerDead
          ? Role.Terrorist
          : deadTerrorists == 2 && deadCivilians < 10
          ? Role.Civilian
          : null
    }

    return winner
  }
}
