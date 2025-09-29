"use client";
import { useState, useRef } from "react";

export function useConfirmModalComponent({isYes, setIsYes}:{isYes:boolean, setIsYes: (value: boolean)=>void}) {
  const [isOk, setIsOk] = useState(false); // 확인 버튼만 있는 모달 여부
  const [isOpen, setIsOpen] = useState(false); // 모달 열림 상태
  const [message, setMessage] = useState<string | null>(null); // 모달 메시지
  const [targetId, setTargetId] = useState<any>(null); // 삭제/수정 대상 데이터

  // resolve 저장용 ref
  const resolverRef = useRef<((value: boolean) => void) | null>(null);


  // 모달 열기
const openModal = (msg: string, targetData: any = null, okOnly = false): Promise<boolean> => {
  setIsOpen(true);
  setTargetId(targetData);
  setMessage(msg);
  setIsOk(okOnly);

  return new Promise<boolean>((resolve) => {
    resolverRef.current = resolve;
  });
};

  // 모달 닫기
  const closeModal = () => {
    setIsOpen(false);
    setTargetId(null);
    setMessage(null);
    setIsOk(false);
  };
 
 const onClickYes=(e:React.MouseEvent<HTMLButtonElement>, z:boolean)=>{
    e.preventDefault();
    if (resolverRef.current) {
      resolverRef.current(z); // Promise resolve
      resolverRef.current = null;
    }
    closeModal();
 }
  return {
    isOk,
    isOpen,
    message,
    targetId,
    openModal,
    closeModal,
    onClickYes
  };
}
