'use client'
import axios, { AxiosError } from 'axios'
import { useState } from 'react'
import { NeynarAuthButton, useNeynarContext } from '@neynar/react'

const getServerEndpoint = () => {
  return process.env.NODE_ENV === 'production'
    ? import.meta.env.VITE_SERVER_URL
    : `http://${window.location.hostname}:2567`
}

export default function Farcaster({
  postMessage,
  setShowFarcasterLogin,
  setSharedToFarcaster,
}: {
  postMessage: string
  setShowFarcasterLogin: (value: boolean) => void
  setSharedToFarcaster: (value: boolean) => void
}) {
  const { user } = useNeynarContext()
  const [text, setText] = useState(postMessage)

  const handlePublishCast = async () => {
    try {
      const endpoint = getServerEndpoint()
      await axios.post<{ message: string }>(`${endpoint}/api/cast`, {
        signerUuid: user?.signer_uuid,
        text,
      })
      alert('Cast Published!')
      setText('')
      setShowFarcasterLogin(false)
      setSharedToFarcaster(true)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const { message } = err.response.data as { message: string }
        alert(message)
      } else {
        alert('An error occurred while publishing the cast.')
      }
    }
  }

  return (
    <>
      {user ? (
        <>
          <div className="flex flex-col gap-4 w-96 p-4 rounded-md shadow-md">
            <div className="flex items-center gap-4">
              {user.pfp_url && (
                <img
                  src={user.pfp_url}
                  width={40}
                  height={40}
                  alt="User Profile Picture"
                  className="rounded-full"
                />
              )}
              <p className="text-lg font-semibold">{user?.display_name}</p>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Say Something"
              rows={5}
              className="w-full p-2 rounded-md shadow-md text-black placeholder:text-gray-900"
            />
          </div>
          <button
            onClick={handlePublishCast}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors duration-200 ease-in-out"
          >
            Cast
          </button>
        </>
      ) : (
        <NeynarAuthButton />
      )}
    </>
  )
}
