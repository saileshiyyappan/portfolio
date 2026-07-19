import { NextResponse } from 'next/server';
import { getAllProjectsFromCMS } from '@/lib/projectLoader';

export async function GET() {
  const projects = await getAllProjectsFromCMS();
  return NextResponse.json(projects);
}
