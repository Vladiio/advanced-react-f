import React from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withStateHandlers } from 'recompose';
import Router from 'next/router';
import Form from './styles/Form';
import Error from './ErrorMessage';
// import formatMoney from '../lib/formatMoney';

const withSellForm = withStateHandlers(
  {},
  {
    handleChange: () => (e) => {
      const { name, type, value } = e.target;
      const val = type === 'number' ? parseFloat(value) : value;
      return { [name]: val };
    },

    handleFormSubmit: () => async (event, updateItem) => {
      event.preventDefault();
      const res = await updateItem();
      // Router.push({
      //   pathname: '/item',
      //   query: { id: res.data.updateItem.id },
      // });
    },
  },
);

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION($id: ID!, $title: String, $description: String, $price: Int) {
    updateItem(id: $id, title: $title, description: $description, price: $price) {
      id
    }
  }
`;

const UpdateItem = ({
  id, handleChange, title, description, price, handleFormSubmit,
}) => (
  <Query
    query={SINGLE_ITEM_QUERY}
    variables={{
      id,
    }}
  >
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (!data.item) return <p>{`No item found for ID ${id}`}</p>;
      return (
        <Mutation
          mutation={UPDATE_ITEM_MUTATION}
          variables={{
            id,
            title,
            price,
            description,
          }}
        >
          {(updateItem, { loading, error }) => (
            <Form onSubmit={e => handleFormSubmit(e, updateItem)}>
              <Error error={error} />
              <fieldset disabled={loading} aria-busy={loading}>
                <label htmlFor="title">
                  Title
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="title"
                    onChange={handleChange}
                    defaultValue={data.item.title}
                    required
                  />
                </label>
                <label htmlFor="price">
                  Price
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="price"
                    onChange={handleChange}
                    defaultValue={data.item.price}
                    required
                  />
                </label>
                <label htmlFor="description">
                  Description
                  <textarea
                    id="description"
                    name="description"
                    placeholder="description"
                    onChange={handleChange}
                    defaultValue={data.item.description}
                    required
                  />
                </label>
                <button type="submit">Save changes</button>
              </fieldset>
            </Form>
          )}
        </Mutation>
      );
    }}
  </Query>
);

export default withSellForm(UpdateItem);
export { UPDATE_ITEM_MUTATION };
