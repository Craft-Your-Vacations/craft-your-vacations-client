"use client";

import { useMutation } from "@tanstack/react-query";
import { emailApi } from "@/lib/endpoints";
import type { SendChangeEmailRequest } from "@/app/types/api";

export function useSendChangeEmail() {
  return useMutation({
    mutationFn: (body: SendChangeEmailRequest) => emailApi.sendChange(body),
  });
}
