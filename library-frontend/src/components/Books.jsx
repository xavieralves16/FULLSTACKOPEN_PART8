import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useState } from 'react'  

export const ALL_BOOKS = gql`
  query {
    allBooks {
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
  const result = useQuery(ALL_BOOKS)
  const [filterGenre, setFilterGenre] = useState('all')

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  const filteredBooks = filterGenre === 'all' 
    ? books 
    : books.filter(b => b.genres.includes(filterGenre))

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
          {filteredBooks.map((b) => (
            <tr key={b.title + b.author.name}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setFilterGenre('all')}>all genres</button>
        {genres.map(g => (
          <button key={g} onClick={() => setFilterGenre(g)} style={{ fontWeight: filterGenre === g ? 'bold' : 'normal' }}>{g}</button>
        ))}
      </div>
    </div>
  )
}

export default Books