import { gql } from '@apollo/client';

const GET_ME_QUERY = gql`
  query GetMe {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        image
        description
        title
        link
      }
    }
  }
`;

export default GET_ME_QUERY;
