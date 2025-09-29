import React from "react";

interface Props {
  완료된개수: number;
  showDeleted: boolean;
  onClickCheckDeleteBtn: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClickCheckDeleteBtn2: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function SelectDeleteComponent({
  완료된개수,
  showDeleted,
  onClickCheckDeleteBtn,
  onClickCheckDeleteBtn2
}: Props) {
  return (
    <div className="foot-button-box">
      {
        showDeleted ?       
            ( <button
                onClick={onClickCheckDeleteBtn2}
                className={`check-delete-btn ${완료된개수 > 0 ? "on" : ""}`}
              >
                선택삭제
              </button>)
          :
            ( <button
                onClick={onClickCheckDeleteBtn}
                className={`check-delete-btn ${완료된개수 > 0 ? "on" : ""}`}
              >
                선택삭제
              </button>)

      }
    </div>
  );
}
