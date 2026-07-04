"use client";

import { useMutation } from "@tanstack/react-query";
import { emailApi } from "@/lib/endpoints";

export function useSendEmailVerification() {
  return useMutation({ mutationFn: () => emailApi.sendVerification() });
}
