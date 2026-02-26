import { gql } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client/react'

export const BOOKS_BY_GENRE = gql`
  query booksByGenre($genre: String!) {
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

const FavoriteBooks = ({ show, favoriteGenre }) => {


  const { loading, error, data } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre || "" },  
    skip: !favoriteGenre,                       
  })  
  if (!show) return null
  if (!favoriteGenre) return <div>Loading user data...</div>
  if (loading) return <div>loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const books = data.allBooks

  return (
    <div>
      <h2>Books in your favorite genre: {favoriteGenre}</h2>
      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b.title + b.author.name}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FavoriteBooks