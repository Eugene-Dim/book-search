import { gql } from '@apollo/client';

const userFields = `
  _id
  username
`;

const bookFields = `
  bookId
  authors
  description
  title
  image
  link
`;

const mutations = {
  login: gql`
    mutation login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          ${userFields}
        }
      }
    }
  `,
  addUser: gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
      addUser(username: $username, email: $email, password: $password) {
        token
        user {
          ${userFields}
        }
      }
    }
  `,
  saveBook: gql`
    mutation saveBook($book: InputBook!) {
      saveBook(book: $book) {
        ${userFields}
        email
        bookCount
        savedBooks {
          ${bookFields}
        }
      }
    }
  `,
  removeBook: gql`
    mutation removeBook($bookId: ID!) {
      removeBook(bookId: $bookId) {
        ${userFields}
        email
        bookCount
        savedBooks {
          ${bookFields}
        }
      }
    }
  `,
};

export default mutations;
