// "use client"

import { signIn, useSession } from 'next-auth/react'
// import { useRouter } from 'next/navigation'
import './Login.scss'
import { getServerSession } from 'next-auth'
import { options } from './api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'
import Link from 'next/link'
// import { useEffect } from 'react'

const LoginPage = async () => {
  // const {data: session, status} = useSession()
  // const router = useRouter()
  // console.log("🤣", status)

  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     router?.push('/pending-approval')
  //   }
  // }, [status, router])

  // if (status === "loading" && session) {
  //   return <p className='loader'>Welcome to Admin Panel...</p>;
  // }
  // const session = await getServerSession(options)
  // console.log("🤣", session?.user)

  // if(!session) {
  //   return redirect('/api/auth/signin/callbackUrl=/pending-approval')
  // }
  // if (status === "unauthenticated") {
    return (
      <div className='login'>
        <div> 
          <h2>Welcome to Webdev Skool Admin Dashboard</h2>
          <Link href='/pending-approval'>Pending Approval</Link>
          {/* <button onClick={() => signIn("github")}>Sign in with <BsGithub className='github' /></button> */}
        </div>
      </div>
    )
  // }
}

export default LoginPage