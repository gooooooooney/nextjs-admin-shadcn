import { currentUser } from "@/lib/auth";
import { getUserPermissions } from "@/server/data/permissions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

  const params = request.nextUrl.searchParams
  const email = params.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const permissions = await getUserPermissions({ email });
  if (!permissions) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ menus: permissions?.role.menus, role: permissions?.role.userRole, superAdmin: permissions?.role.superAdmin});


}