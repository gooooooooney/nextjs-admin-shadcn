"use client"
import { updateProfile } from '@/action/user'
import { Button, LoadingButton } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getUpdatedFields } from '@/lib/object-utils'
import { ProfileSchema } from '@/schema/settings'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { isExecuting } from 'next-safe-action/status'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { isEmpty } from 'radash'
import { DrawerDialog } from '@/components/ui/custom/drawer-dialog'
import { ImageUpload } from '@/components/ui/custom/image-upload'
import UserCard from './user-card'

type ProfileProps = {
  initialValues: ProfileSchema
}

export const ProfileForm = ({ initialValues }: ProfileProps) => {

  const { execute, status } = useAction(updateProfile, {
    onSuccess: (res) => {
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(res.success)
      }
    },
    onError: (e) => {
      console.log(e)
      toast.error(e.fetchError || e.serverError || 'An error occurred')
    }
  })

  const isPending = isExecuting(status);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      ...initialValues
    }
  })

  const onSubmit = (data: ProfileSchema) => {
    const reqData = getUpdatedFields(initialValues, data)
    if (isEmpty(reqData)) return toast.error('No changes made')
    execute(reqData as Required<typeof reqData>)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='username' {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a verified email to display' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={initialValues.email!}>{initialValues.email}</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified email addresses in your{' '}
                <Link href='/examples/forms'>email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input placeholder='image url' className='hidden' {...field} />
                {/* <ImageUpload /> */}
              </FormControl>
              <UserCard onChange={field.onChange} src={initialValues.image} />
              <FormDescription>
                This image will be displayed on your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton isPending={isPending}>Update profile</LoadingButton>
      </form>
    </Form>
  )
}
