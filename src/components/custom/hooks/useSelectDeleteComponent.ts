"use client";
import { useMemo } from "react";
import { 할일목록Type } from "@/components/custom/types/todo";
import axios from "axios";

export function useSelectDeleteComponent({
  할일목록,
  set할일목록,
  openModal,
}: {
  할일목록: 할일목록Type[];
  set할일목록: (value: 할일목록Type[]) => void;
  openModal: (msg: string, targetData?: any, okOnly?: boolean) => void;
}) {
  // ✅ 완료된 항목 개수 계산 (메모이제이션)
  const 완료된개수 = useMemo(
    () => 할일목록.filter((item) => item.완료 === true).length,
    [할일목록]
  );

  // ✅ 선택 삭제 실행
  const onClickCheckDeleteBtn = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const targetList = 할일목록
      .filter((item) => item.완료 === true)
      .map((item) => ({ ...item, 삭제: true }));

    if (targetList.length === 0) {
      openModal("완료된 항목이 없습니다.", null, true);
      return;
    }

    try {
      await axios.put("/api/todos", targetList);
      openModal("선택된 항목이 삭제되었습니다.", null, true);
      const res = await axios.get("/api/todos");
      set할일목록(res.data);
    } catch (err: any) {
      openModal("❌ 선택 삭제 실패", null, true);
      console.error(err.response?.data || err.message);
    }
  };

  return {
    완료된개수,
    onClickCheckDeleteBtn,
  };
}
