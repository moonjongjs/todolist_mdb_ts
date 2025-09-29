"use client";
import { useState, useRef } from "react";
import { 할일목록Type } from "@/components/custom/types/todo";
import { format } from "date-fns";
import axios from "axios";

export function useTodoListComponent({
  isYes,
  할일,
  할일목록,
  set할일목록,
  openModal,
  setUpdate,
  todoInputRef,
}: {
  isYes: boolean;
  할일: string;
  할일목록: 할일목록Type[];
  set할일목록: (value: 할일목록Type[]) => void;
  openModal: (msg: string, targetData?: any, okOnly?: boolean) => void;
  setUpdate: React.Dispatch<
    React.SetStateAction<할일목록Type | 할일목록Type[] | null>
  >;
  todoInputRef: React.RefObject<HTMLInputElement>;
}) {
  // 수정 상태 관리
  const [edit, setEdit] = useState<할일목록Type | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  // const [expires2, setExpires2] = useState<string>(new Date().toISOString().slice(0, 16));
  // ✅ datetime-local과 맞는 포맷 ("yyyy-MM-dd'T'HH:mm")  
  const [expires2, setExpires2] = useState<string>(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const editTextRef = useRef<HTMLInputElement | null>(null);

  // D-Day 계산
  const getDay = (expires: Date | null): { label: string; color: string } => {
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
      setEdit(item);
      setEditId(item.아이디);
      setEditText(item.할일);
      // ✅ 수정 모드 진입 시에도 T 포함 포맷
      setExpires2(
        item.만료일
          ? format(new Date(item.만료일), "yyyy-MM-dd'T'HH:mm")
          : ""
      );
      editTextRef.current?.focus();
    } else {
      saveEvent();
    }
  };

    // CRUD 이벤트 핸들러 (저장, 체크박스, 삭제 등)
    // 할일저장함수
    const saveEvent = async () => {
        
        if(editId!==null){
          if(editText===''){
              alert('수정 입력상자 할일을 입력하세요!');
              return;
          }
          const obj = {
            ...edit,
            할일: editText,
            만료일: expires2, // ✅ 그대로 전달
          };

          await axios.put("/api/todos", obj);
          const res = await axios.get("/api/todos");
          set할일목록(res.data);
          setEditId(null);
          setEditText("");
          setExpires2("");
          todoInputRef.current?.focus();
      }   
    }

  // 입력 변경
  const onChangeEditText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  // 엔터 → 저장
  const onKeyDownEditText = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editId) {
      saveEvent();
    }
  };

  // 날짜변경 변경
  const onChangeSetExpires = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpires2(e.target.value);
  };
  // 날짜변경 변경
  const onKeyDownSetExpires = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editId) {
      saveEvent();
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
  const onClickDeleteBtn = async (
    e: React.MouseEvent<HTMLButtonElement>,
    item: 할일목록Type
  ) => {
    e.preventDefault();

    const confirm = await openModal("정말 삭제 하시겠습니까?", null, false);

    if (Boolean(confirm)) {
      try {
        const obj = { ...item, 삭제: true };
        await axios.put("/api/todos", obj);
        const res = await axios.get("/api/todos");
        set할일목록(res.data);
      } catch (err: any) {
        openModal("복구 실패", null, true);
        console.error(err.response?.data || err.message);
      }
    }
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


  
  // 완전 삭제 버튼
  const onClickDeleteBtn2 = async (
    e: React.MouseEvent<HTMLButtonElement>,
    item: 할일목록Type
  ) => {
    e.preventDefault();
                
    const confirm = await openModal("완전 삭제 되어 복원 할 수없습니다.\n그래도 정말 삭제 하시겠습니까?", null, false);

    if (Boolean(confirm)) {
      await axios.delete("/api/todos", {
        data: { 아이디: item.아이디 }
      });
      const res = await axios.get("/api/todos");
      set할일목록(res.data);
    }
  };

  return {
    editId,
    editText,
    editTextRef,
    expires2,
    setExpires2,
    getDay,
    onClickEdit,
    onChangeEditText,
    onKeyDownEditText,
    onChangeSetExpires,
    onKeyDownSetExpires,
    onChangeCheckEvent,
    onClickDeleteBtn,
    onClickRestoreBtn,
    onClickDeleteBtn2
  };
}
