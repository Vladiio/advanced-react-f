import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { withStateHandlers } from 'recompose';
import Router from 'next/router';
import Form from './styles/Form';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

const withSellForm = withStateHandlers(
  {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0,
  },
  {
    handleChange: () => (e) => {
      const { name, type, value } = e.target;
      const val = type === 'number' ? parseFloat(value) : value;
      return { [name]: val };
    },
  },
);

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends React.Component {
  state = {
    image: '',
  };

  uploadFile = async (e) => {
    console.log('uploading file...');
    const { files } = e.target;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');
    const res = await fetch('https://api.cloudinary.com/v1_1/doj0w7mlu/image/upload', {
      method: 'POST',
      body: data,
    });
    const file = await res.json();
    console.log(file);
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
  };

  render() {
    const {
      title, handleChange, price, description,
    } = this.props;
    const { image, largeImage } = this.state;
    return (
      <Mutation
        mutation={CREATE_ITEM_MUTATION}
        variables={{
          title,
          price,
          description,
          image,
          largeImage,
        }}
      >
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              const res = await createItem();
              Router.push({
                pathname: '/item',
                query: { id: res.data.createItem.id },
              });
            }}
          >
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Title
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  onChange={this.uploadFile}
                  required
                />
                {image && <img src={image} />}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="title"
                  onChange={handleChange}
                  value={title}
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
                  value={price}
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
                  value={description}
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default withSellForm(CreateItem);
export { CREATE_ITEM_MUTATION };
