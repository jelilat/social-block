import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

import { IRoomData } from '../../../types/Rooms'
import { useAppSelector } from '../hooks'

import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'

import { useActiveAccount } from 'thirdweb/react'

const CreateRoomFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 320px;
  gap: 20px;
  max-height: 70vh; // 70% of viewport height
  overflow-y: auto; // Enable vertical scrolling
`

export const CreateRoomForm = () => {
  const [values, setValues] = useState<IRoomData>({
    name: '',
    description: '',
    password: null,
    autoDispose: true,
    isPrivate: false,
    tokenGating: {
      contractAddress: '',
      minimumAmount: 0,
      tokenType: 'erc20',
      // chain: 'Ethereum',
    },
    entryFee: {
      amount: 0,
      // currency: 'ETH',
    },
    maxPlayers: 10,
    creator: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [nameFieldEmpty, setNameFieldEmpty] = useState(false)
  const [descriptionFieldEmpty, setDescriptionFieldEmpty] = useState(false)
  const [tokenGate, setTokenGate] = useState(false)
  // const [entryFee, setEntryFee] = useState(false)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)

  const activeAccount = useActiveAccount()

  useEffect(() => {
    if (activeAccount) {
      setValues({ ...values, creator: activeAccount.address })
    }
  }, [activeAccount])

  const handleChange = (prop: keyof IRoomData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleTokenGatingChange =
    (prop: keyof typeof values.tokenGating) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({
        ...values,
        tokenGating: {
          ...values.tokenGating,
          [prop]: prop === 'minimumAmount' ? Number(event.target.value) : event.target.value,
          contractAddress: values.tokenGating?.contractAddress || '',
          minimumAmount: values.tokenGating?.minimumAmount || 0,
        },
      })
    }

  const handleEntryFeeChange =
    (prop: keyof typeof values.entryFee) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({
        ...values,
        entryFee: {
          ...values.entryFee,
          [prop]: prop === 'amount' ? Number(event.target.value) : event.target.value,
          amount: values.entryFee?.amount || 0,
        },
      })
    }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValidName = values.name !== ''
    const isValidDescription = values.description !== ''

    if (isValidName === nameFieldEmpty) setNameFieldEmpty(!nameFieldEmpty)
    if (isValidDescription === descriptionFieldEmpty)
      setDescriptionFieldEmpty(!descriptionFieldEmpty)

    // create custom room if name and description are not empty
    if (isValidName && isValidDescription && lobbyJoined) {
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      const roomId = await bootstrap.network.createCustom(values)

      bootstrap.launchGame()
    }
  }

  return (
    <CreateRoomFormWrapper onSubmit={handleSubmit}>
      <TextField
        label="Name"
        variant="outlined"
        color="secondary"
        autoFocus
        error={nameFieldEmpty}
        helperText={nameFieldEmpty && 'Name is required'}
        onChange={handleChange('name')}
      />

      <TextField
        label="Description"
        variant="outlined"
        color="secondary"
        error={descriptionFieldEmpty}
        helperText={descriptionFieldEmpty && 'Description is required'}
        multiline
        rows={4}
        onChange={handleChange('description')}
      />

      <TextField
        type={showPassword ? 'text' : 'password'}
        label="Password (optional)"
        onChange={handleChange('password')}
        color="secondary"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={values.isPrivate}
            onChange={(e) => setValues({ ...values, isPrivate: e.target.checked })}
          />
        }
        label="Private Room"
        sx={{ color: 'white' }}
      />

      <FormControlLabel
        control={<Switch checked={tokenGate} onChange={(e) => setTokenGate(e.target.checked)} />}
        label="Token Gate"
        sx={{ color: 'white' }}
      />

      {tokenGate && (
        <>
          <TextField
            label="Token Contract Address"
            variant="outlined"
            color="secondary"
            onChange={handleTokenGatingChange('contractAddress')}
          />

          <TextField
            label="Minimum Token Amount"
            variant="outlined"
            color="secondary"
            type="number"
            onChange={handleTokenGatingChange('minimumAmount')}
          />

          <FormControl fullWidth>
            <InputLabel>Token Type</InputLabel>
            <Select
              value={values.tokenGating.tokenType}
              label="Token Type"
              onChange={(e) =>
                setValues({
                  ...values,
                  tokenGating: { ...values.tokenGating, tokenType: e.target.value as string },
                })
              }
            >
              <MenuItem value="native">Native</MenuItem>
              <MenuItem value="erc20">ERC20</MenuItem>
              <MenuItem value="erc721">ERC721</MenuItem>
              <MenuItem value="erc1155">ERC1155</MenuItem>
            </Select>
          </FormControl>
        </>
      )}

      {/* <FormControl fullWidth>
        <InputLabel>Blockchain</InputLabel>
        <Select
          value={values.tokenGating.chain}
          label="Blockchain"
          onChange={(e) =>
            setValues({
              ...values,
              tokenGating: { ...values.tokenGating, chain: e.target.value as string },
            })
          }
        >
          <MenuItem value="Ethereum">Ethereum</MenuItem>
          <MenuItem value="BinanceSmartChain">Binance Smart Chain</MenuItem>
          <MenuItem value="Polygon">Polygon</MenuItem>
        </Select>
      </FormControl> */}

      <TextField
        label="Entry Fee Amount"
        variant="outlined"
        color="secondary"
        type="number"
        onChange={handleEntryFeeChange('amount')}
      />

      {/* <FormControl fullWidth>
        <InputLabel>Entry Fee Currency</InputLabel>
        <Select
          value={values.entryFee.currency}
          label="Entry Fee Currency"
          onChange={(e) =>
            setValues({
              ...values,
              entryFee: { ...values.entryFee, currency: e.target.value as string },
            })
          }
        >
          <MenuItem value="ETH">ETH</MenuItem>
          <MenuItem value="BNB">BNB</MenuItem>
          <MenuItem value="MATIC">MATIC</MenuItem>
        </Select>
      </FormControl> */}

      <Button variant="contained" color="secondary" type="submit">
        Create
      </Button>
    </CreateRoomFormWrapper>
  )
}
