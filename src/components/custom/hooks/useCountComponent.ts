import React, { Dispatch, SetStateAction } from "react";

interface CountHookProps {
  setShowDeleted: Dispatch<SetStateAction<boolean>>;
  setPage: Dispatch<SetStateAction<number>>;
}

export function useCountComponent({ setShowDeleted, setPage }: CountHookProps) {
  const onClickRestore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowDeleted((prev) => !prev);
    setPage(1);
  };

  return { onClickRestore };
}
