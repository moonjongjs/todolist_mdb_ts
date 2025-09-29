import React, {useState} from "react";
import './scss/ConfirmModalComponent.scss';

type ConfirmModalProps = { 
  isOk: boolean;
  isOpen: boolean;
  message: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  onClickYes: (e:React.MouseEvent<HTMLButtonElement>, z:boolean) => void;
};
export default function ConfirmModalComponent({
  isOk,
  isOpen,
  message,
  onConfirm,
  onCancel,
  onClickYes
}: ConfirmModalProps) {
  if (!isOpen) return null; // 모달이 닫혀 있으면 렌더링 X
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
         {
            isOk ?
            (
                <button onClick={onCancel}>확인</button>
            ) 
            : 
            (
              <>
                <button className="confirm" onClick={(e)=>onClickYes(e, true)}>
                  예
                </button>
                <button className="cancel"  onClick={(e)=>onClickYes(e, false)}>
                  아니오
                </button>
              </>
            )
         }
        </div>
      </div>
    </div>
  );
}
