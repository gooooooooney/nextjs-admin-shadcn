"use client";

import { useCallback, useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { FormError } from "@/components/form-error";
import { newVerification } from "@/action/auth";
import { FormSuccess } from "@/components/form-succcess";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      })
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex items-center w-full justify-center">
      {!success && !error && (
        <FadeLoader />
      )}
      <FormSuccess message={success} />
      {!success && (
        <FormError message={error} />
      )}
    </div>
  )
}