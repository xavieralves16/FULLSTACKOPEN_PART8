import { ALL_BOOKS } from '../queries'

export const addBookToCache = (cache, bookToAdd) => {
  cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
    const exists = allBooks.some(b => b.id === bookToAdd.id)
    if (exists) {
      return { allBooks }
    }
    return { allBooks: allBooks.concat(bookToAdd) }
  })
}