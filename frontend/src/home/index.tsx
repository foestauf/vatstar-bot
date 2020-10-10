import React from 'react';
import { UserList } from '../users';

export const Home = (): JSX.Element => {
  return (
    <div>
      Hi from home
      <UserList />
    </div>
  );
};
