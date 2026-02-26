import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      title
      author
      published
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!) {
    addBook(title: $title, author: $author, published: $published) {
      id
      title
      author
      published
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      id
      title
      author
      published
    }
  }
`