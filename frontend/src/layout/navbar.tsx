import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

interface NavigationButton {
  to: string;
  title: string;
}

export const NavButton: React.FC<NavigationButton> = (
  props: NavigationButton
): JSX.Element => {
  const { to, title } = props;
  return (
    <LinkContainer to={to}>
      <Nav.Link>
        <Button variant="primary">{title}</Button>
      </Nav.Link>
    </LinkContainer>
  );
};

export const NavigationBar: React.FC = () => {
  return (
    <div>
      <NavButton to="/" title="Home" />
    </div>
  );
};
