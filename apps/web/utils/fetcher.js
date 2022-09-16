// Fetch function for SWR
export default async function fetcher({ url, method, token }) {
  if (!url) {
    throw new Error('Missing `url` key')
  }

  const res = await fetch(url, {
    method: method ? method : 'GET',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  // If the status code is not in the range 200-299,
  if (!res.ok) {
    let error
    if (process.env.NODE_ENV !== 'production') {
      error = {}
      error = new Error('An error occurred while fetching the data.')
    } else {
    }
    // Attach extra info to the error object.
    error.info = await res.json()
    error.status = res.status
    if (process.env.NODE_ENV !== 'production') {
      throw error
    }
  }

  return res.json()
}
