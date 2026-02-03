"use client";
import { createContext, type ReactNode, useContext, useState } from "react";
import type { TTable } from "./types";

// interface IGenericContextProps<T> {
//   value: T;
//   setter: (value: T) => void;
// }

type TGenericContextProps<T> = [T, (value: T) => void];

export function createGenericContext<T>() {
  const Context = createContext<TGenericContextProps<T> | undefined>(undefined);

  type ProviderProps = {
    children: ReactNode;
    defaultValue: T;
  };

  const Provider = ({ children, defaultValue }: ProviderProps) => {
    const [value, setValue] = useState<T>(defaultValue);

    return (
      <Context.Provider value={[value, setValue]}>{children}</Context.Provider>
    );
  };

  const useGenericContext = () => {
    const ctx = useContext(Context);
    if (!ctx)
      throw new Error("useGenericContext must be used within its Provider");
    return ctx;
  };

  return [useGenericContext, Provider] as const;
}

export const [useTableSwitcherContext, TableSwitcherContextProvider] =
  createGenericContext<true>();

export const [useCurrentTableContext, CurrentTableContextProvider] =
  createGenericContext<TTable>();
