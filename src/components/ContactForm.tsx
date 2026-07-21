'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message')
      }

      setIsSuccess(true)
    } catch (error) {
      console.error('[ContactForm] Submission error:', error)
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong sending your message.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success replaces the form; social links in the section remain the escape hatch (FR-R14)
  if (isSuccess) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-[200px] items-center rounded-panel border border-teal-deep bg-panel p-6"
      >
        <p className="font-mono text-sm text-teal">message queued — I&apos;ll reply soon</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-[12.5px] font-medium text-text-secondary"
          >
            Name{' '}
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <Input
            id="name"
            autoComplete="name"
            aria-required="true"
            {...register('name')}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-destructive" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-[12.5px] font-medium text-text-secondary"
          >
            Email{' '}
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-required="true"
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-destructive" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-[12.5px] font-medium text-text-secondary"
        >
          Message{' '}
          <span aria-hidden="true" className="text-destructive">
            *
          </span>
          <span className="sr-only">(required)</span>
        </label>
        <Textarea
          id="message"
          rows={5}
          aria-required="true"
          {...register('message')}
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-destructive" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage} Please try again, or reach me via the links instead.
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="min-h-[44px] justify-self-start bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary-hover"
      >
        {isSubmitting ? <span className="font-mono text-sm">sending…</span> : 'Send message'}
      </Button>
    </form>
  )
}
