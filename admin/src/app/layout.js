import AuthProvider from "@/components/AuthProvider/AuthProvider"
import '../styles/_globals.scss'
import { Poppins } from 'next/font/google'
import { Toaster } from "react-hot-toast"
import Navbar from "@/components/Navbar/Navbar"
import { getServerSession } from "next-auth"
import { options } from "./api/auth/[...nextauth]/options"
import { redirect } from "next/navigation"

const poppins = Poppins({ 
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap'
})

export const metadata = {
  title: 'Dashboard',
  description: 'Dashboard for admin paenl',
}
 
export default async function RootLayout({ children }) {
  const session = await getServerSession(options)
  console.log("🤣", session?.user)

  if(!session) {
    return redirect('/api/auth/signin/callbackUrl')
  }
 return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <Navbar />
          {session?.user && 
          <main>
            {children}
          </main>}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
