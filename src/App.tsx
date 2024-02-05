import { useState, useRef, useMemo } from 'react'
import { useMediaQuery, mediaQuery } from './lib/useMediaQuery'
import './App.css'

const INITIME = 60

function showTime(time: number) {
  const minute = time < 60 ? '00' : (time/60 < 10 ? '0' + String(Math.floor(time/60)) : String(Math.floor(time/60)))
  const second = time%60 < 10 ? '0' + String(Math.floor(time%60)) : String(Math.floor(time%60))

  return `${minute}:${second}`
}

function App() {
  const isSp = useMediaQuery(mediaQuery.sp)
  const timerDecoConfig = isSp ? {height: 460, width: 460, r: 180, outerR: 230, strokeWidth: 20} : {height: 500, width: 500, r: 230, outerR: 250, strokeWidth: 20}
  const [time, setTime] = useState(INITIME)
  const [time2, setTime2] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPause, setIsPause] = useState(false)
  const intervalRef = useRef(0)

  const timerStart = (mode: string) => {
    if (mode === 'start') {
      setIsRunning(true)
      setTime2(time)
    } else if (mode === 'restart') {
      setIsPause(false)
    }
    intervalRef.current = setInterval(() => {
      setTime((time) => time - 1)
    }, 1000)
  }

  const pause = () => {
    clearInterval(intervalRef.current)
    setIsPause(true)
  }
  const reset = () => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setTime(INITIME)
  }

  const incrementTime = (amount: number) => {
    if (time < 3599) setTime((time) => time + amount)
  }

  const initTime = () => {
    setTime(INITIME)
  }

  useMemo(() => {
    if (time <= 0 && isRunning) {
      clearInterval(intervalRef.current)
      setIsRunning(false)
      setTime(INITIME)
    }
  }, [time])

  return (
    <div className='container'>
      {isRunning ? (
        <>
        <div style={{position: 'relative', height: '70vh', width: '70vw', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div className={`timerCountFont roboto700 ${time > 10 ? 'timerCountColor' : 'timerAlmostFinishColor'}`} style={{position: 'absolute'}}>
            {showTime(time)}
          </div>
          <div style={{position: 'absolute'}}>
            <svg width={timerDecoConfig.width} height={timerDecoConfig.height} viewBox={`0 0 ${timerDecoConfig.width} ${timerDecoConfig.height}`}>
              <circle
                r={timerDecoConfig.r}
                cx={timerDecoConfig.outerR}
                cy={timerDecoConfig.outerR}
                stroke={'white'}
                fill="transparent"
                strokeWidth={timerDecoConfig.strokeWidth}
                opacity={0.3}
              />
              <circle
                r={timerDecoConfig.r}
                cx={timerDecoConfig.outerR}
                cy={timerDecoConfig.outerR}
                stroke={time > 10 ? 'white' : 'rgb(188, 115, 115)'}
                fill="transparent"
                strokeWidth={timerDecoConfig.strokeWidth}
                strokeDasharray={2 * Math.PI * timerDecoConfig.r}
                strokeDashoffset={2 * Math.PI * timerDecoConfig.r * (time / time2)}
                transform={`rotate(-90 ${timerDecoConfig.outerR} ${timerDecoConfig.outerR})`}
              />
            </svg>
          </div>
        </div>

        <div>
          {isPause ? (
            <button className='button2 roboto100' onClick={() => timerStart('restart')}>restart</button>
          ) : (
            <button className='button2 roboto100' onClick={pause}>pause</button>
          )}
          <button className='button2 roboto100' onClick={reset}>reset</button>
        </div>
        </>
      ) : (
        <div>
          <div className='counterStartContainer'>
            <div className={`timerCountFont roboto100`}>
              {showTime(time)}
            </div>
            <button className='button roboto100' onClick={() => timerStart('start')}>start</button>
          </div>
          <div>
            <button className='button2 roboto100' onClick={() => incrementTime(300)}>+5m</button>
            <button className='button2 roboto100' onClick={() => incrementTime(60)}>+1m</button>
            <button className='button2 roboto100' onClick={() => incrementTime(1)}>+1s</button>
            <button className='button2 roboto100' onClick={initTime}>init</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
