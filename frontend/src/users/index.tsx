import axios, { AxiosResponse } from 'axios';
import React, { FunctionComponent } from 'react';
import { Table } from 'react-bootstrap';
import { useQuery } from 'react-query';
// Using require statement until I can resolve type errors as an import
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lodash = require('lodash');

export const UserList: FunctionComponent = () => {
  interface UserValue {
    _id: number;
    name: string;
    isNewUser: boolean;
    userId: string;
    createdAt: string;
    lastSeen: string;
    vatsimId: string;
    pilotRating: {
      p0: boolean;
      p1: boolean;
      p2: boolean;
      p3: boolean;
      p4: boolean;
    };
  }
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const fetchUsers = async (): Promise<AxiosResponse> => {
    return axios.get('/api/users', {
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const { isLoading, isError, data, error } = useQuery('users', fetchUsers);

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Vatsim ID</th>
            <th>Name</th>
            <th>Pilot Ratings</th>
            <th>Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <div>Loading</div>
          ) : (
            data?.data.map((value: UserValue) => {
              const { pilotRating } = value;
              let ratings;
              if (pilotRating !== undefined) {
                ratings = Object.keys(lodash.pickBy(pilotRating)).map(
                  (rating) => {
                    return <li>{rating}</li>;
                  }
                );
              } else {
                ratings = <ul />;
              }
              return (
                <tr key={value._id}>
                  <td>{value.vatsimId}</td>
                  <td>{value.name}</td>
                  <td>{ratings}</td>

                  <td>{value.lastSeen}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};
