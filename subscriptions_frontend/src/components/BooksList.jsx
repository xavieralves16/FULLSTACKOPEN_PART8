import React from 'react'

const BooksList = ({ books }) => {
  return (
    <div>
      <h2>Book List</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} - {book.author} ({book.published})
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BooksList