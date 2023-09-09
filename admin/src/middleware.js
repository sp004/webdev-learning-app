export { default } from "next-auth/middleware"

export const config = { matcher: ["/pending-approval/:path*", "/dashboard"] }