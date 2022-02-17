import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest, event: NextFetchEvent) => {
  const authCookie = req.cookies?.["connect.sid"];

  if (!authCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
};
