import React from 'react';
import { 할일목록Type } from '@/components/custom/types/todo';
import {format} from 'date-fns';

interface Props {
    정렬된목록: 할일목록Type[];
    page: number;
    list: number;
    할일목록: 할일목록Type[];
    슬라이스: 할일목록Type[];
    onChangeCheckEvent: (e: React.ChangeEvent<HTMLInputElement>, item: 할일목록Type) => void;
    editId: string | null;
    onKeyDownEditText: (e:React.KeyboardEvent<HTMLInputElement>) => void;
    onChangeEditText: (e:React.ChangeEvent<HTMLInputElement>) => void;
    editText: string;
    editTextRef: React.RefObject<HTMLInputElement> | null;
    expires: string;
    setExpires: (value: string) => void;
    getDDay: (expires: Date | null) => { label: string; color: string };
    onClickEdit: (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>, item: 할일목록Type) => void;
    showDeleted: boolean;
    onClickRestoreBtn: (e:React.MouseEvent<HTMLButtonElement>, item: 할일목록Type)=> void;
    onClickDeleteBtn: (e: React.MouseEvent<HTMLButtonElement>, item: 할일목록Type)=> void;
}

export default function TodoListComponent({
    정렬된목록,
    page,
    list,
    슬라이스,
    onChangeCheckEvent,
    editId,
    onKeyDownEditText,
    onChangeEditText,
    editText,
    editTextRef,
    expires,
    setExpires,
    getDDay,
    onClickEdit,
    showDeleted,
    onClickRestoreBtn,
    onClickDeleteBtn
}: Props) {
    return (
        <ul>
            <li className='head'>
                <div className="gap">
                    <span>No.</span>    
                    <span>완료</span>    
                    <span>만료일</span>    
                    <span>DAY</span>    
                    <span>할일</span>    
                    <span>수정</span>    
                    <span>삭제</span>    
                </div>
            </li>    
            {  
                슬라이스.length > 0 ?                       
                슬라이스.map((item, idx)=>
                    <li key={item.아이디} data-key={item.아이디}>
                        <div className="gap">
                            <label htmlFor={`check${item.아이디}`}>
                                {String((정렬된목록.length - ((page - 1) * list + idx))).padStart(2,'0')}
                            </label>
                            {/* 체크박스 */}
                            <input 
                                type="checkbox" 
                                id={`check${item.아이디}`}
                                name={`check${item.아이디}`}
                                
                                value={item.아이디}
                                onChange={(e)=>onChangeCheckEvent(e, item)}
                                checked={item.완료}
                            />
                        
                        {
                            (editId !==null && editId === item.아이디) ?
                                <div>
                                    <input                         
                                        type="text" 
                                        name='editText'
                                        id='editText'
                                        placeholder='할 일 수 정'
                                        onKeyDown={onKeyDownEditText}  
                                        onChange={onChangeEditText}
                                        value={editText}
                                        ref={editTextRef}
                                    />
                                    <input
                                        type="datetime-local"
                                        className="datetime-local"
                                        value={expires}
                                        onChange={(e) => setExpires(e.target.value)}
                                    />
                                </div>
                                :
                                <em className='left'>
                                    <strong
                                        style={{
                                            color:
                                            !item.만료일
                                                ? "black"
                                                : new Date(item.만료일).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)
                                                ? "#c33"       // 만료 (빨강)
                                                : new Date(item.만료일).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)
                                                ? "orange"     // 오늘 (D-DAY)
                                                : "#393"       // 미래 (초록)
                                        }}
                                        >
                                        {item.만료일 ? format(new Date(item.만료일), "yyyy-MM-dd HH:mm") : ""}
                                        </strong>


                                    <strong>
                                        <i style={{  color: getDDay(item.만료일).color }}>{getDDay(item.만료일).label}</i>
                                    </strong>

                                    <a 
                                        href='!#'
                                        onClick={(e) => onClickEdit(e, item)}
                                        className={(editId !== null && item.아이디 === editId) ? 'red' : item.완료?'on':''}
                                    >{item.할일}</a> 

                                    

                                </em>
                        }

                            <span className='right'>
                        {   
                            
                            <button className='edit' onClick={(e) => onClickEdit(e, item)}>
                            {
                                (editId !== null && item.아이디 === editId) ?
                                <i className="bi bi-check-lg red" title='저장'></i>
                                :
                                <i className="bi bi-pencil"></i>
                            }
                            </button>
                            
                        }
                            
                        {
                            showDeleted ? 
                                (
                                    <button 
                                        onClick={(e)=>onClickRestoreBtn(e, item)}
                                        className='delete-btn'
                                    ><i className="bi bi-arrow-counterclockwise"></i></button>
                                )
                                :                                    
                                (
                                    <button 
                                        onClick={(e)=>onClickDeleteBtn(e, item)}
                                        className='delete-btn'
                                    ><i className="bi bi-x-lg"></i></button>
                                )
                            }
                            </span>
                        
                        </div>
                    </li>    
                
                )
                :
                <li>
                    <div className="gap">
                        <h2>To Do List Empty...</h2> 
                    </div>
                </li>
            }                                                    
        </ul>
    );
}