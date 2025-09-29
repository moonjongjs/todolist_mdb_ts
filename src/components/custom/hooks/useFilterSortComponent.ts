"use client";
import { useState, useRef } from "react";
import { 할일목록Type } from "@/components/custom/types/todo";

export function useFilterSortComponent( 
  {setPage}:{setPage:(value:number)=>void},  
  onSearchCallback: (조건: {period: string;condition: string;keyword: string;}) => 할일목록Type[]
) {
  // 상태값
  const [period, setPeriod] = useState("전체기간");
  const [condition, setCondition] = useState("할일");
  const [keyword, setKeyword] = useState("");
  const [검색결과, set검색결과] = useState<할일목록Type[]>([]);
  const [sort, setSort] = useState("newest"); // 최근 추가
  const todoSearchRef = useRef<HTMLInputElement | null>(null);

  // 검색 실행
  const onSearch = () => {
    const result = onSearchCallback({ period, condition, keyword });
    set검색결과(result);
    setPage(1);
  };

  // 검색 초기화
  const resetSearch = () => {
    set검색결과([]);
    setKeyword("");
    setPeriod("전체기간");
    setCondition("할일");
    setPage(1);
  };

  return {
    period,
    setPeriod,
    condition,
    setCondition,
    todoSearchRef,
    keyword,
    setKeyword,
    검색결과,
    set검색결과,
    sort,
    setSort,
    onSearch,
    resetSearch,
    setPage
  };
}
