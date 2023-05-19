'use client'

import React, { useEffect, useState } from 'react'
import { STARTED_TIME, majorData as data } from './constants'

export default function Home() {
  const [seconds, setSeconds] = useState<number>(900)
  const [player, setPlayer] = useState('')
  const [majorData, setMajorData] = useState(data)
  const [isFinished, setIsFinished] = useState<boolean>(false)
  const [hasStarted, setHasStarted] = useState<boolean>(false)

  function onStart() {
    const hasStartedTime = localStorage.getItem(STARTED_TIME)

    if (hasStartedTime) {
      const startedTime = new Date(Number(hasStartedTime))
      const secondsDifference = getSecondsDifference(startedTime, new Date())
      if (secondsDifference <= 0) {
        setSeconds(900)
        setHasStarted(false)
        localStorage.removeItem(STARTED_TIME)
      }

      setSeconds(900 - secondsDifference)
      setHasStarted(true)
    }
  }

  function startGame() {
    const hasStartedTime = localStorage.getItem(STARTED_TIME)
    if (!hasStartedTime) {
      localStorage.setItem(STARTED_TIME, new Date().getTime().toString())
    }

    setSeconds(prev => prev - 1)
    setHasStarted(true)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!player) {
      return
    }

    if (!hasStarted) {
      console.log('game starting')
      startGame()
    }

    console.log('Submit')
    handleFindPlayer(player)
  }

  function handleFindPlayer(name: string) {
    const newArray = majorData.map(major => {
      major.teams = major.teams.map(team => {
        team.players = team.players.map(item => {
          if (item.name === name && !item.wasFound) {
            item.wasFound = true
            setPlayer('')
          }

          return item
        })
        return team
      })
      return major
    })

    setMajorData(newArray)
  }

  function addLeadingZero(number: number) {
    return number.toString().padStart(2, '0')
  }

  function getSecondsDifference(date1: Date, date2: Date) {
    const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime())
    console.log('aaaa', Math.floor(diffInMilliseconds / 1000))
    return Math.floor(diffInMilliseconds / 1000)
  }

  function updateTimer() {
    if (!hasStarted) return

    setTimeout(() => {
      if (seconds === 0) {
        setIsFinished(true)
        return
      }
      setSeconds(prevState => prevState - 1)
    }, 1000)
  }

  useEffect(() => {
    onStart()
  }, [])

  useEffect(() => {
    updateTimer()
  }, [hasStarted, seconds])

  return (
    <main className='w-screen h-screen items-center bg-slate-500 flex flex-col'>
      <div className='flex items-center my-10 justify-around w-full'>
        <div>
          <p className='font-semibold text-3xl text-orange-500'>
            {addLeadingZero(Math.floor(seconds / 60))} : {addLeadingZero(seconds % 60)}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className='p-2 border-orange-500 border-2 outline-none rounded-lg mr-2'
            type="text"
            onChange={(e) =>
              setPlayer(e.target.value)}
            value={player}
            placeholder='Enter a player name...'
          />
          <button className='p-2 bg-orange-500 rounded-lg text-slate-500 hover:bg-orange-800' type="submit" >submit</button>
        </form>
      </div>

      <div className='flex flex-col overflow-scroll w-full px-10 pb-10'>

        {majorData.map(major => (
          <div key={major.title} className='w-full border-2 border-orange-500 rounded-lg p-10 mb-6'>
            <h4 className='text-orange-500 font-bold text-xl'>{major.title}</h4>

            <h6>{major.teams.map(team => (
              <div key={team.name} className='border-2 border-orange-500 p-5 mt-5 rounded-lg w-1/4'>
                <p className='text-lg font-semibold text-orange-500'>{team.name}</p>
                <ul>

                  {team.players.map((playerName, index) => (
                    <li key={index}>
                      <p className='font-medium text-orange-500'>{playerName.wasFound ? playerName.name : '----------'}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}</h6>
          </div>
        ))}
      </div>
    </main>
  )
}
