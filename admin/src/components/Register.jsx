import { Link, useNavigate } from 'react-router';
import {
  Container,
  LoginCardContainer,
  LoginCard,
  Header,
  Title,
  Subtitle,
  Form,
  Label,
  InputContainer,
  Input,
  CheckboxContainer,
  Checkbox,
  CheckboxLabel,
  LinkStyled,
  Button,
  Footer,
  FooterText,
  FooterLink,
  Copyright,
} from './UI/styles';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { useState } from 'react';
// import { Mail, Lock, User, Building } from 'lucide-react';

export function Register() {
  const { login } = useAuth();
  const { request, loading, error } = useApi();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      login(token);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <Container bgFrom="#a855f7" bgTo="#ec4899">
      <LoginCardContainer>
        <LoginCard>
          <Header>
            <Title>Create Account</Title>
            <Subtitle>Sign up to get started</Subtitle>
          </Header>

          <Form onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <InputContainer>
                {/* <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="John Doe"
                  focusColor="#a855f7"
                  onChange={handleChange}
                />
              </InputContainer>
            </div>

            <div>
              <Label htmlFor="organization">Organization</Label>
              <InputContainer>
                {/* <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                <Input
                  type="text"
                  id="organization"
                  placeholder="Your clinic or hospital"
                  focusColor="#a855f7"
                />
              </InputContainer>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <InputContainer>
                {/* <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                <Input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  id="email"
                  placeholder="you@example.com"
                  focusColor="#a855f7"
                />
              </InputContainer>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <InputContainer>
                {/* <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Create a password"
                  focusColor="#a855f7"
                  onChange={handleChange}
                />
              </InputContainer>
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <InputContainer>
                {/* <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                <Input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm your password"
                  focusColor="#a855f7"
                />
              </InputContainer>
            </div>

            <CheckboxContainer>
              <Checkbox type="checkbox" id="terms" color="#9333ea" />
              <CheckboxLabel htmlFor="terms">
                I agree to the{' '}
                <LinkStyled href="#" color="#9333ea" hoverColor="#7c3aed">
                  Terms of Service
                </LinkStyled>{' '}
                and{' '}
                <LinkStyled href="#" color="#9333ea" hoverColor="#7c3aed">
                  Privacy Policy
                </LinkStyled>
              </CheckboxLabel>
            </CheckboxContainer>

            <Button type="submit" bg="#9333ea" hoverBg="#7c3aed" disabled={loading}>
              Create Account
            </Button>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          </Form>

          <Footer>
            <FooterText>
              Already have an account?{' '}
              <FooterLink to="/login" color="#9333ea" hoverColor="#7c3aed">
                Sign in
              </FooterLink>
            </FooterText>
          </Footer>
        </LoginCard>

        <Copyright>© 2026 Appointments Admin. All rights reserved.</Copyright>
      </LoginCardContainer>
    </Container>
  );
}
