import { useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery, useMutation } from '@apollo/client/react'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      bookCount
    }
  }
`

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.error(error.graphQLErrors[0]?.message)
    },
  })

  if (!props.show) return null
  if (result.loading) return <div>loading...</div>
  if (result.error) return <div>Error: {result.error.message}</div>

  const authors = result.data?.allAuthors || []

  const submit = async (event) => {
    event.preventDefault()
    editAuthor({
      variables: { name, setBornTo: Number(born) },
    })
    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born ?? 'N/A'}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birth year</h3>
      <form onSubmit={submit}>
        <div>
          Author{' '}
          <select value={name} onChange={(e) => setName(e.target.value)}>
            <option value="">Select author</option>
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          Born{' '}
          <input
            type="number"
            value={born}
            onChange={(e) => setBorn(e.target.value)}
          />
        </div>
        <button type="submit">Update author</button>
      </form>
    </div>
  )
}

export default Authors