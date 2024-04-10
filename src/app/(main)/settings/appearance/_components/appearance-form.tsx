"use client"
import React from 'react'
import { ThemeSkeleton } from './theme-skeleton'
import { useForm } from 'react-hook-form'
import { AppearanceSchema } from '@/schema/settings'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { LoadingButton } from '@/components/ui/button'
import { updatePreferences } from '@/action/user'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { isExecuting } from 'next-safe-action/status'
import { getUpdatedFields } from '@/lib/object-utils'
import { isEmpty } from 'radash'
import { useTheme } from 'next-themes'

type AppearanceFormProps = {
  initialValues: AppearanceSchema
}
export const AppearanceForm = ({ initialValues }: AppearanceFormProps) => {
  const { setTheme } = useTheme();

  const { execute, status } = useAction(updatePreferences, {
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

  const isPending = isExecuting(status)

  const form = useForm<AppearanceSchema>({
    resolver: zodResolver(AppearanceSchema),
    defaultValues: {
      ...initialValues
    }
  })
  const submit = (data: AppearanceSchema) => {
    const reqData = getUpdatedFields(initialValues, data)
    if (isEmpty(reqData)) return toast.error('No changes made')
    execute(reqData as Required<typeof reqData>)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='theme'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Theme</FormLabel>
              <FormDescription>
                Select the theme for the dashboard.
              </FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={(theme) => {
                  setTheme(theme)
                  field.onChange(theme)
                }}
                defaultValue={field.value}
                className='grid max-w-xl grid-cols-1 md:grid-cols-3 gap-8 pt-2'
              >
                <FormItem>
                  <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                    <FormControl>
                      <RadioGroupItem value='light' className='sr-only' />
                    </FormControl>
                    <ThemeSkeleton theme='light' />
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                    <FormControl>
                      <RadioGroupItem value='dark' className='sr-only' />
                    </FormControl>
                    <ThemeSkeleton theme='dark' />
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                    <FormControl>
                      <RadioGroupItem value='system' className='sr-only' />
                    </FormControl>
                    <ThemeSkeleton theme='system' />
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        >

        </FormField>
        <LoadingButton isPending={isPending}>Update preferences</LoadingButton>
      </form>
    </Form>
  )
}
