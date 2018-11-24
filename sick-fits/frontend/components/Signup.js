import { Mutation } from 'react-apollo';
import { withStateHandlers } from 'recompose';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const withFormState = withStateHandlers(
  { email: '', name: '', password: '' },
  {
    onChange: () => (e) => {
      e.preventDefault();
      const { name, value } = e.target;
      return { [name]: value };
    },
    reset: () => () => ({ email: '', name: '', password: '' }),
  },
);

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MATATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

const Signup = ({
  email, password, name, onChange, reset,
}) => (
  <Mutation mutation={SIGNUP_MUTATION} variables={{ email, password, name }}>
    {(signup, { error, loading }) => (
      <Form
        method="post"
        onSubmit={async (e) => {
          e.preventDefault();
          await signup();
          reset();
        }}
      >
        <fieldset disabled={loading} aria-busy={loading}>
          <Error error={error} />
          <h2>Sign up for an account</h2>
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              placeholder="email"
              value={email}
              onChange={onChange}
            />
          </label>
          <label htmlFor="name">
            Name
            <input type="text" name="name" placeholder="name" value={name} onChange={onChange} />
          </label>
          <label htmlFor="password">
            Password
            <input
              type="password"
              name="password"
              placeholder="password"
              value={password}
              onChange={onChange}
            />
          </label>
        </fieldset>
        <button type="submit">Sign Up!</button>
      </Form>
    )}
  </Mutation>
);

export default withFormState(Signup);
