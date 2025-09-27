import React from 'react';
import { 할일목록Type } from '@/components/custom/types/todo';




// 할일목록 타입
interface Props {
    period: string;
    setPeriod: (value: string) => void;
    condition: string;
    setCondition: (value: string) => void;
    todoSearchRef:  React.RefObject<HTMLInputElement> | null;
    keyword: string;
    setKeyword: (value: string) => void;
    검색결과: 할일목록Type[];
    onSearch: () => void;
    set검색결과: (value: 할일목록Type[]) => void;
    sort: string;
    setSort: (value: string) => void;
}

export default function FilterSortComponent({
    period,
    setPeriod,
    condition,
    setCondition,
    todoSearchRef,
    keyword,
    setKeyword,
    검색결과,
    onSearch,
    set검색결과,
    sort,
    setSort
}: Props) {
    return (
        <div className='search-box'>
            {/* 검색 입력 상자 */}
            <div className="select1">
                <select                               
                    name="searchSelect1" 
                    id="searchSelect1" 
                    value={period} 
                    onChange={(e) => setPeriod(e.target.value)}
                >
                    <option value="전체기간">전체기간</option>
                    <option value="오늘">오늘</option>
                    <option value="이번 주">이번 주</option>
                    <option value="지난 주">지난 주</option>
                    <option value="다음 주">다음 주</option>
                    <option value="이번 달">이번 달</option>
                    <option value="지난 달">지난 달</option>
                    <option value="다음 달">다음 달</option>
                    <option value="3개월 이내">3개월 이내</option>
                    <option value="6개월 이내">6개월 이내</option>
                    <option value="올해">올해</option>
                    <option value="지난 해">지난 해</option>
                    <option value="내년">내년</option>
                    <option value="만료된 항목">만료된 항목</option>
                </select>
            </div>
            <div className="select1 select2">
                <select 
                    name="searchSelect2" 
                    id="searchSelect2" 
                    value={condition} 
                    onChange={(e) => setCondition(e.target.value)}
                >
                    <option value="할일">할일</option>
                    <option value="만료된 항목">만료된 항목</option>
                    <option value="완료된 항목">완료된 항목</option>
                    <option value="삭제된 항목">삭제된 항목</option>
                </select>
            </div>
            <input                         
                type="text" 
                name='todoSearch'
                id='todoSearch'
                placeholder='검색어를 입력해 주세요'
                ref={todoSearchRef}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />  
            
            {
                검색결과.length === 0 ?
            
                (
                    <button onClick={onSearch}><i className="bi bi-search"></i> <span>검색</span></button>
                )
                :
                (
                    <button
                        className="reset-btn"
                        onClick={() => {
                        set검색결과([]);
                        setKeyword("");
                        setPeriod("전체기간");
                        setCondition("할일");
                        }}
                    >
                        <i className="bi bi-x-circle"></i> 초기화
                    </button>
                )
            }

            {/* 정렬그룹 */}
            <div className="sort-group">
                <label className="sort-label">
                    <i className="bi bi-sort-down"></i> 정렬
                </label>
            
                <div className="select2">
                    <div className="sort-select select1" id='sortSelect'>
                        <select value={sort} onChange={(e)=>setSort(e.target.value)}>
                            <option value="newest">최근 추가</option>
                            <option value="oldest">오래된 추가</option>
                            <option value="dateDesc">만료일 늦은순</option>
                            <option value="dateAsc">만료일 빠른순</option>
                        </select>
                    </div>
                </div> 
            </div> 
        </div>
    );
}