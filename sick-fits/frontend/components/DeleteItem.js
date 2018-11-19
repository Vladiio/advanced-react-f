import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';
import ErrorMessage from './ErrorMessage';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

const update = (cache, payload) => {
  const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
  const { id } = payload.data.deleteItem;
  const items = data.items.filter(item => item.id !== id);
  cache.writeQuery({ query: ALL_ITEMS_QUERY, data: { ...data, items } });
};

const DeleteItem = ({ children, id }) => (
  <Mutation mutation={DELETE_ITEM_MUTATION} variables={{ id }} update={update}>
    {(deleteItem, { error }) => (
      <button type="button" onClick={() => confirm('Are your sure?') && deleteItem()}>
        {children}
      </button>
    )}
  </Mutation>
);

export default DeleteItem;
