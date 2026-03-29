import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('rol', '', { expires: new Date(0), path: '/' });
  res.cookies.set('profesionalId', '', { expires: new Date(0), path: '/' });
  res.cookies.set('profesion', '', { expires: new Date(0), path: '/' });
  return res;
}
