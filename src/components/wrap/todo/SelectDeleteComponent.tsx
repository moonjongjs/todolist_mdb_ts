import React from "react";

interface Props {
  완료된개수: number;
  onClickCheckDeleteBtn: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function SelectDeleteComponent({
  완료된개수,
  onClickCheckDeleteBtn,
}: Props) {
  return (
    <div className="foot-button-box">
      <button
        onClick={onClickCheckDeleteBtn}
        className={`check-delete-btn ${완료된개수 > 0 ? "on" : ""}`}
      >
        선택삭제
      </button>
    </div>
  );
}
