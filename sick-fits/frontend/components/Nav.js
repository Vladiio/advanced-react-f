import * as React from 'react';
import Link from 'next/link';
import User from './User';
import NavStyles from './styles/NavStyles';

const Nav = (): React.Node => (
  <NavStyles>
    <User>{({ data: { me } }) => me && <p>{me.name}</p>}</User>
    <Link href="/items">
      <a>Shop</a>
    </Link>
    <Link href="/sell">
      <a>Sell</a>
    </Link>
    <Link href="/signup">
      <a>Signup</a>
    </Link>
    <Link href="/orders">
      <a>Orders</a>
    </Link>
    <Link href="/me">
      <a>Accounts</a>
    </Link>
  </NavStyles>
);

export default Nav;
