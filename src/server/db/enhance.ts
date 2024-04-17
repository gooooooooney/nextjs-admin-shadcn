
import type { GetServerSidePropsContext } from 'next';
import { currentUser } from '@/lib/auth';
import { enhance } from '@zenstackhq/runtime';
import { db } from '../db';


export async function getEnhancedPrisma() {
  const user = await currentUser();
  return {
    db: enhance(
      db,
      { user },
    ),
    user
  }
}