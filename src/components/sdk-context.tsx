"use client";
import type { PayloadSDK } from "@payloadcms/sdk";
import { createContext } from "react";

export const SdkCtx = createContext<PayloadSDK|null>(null);