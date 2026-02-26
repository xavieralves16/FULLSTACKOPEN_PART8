import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useState } from 'react'  

export const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      published
      genres
      author {
        name
      }
    }
  }
`

const Books = (props) => {

  const [filterGenre, setFilterGenre] = useState('all')

  const { loading, error, data, refetch } = useQuery(ALL_BOOKS, {
    variables: filterGenre === 'all' ? {} : { genre: filterGenre },
  })

  if (!props.show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  if (error) return <div>Error: {error.message}</div>

  const books = data?.allBooks || []

  const genres = [...new Set(books.flatMap(b => b.genres))]

  return (
    <div>
      <h2>books</h2>
      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (  
            <tr key={b.title + b.author.name}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => {
            setFilterGenre('all')
            refetch({ genre: null })  
          }}
          style={{ fontWeight: filterGenre === 'all' ? 'bold' : 'normal' }}
        >
          all genres
        </button>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => {
              setFilterGenre(g)
              refetch({ genre: g })  
            }}
            style={{ fontWeight: filterGenre === g ? 'bold' : 'normal' }}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books