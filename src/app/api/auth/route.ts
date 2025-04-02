import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, hashPassword } from '@/lib/auth/password';
import { createUser, findUserByEmail } from '@/lib/db/user';
import { generateToken, verifyToken } from '@/lib/auth/jwt';
import { User, LoginCredentials, RegisterUserData } from '@/types/user';

export async function POST(req: NextRequest) {
  const path = req.nextUrl.pathname;

  switch (path) {
    case '/api/auth/login':
      return handleLogin(req);
    case '/api/auth/register':
      return handleRegister(req);
    case '/api/auth/reset-password':
      return handlePasswordReset(req);
    default:
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
}

async function handleLogin(req: NextRequest) {
  try {
    const { email, password } = await req.json() as LoginCredentials;
    
    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Set cookie with token
    const response = NextResponse.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

async function handleRegister(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json() as RegisterUserData;
    
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      role: role || UserRole.VIEWER
    });

    return NextResponse.json({ 
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role 
      } 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

async function handlePasswordReset(req: NextRequest) {
  // Implement password reset logic
  // 1. Verify email
  // 2. Generate reset token
  // 3. Send reset email
  // 4. Allow password update
}