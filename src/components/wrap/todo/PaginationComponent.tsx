import React from 'react';

interface  Props {
  현재그룹번호: number;
  그룹시작: number;
  그룹끝: number;
  총페이지수: number;
  총그룹수: number;
  페이지번호: number[];
  page: number;
  onClickPage: (
    e:React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, 
    page: number
  ) => void;
};

export default function PaginationComponent({
    현재그룹번호,
    총그룹수, 
    그룹시작,
    그룹끝,
    총페이지수,
    페이지번호,
    page,
    onClickPage
}: Props) {
    return (
        <div className="pagenation-box">

                {/* 처음 */}
            {    
                현재그룹번호 > 0 &&
                <button className="icon1"  onClick={(e)=>onClickPage(e, 1)}><i className="bi bi-chevron-bar-left"></i></button>
            }
                {/* 이전 */}
            {
                그룹시작 > 1 && 
                <button className="icon2" onClick={(e)=>onClickPage(e, 그룹시작-1)}><i className="bi bi-chevron-left"></i></button>
            }
                <ul>
                {
                    페이지번호.map((n)=>
                        <li key={n}  data-key={n} >
                            <a 
                                href="!#" 
                                title={String(n)} 
                                /*  
                                    # String(n) 
                                    => null → "null", undefined → "undefined" 로 변환

                                    # n.toString()
                                    => n이 null 또는 undefined일 경우 TypeError 에러 발생                                                
                                */
                                className={page===n ? "on" : ''}
                                onClick={(e)=>onClickPage(e, n)}
                            >{n}</a>
                        </li>
                    )

                }
                </ul>

                {/* 다음 */}
            {
                그룹끝 < 총페이지수 &&
                <button className="icon2" onClick={(e)=>onClickPage(e, 그룹끝+1)}><i className="bi bi-chevron-right"></i></button>
            }
                {/* 끝 */}
            {
                현재그룹번호 < (총그룹수-1) && 
                <button className="icon1" onClick={(e)=>onClickPage(e, 총페이지수)}><i className="bi bi-chevron-bar-right"></i></button>
            }

        </div>
    );
}