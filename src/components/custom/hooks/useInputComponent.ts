"use client";
import { useState, useRef } from "react";
import { format } from "date-fns";

export function useInputComponent(
    onSave: (할일: string, expires: string) => void, 
    { openModal }: { openModal: (msg: string, targetData?: any, okOnly?: boolean) => void }
) {

  const [할일, set할일] = useState<string>("");
  const [expires, setExpires] = useState<string>(format(new Date(), "yyyy-MM-dd HH:mm"));
  const todoInputRef = useRef<HTMLInputElement | null>(null);

  // 입력 변경
  const onChangeTodoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    set할일(e.target.value);
  };

  // 엔터 입력 → 저장 실행
  const onKeyDownTodoInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveEvent();
    }
  };

  // 버튼 클릭 → 저장 실행
  const onClickSaveBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    saveEvent();
  };

  // 저장 로직
  const saveEvent = () => {
    if (할일.trim() === "") {
    //   alert("할 일을 입력하세요!");
      openModal("할 일을 입력하세요!", null, true);
      todoInputRef.current?.focus();
      return;
    }
    onSave(할일, expires); // 부모에서 전달받은 저장 로직 실행
    set할일(""); // 입력 초기화
    todoInputRef.current?.focus();
  };

  return {
    할일,
    expires,
    setExpires,
    todoInputRef,
    onChangeTodoInput,
    onKeyDownTodoInput,
    onClickSaveBtn,
  };
}
