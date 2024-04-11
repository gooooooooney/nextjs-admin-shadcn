import React from 'react'
import { SettingsTitle } from '../_components/settings-title'
import { EmailForm } from './_components/email-form'
import { getLatestUser } from '@/lib/auth'

const EmailSettingsPage = async () => {
  const userinfo = await getLatestUser()

  return (
    <div>
      <SettingsTitle title="Email" description="Change your registered email address." />
      <EmailForm initialValues={{
        email: userinfo?.email!,
      }} />
    </div>
  )
}

export default EmailSettingsPage
