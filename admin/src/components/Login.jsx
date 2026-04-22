import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Header,
  Title,
  Subtitle,
  Form,
  Label,
  InputContainer,
  Input,
  CheckboxContainer,
  Checkbox,
  CheckboxText,
  LinkStyled,
  Button,
  Footer,
  FooterText,
  FooterLink,
  Copyright,
  LoginCardContainer,
  LoginCard,
} from './UI/styles';
import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock } from 'lucide-react';

export function Login() {
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
      const { token } = await request('/auth/login', {
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
    <Container bgFrom="#3b82f6" bgTo="#9333ea">
      <LoginCardContainer>
        <LoginCard>
          <Header>
            <Title>Welcome Back</Title>
            <Subtitle>Sign in to your account</Subtitle>
          </Header>

          <Form gap="1.5rem" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <InputContainer>
                {/* <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                <Input
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="you@example.com"
                  focusColor="#3b82f6"
                />
              </InputContainer>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <InputContainer>
                {/* <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                <Input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Enter your password"
                  focusColor="#3b82f6"
                />
              </InputContainer>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <CheckboxContainer>
                <Checkbox name="remember" onChange={handleChange} type="checkbox" color="#2563eb" />
                <CheckboxText>Remember me</CheckboxText>
              </CheckboxContainer>
              <LinkStyled href="#" color="#2563eb" hoverColor="#1d4ed8">
                Forgot password?
              </LinkStyled>
            </div>

            <Button type="submit" bg="#2563eb" hoverBg="#1d4ed8" disabled={loading}>
              Sign In
            </Button>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          </Form>

          <Footer>
            <FooterText>
              Don't have an account?{' '}
              <FooterLink to="/register" color="#2563eb" hoverColor="#1d4ed8">
                Sign up
              </FooterLink>
            </FooterText>
          </Footer>
        </LoginCard>

        <Copyright>© 2026 Appointments Admin. All rights reserved.</Copyright>
      </LoginCardContainer>
    </Container>
  );
}
