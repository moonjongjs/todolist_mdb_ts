"use client";
import { useState } from "react";

export function useConfirmModalComponent() {
  const [isOk, setIsOk] = useState(false); // 확인 버튼만 있는 모달 여부
  const [isOpen, setIsOpen] = useState(false); // 모달 열림 상태
  const [message, setMessage] = useState<string | null>(null); // 모달 메시지
  const [targetId, setTargetId] = useState<any>(null); // 삭제/수정 대상 데이터

  // 모달 열기
  const openModal = (msg: string, targetData: any = null, okOnly = false) => {
    setIsOpen(true);
    setTargetId(targetData);
    setMessage(msg);
    setIsOk(okOnly);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsOpen(false);
    setTargetId(null);
    setMessage(null);
    setIsOk(false);
  };

  return {
    isOk,
    isOpen,
    message,
    targetId,
    openModal,
    closeModal,
  };
}
