// @flow
import React from 'react';
import Link from 'next/link';
import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteItem from './DeleteItem';

type Props = {
  item: { title: string, price: number },
};

const Item = ({ item }) => (
  <ItemStyles>
    {item.image && <img src={item.image} alt={item.title} />}
    <Title>
      <Link href={{ pathname: 'item', query: { id: item.id } }}>
        <a>{item.title}</a>
      </Link>
    </Title>
    <PriceTag>{formatMoney(item.price)}</PriceTag>
    <p>{item.description}</p>
    <div className="buttonList">
      <Link
        href={{
          pathname: 'update',
          query: {
            id: item.id,
          },
        }}
      >
        <a>Edit </a>
      </Link>
      <DeleteItem id={item.id}>Delte this item </DeleteItem>
    </div>
  </ItemStyles>
);

export default Item;
