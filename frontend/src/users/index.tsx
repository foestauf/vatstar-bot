// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import axios, { AxiosResponse } from 'axios';
import React, { FunctionComponent, useState } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { useQuery } from 'react-query';
// Using require statement until I can resolve type errors as an import
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lodash = require('lodash');

interface ModalProps {
  onHide: () => void;
  show: boolean;
  name: string;
  vatsimId: string;
}

const UserModal = (props: ModalProps): JSX.Element => {
  return (
    <Modal
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            VatSIM user details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>User</h4>
          <p>This is my modal body</p>
          <p>Username: {props.name}</p>
          <p>Vat Sim ID: {props.vatsimId}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </>
    </Modal>
  );
};

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
  const [modalShow, setModalShow] = useState(false);
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
                  <Button variant="primary" onClick={() => setModalShow(true)}>
                    <td>{value.vatsimId}</td>
                  </Button>

                  <td>{value.name}</td>
                  <td>{ratings}</td>

                  <td>{value.lastSeen}</td>
                  <UserModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    name={value.name}
                    vatsimId={value.vatsimId}
                  />
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};
