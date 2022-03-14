import { useCallback, useContext, useState } from "react"
import { UserContext } from "../util/UserContext"

export const useApi = (method, path, customToken) => {
  const { token } = useContext(UserContext)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const trigger = useCallback(async (options) => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetch(`https://www.johnbrynte.se/projects/flosho/api/${options?.path ?? path}`, {
        method,
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(customToken ?? token ? {
            'Authorization': `Basic ${customToken ?? token}`,
          } : {}),
        },
        ...(options?.params && method.toLowerCase() === 'post' ? {
          body: JSON.stringify(options?.params)
        } : {}),
      })
      const json = await data.json()
      if (data.status !== 200) {
        setError(json.error)
        setResult(null)
      } else {
        setResult(json)
        return json
      }
    } catch (e) {
      setError(e)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [method, path, token, customToken])

  return {
    result,
    error,
    loading,
    trigger,
  }
}