import React from 'react';
import { 할일목록Type } from '@/components/custom/types/todo';

interface Props {
    삭제안된목록: 할일목록Type[];
    할일목록: 할일목록Type[];
    onClickRestore: (e:React.MouseEvent<HTMLButtonElement>) => void;
    showDeleted: boolean;
}

export default function CountComponent({
    삭제안된목록,
    할일목록,
    onClickRestore,
    showDeleted
}: Props) {
    return (
        <h2 className='count-box'>
            <span className='left-icon'>
                <i className="bi bi-square"></i> 할일( {삭제안된목록.length} ) / <i className="bi bi-check-square"></i> 완료( {삭제안된목록.filter((item)=>item.완료===true).length} )
                <span className="badge bg-danger"><i className="bi bi-alarm-fill icon1 "></i><i>만료</i></span>
                <span className="badge bg-warning text-dark"><i className="bi bi-alarm-fill icon2"></i><i>오늘</i></span>
                <span className="badge bg-success"><i className="bi bi-alarm-fill icon3"></i><i>미래</i></span>

            </span>
            <span className='right-icon'>
                <i className="bi bi-x-lg"></i> 삭제( <i>{할일목록.length - 삭제안된목록.length}</i> )
                {
                    (할일목록.length - 삭제안된목록.length) > 0 &&
                    <button onClick={onClickRestore}>{showDeleted ? "할일 목록 보기" : "삭제된 목록"}</button>
                }
            </span>
        </h2> 
    );
}
                       