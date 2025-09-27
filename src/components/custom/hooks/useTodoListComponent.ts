"use client";
import { useState, useRef } from "react";
import { 할일목록Type } from "@/components/custom/types/todo";
import { format } from "date-fns";
import axios from "axios";

export function useTodoListComponent({
  set할일목록,
  openModal,
  setUpdate,
}: {
  set할일목록: (value: 할일목록Type[]) => void;
  openModal: (msg: string, targetData?: any, okOnly?: boolean) => void;
  setUpdate: React.Dispatch<React.SetStateAction<할일목록Type | 할일목록Type[] | null>>;
}) {
  // 수정 상태 관리
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [expires, setExpires] = useState<string>(
    format(new Date(), "yyyy-MM-dd HH:mm")
  );

  const editTextRef = useRef<HTMLInputElement | null>(null);

  // D-Day 계산
  const getDDay = (expires: Date | null): { label: string; color: string } => {
    if (!expires) return { label: "", color: "inherit" };
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exp = new Date(expires);
    exp.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (exp.getTime() - today.getTime()) / 86400000
    );

    if (diffDays > 0) return { label: `[D-${diffDays}]`, color: "green" };
    if (diffDays === 0) return { label: "[D-DAY]", color: "orange" };
    return { label: "[만료]", color: "#c00" };
  };

  // 수정 버튼 클릭 → 수정 모드
  const onClickEdit = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    item: 할일목록Type
  ) => {
    e.preventDefault();
    if (editId === null) {
      setEditId(item.아이디);
      setEditText(item.할일);
      setExpires(item.만료일 ? format(new Date(item.만료일), "yyyy-MM-dd HH:mm") : "");
      editTextRef.current?.focus();
    } else {
      saveEdit(item);
    }
  };

  // 수정 저장
  const saveEdit = async (item: 할일목록Type) => {
    if (editText.trim() === "") {
      openModal("수정할 내용을 입력하세요.", null, true);
      return;
    }
    try {
      const obj = { ...item, 할일: editText, 만료일: new Date(expires) };
      await axios.put("/api/todos", obj);
      const res = await axios.get("/api/todos");
      set할일목록(res.data);
      setEditId(null);
      setEditText("");
    } catch (err: any) {
      openModal("수정 실패", null, true);
      console.error(err.response?.data || err.message);
    }
  };

  // 입력 변경
  const onChangeEditText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  // 엔터 → 저장
  const onKeyDownEditText = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && editId) {
      saveEdit({ 아이디: editId, 할일: editText } as 할일목록Type);
    }
  };

  // 체크박스 완료 여부 토글
  const onChangeCheckEvent = async (
    e: React.ChangeEvent<HTMLInputElement>,
    item: 할일목록Type
  ) => {
    try {
      const obj = { ...item, 완료: e.target.checked };
      await axios.put("/api/todos", obj);
      const res = await axios.get("/api/todos");
      set할일목록(res.data);
    } catch (err: any) {
      openModal("완료 변경 실패", null, true);
      console.error(err.response?.data || err.message);
    }
  };

  // 삭제 버튼
  const onClickDeleteBtn = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: 할일목록Type
  ) => {
    e.preventDefault();
    const obj = { ...item, 삭제: true };
    setUpdate(obj); 
    openModal("정말 삭제하시겠습니까?", obj, false);
  };

  // 복구 버튼
  const onClickRestoreBtn = async (
    e: React.MouseEvent<HTMLButtonElement>,
    item: 할일목록Type
  ) => {
    e.preventDefault();
    try {
      const obj = { ...item, 삭제: false };
      await axios.put("/api/todos", obj);
      const res = await axios.get("/api/todos");
      set할일목록(res.data);
    } catch (err: any) {
      openModal("복구 실패", null, true);
      console.error(err.response?.data || err.message);
    }
  };

  return {
    editId,
    editText,
    editTextRef,
    expires,
    setExpires,
    getDDay,
    onClickEdit,
    onChangeEditText,
    onKeyDownEditText,
    onChangeCheckEvent,
    onClickDeleteBtn,
    onClickRestoreBtn,
  };
}