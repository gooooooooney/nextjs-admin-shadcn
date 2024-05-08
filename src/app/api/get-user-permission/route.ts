import { getMenusByUserId } from "@/server/data/menu";
import { getUserByEmail } from "@/server/data/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

  const params = request.nextUrl.searchParams
  const email = params.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const userinfo = await getUserByEmail(email);
  if (!userinfo) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const menus = await getMenusByUserId(userinfo.id);

  return NextResponse.json({ menus, role: userinfo?.role.userRole, superAdmin: userinfo?.role.superAdmin});


}