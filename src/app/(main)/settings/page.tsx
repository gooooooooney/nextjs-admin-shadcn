import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "./_components/profile-form"
import { getLatestUser } from "@/lib/auth"

const SettingPage = async () => {
  const userinfo = await getLatestUser()

  console.log(userinfo)

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Profile</h3>
        <p className='text-sm text-muted-foreground'>
          This is how others will see you on the site.
        </p>
      </div>
      <Separator className='my-4' />
      <ProfileForm initialValues={{
        username: userinfo?.name!,
        email: userinfo?.email!,
        image: userinfo?.image || "",
      }} />
    </div>
  )
}

export default SettingPage