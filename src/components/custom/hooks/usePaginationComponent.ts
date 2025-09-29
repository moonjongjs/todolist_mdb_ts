"use client";
import { useMemo, useState } from "react";

export function usePaginationComponent({
  page,
  setPage,
  totalItems,
  listPerPage = 5,
  groupSize = 5,
}: {
  page: number;      // 전체 아이템 개수
  setPage: (value: number)=>void;      // 전체 아이템 개수
  totalItems: number;      // 전체 아이템 개수
  listPerPage?: number;    // 페이지당 아이템 개수 (default: 5)
  groupSize?: number;      // 페이지 그룹 크기 (default: 5)
}) {

  // 총 페이지 수
  const 총페이지수 = useMemo(
    () => Math.ceil(totalItems / listPerPage),
    [totalItems, listPerPage]
  );

  // 현재 그룹 번호
  const 현재그룹번호 = useMemo(
    () => Math.floor((page - 1) / groupSize),
    [page, groupSize]
  );

  // 총 그룹 수
  const 총그룹수 = useMemo(
    () => Math.ceil(총페이지수 / groupSize),
    [총페이지수, groupSize]
  );

  // 그룹 시작, 끝
  const 그룹시작 = useMemo(
    () => 현재그룹번호 * groupSize + 1,
    [현재그룹번호, groupSize]
  );
  const 그룹끝 = useMemo(
    () => Math.min(그룹시작 + groupSize - 1, 총페이지수),
    [그룹시작, groupSize, 총페이지수]
  );

  // 페이지 번호 리스트
  const 페이지번호 = useMemo(
    () => [...Array(그룹끝 - 그룹시작 + 1)].map((_, i) => 그룹시작 + i),
    [그룹시작, 그룹끝]
  );

  // 페이지 클릭 핸들러
  const onClickPage = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    n: number
  ) => {
    e.preventDefault();
    setPage(n);
  };

  return {
    총페이지수,
    현재그룹번호,
    총그룹수,
    그룹시작,
    그룹끝,
    페이지번호,
    onClickPage,
  };
}
