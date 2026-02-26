import React, { useState , useEffect} from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/client/react'
import { ALL_BOOKS, BOOK_ADDED, ADD_BOOK } from './queries'
import BooksList from './components/BooksList'

const App = () => {
  const [books, setBooks] = useState([])

  const { loading, error, data } = useQuery(ALL_BOOKS)


  const [addBook] = useMutation(ADD_BOOK, {
    onCompleted: (data) => {
      setBooks((prev) => prev.concat(data.addBook))
    },
  })


  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const newBook = data.data.bookAdded
      window.alert(`Novo livro adicionado: ${newBook.title} por ${newBook.author}`)
      addBookToCache(client.cache, addedBook)
      setBooks((prev) => {
        if (prev.find((b) => b.id === newBook.id)) return prev
        return prev.concat(newBook)
      })
    },
  })

  useEffect(() => {
    if (data?.allBooks) {
      setBooks(data.allBooks)
    }
  }, [data])

  if (loading) return <div>Loading books...</div>
  if (error) return <div>Error: {error.message}</div>


  const handleSubmit = (e) => {
    e.preventDefault()
    const title = e.target.title.value
    const author = e.target.author.value
    const published = parseInt(e.target.published.value)

    addBook({ variables: { title, author, published } })
    e.target.reset()
  }

  return (
    <div>
      <h1>GraphQL Library</h1>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" required />
        <input name="author" placeholder="Author" required />
        <input name="published" placeholder="Year" type="number" required />
        <button type="submit">Add Book</button>
      </form>

      <BooksList books={books} />
    </div>
  )
}

export default App