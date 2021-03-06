import axios from 'axios';
import React, { useEffect, useState, FunctionComponent } from 'react';
import { Table } from 'react-bootstrap';
// Using require statement until I can resolve type errors as an import
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lodash = require('lodash');

export const UserList: FunctionComponent = () => {
  const [userList, setUserList] = useState([]);
  const uri = '/api/users';
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

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await axios
        .get(uri, { headers: { 'Content-Type': 'application/json' } })
        .then((res) => {
          setUserList(res.data);
          return undefined;
        })
        // eslint-disable-next-line no-console
        .catch((error) => console.log(error.response));
    };
    fetchData();
  }, []);

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
          {userList.map((value: UserValue) => {
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
          })}
        </tbody>
      </Table>
    </div>
  );
};
