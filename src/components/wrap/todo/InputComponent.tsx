import React from 'react';

interface Props {
  onKeyDownTodoInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChangeTodoInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  할일: string;
  todoInputRef: React.RefObject<HTMLInputElement>;
  expires: string;
  setExpires: (value: string) => void;
  onClickSaveBtn: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function InputComponent({
  onKeyDownTodoInput,
  onChangeTodoInput,
  할일,
  todoInputRef,
  expires,
  setExpires,
  onClickSaveBtn,
}: Props) {
    return (
        <div className="input-container">

            {/* 입력 상자 */}
            <input                         
                type="text" 
                name='todoInput'
                id='todoInput'
                placeholder='+ 할 일 추 가'

                onKeyDown={onKeyDownTodoInput}  
                onChange={onChangeTodoInput}
                value={할일}
                ref={todoInputRef}
            />

            <input
                type="datetime-local"
                className="datetime-local"
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
            />

            {/* 저장 버튼 */}
            <button 
                type='button'
                className='save-btn'
                onClick={onClickSaveBtn}
            ><i className="bi bi-plus-lg"></i></button>

        </div>
    );
}