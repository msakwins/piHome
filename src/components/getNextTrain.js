export const getNextTrain = async () => {
  try {
    const response = await fetch('/api/idfm')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}