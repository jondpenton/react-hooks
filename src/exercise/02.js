// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React from 'react'

function Greeting({ initialName }) {
  const [name, setName] = useLocalStorageState({
    key: 'name',
    initialValue: initialName,
  })

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor='name'>Name: </label>
        <input onChange={handleChange} id='name' value={name} />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function useLocalStorageState({
  key,
  initialValue = '',
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}) {
  const [value, setValue] = React.useState(() => {
    const value = window.localStorage.getItem(key) || initialValue

    try {
      const parsedValue = deserialize(value)

      return parsedValue
    } catch (err) {
      console.error(err.message, { value })

      if (typeof initialValue === 'function') {
        return initialValue()
      }

      return initialValue
    }
  })
  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    const keyHasChanged = prevKey !== key

    if (keyHasChanged) {
      window.localStorage.removeItem(prevKey)
      prevKeyRef.current = key
    }

    window.localStorage.setItem(key, serialize(value))
  }, [value, key, serialize])

  return [value, setValue]
}

function App() {
  return <Greeting />
}

export default App
