"use client";
import React, { useState, useRef, useMemo, useEffect } from 'react';

import { 할일목록Type } from '@/components/custom/types/todo';
import TitleComponent from './todo/TitleComponent';

import InputComponent from '@/components/wrap/todo/InputComponent';
import { useInputComponent } from '@/components/custom/hooks/useInputComponent';

import FilterSortComponent from '@/components/wrap/todo/FilterSortComponent';
import { useFilterSortComponent } from '../custom/hooks/useFilterSortComponent';

import CountComponent from '@/components/wrap/todo/CountComponent';
import { useCountComponent } from '@/components/custom/hooks/useCountComponent';

import TodoListComponent from './todo/TodoListComponent';
import { useTodoListComponent } from '../custom/hooks/useTodoListComponent';

import SelectDeleteComponent from './todo/SelectDeleteComponent';
import { useSelectDeleteComponent } from '../custom/hooks/useSelectDeleteComponent';

import PaginationComponent from './todo/PaginationComponent';
import { usePaginationComponent } from '../custom/hooks/usePaginationComponent';

import ConfirmModalComponent from '@/components/wrap/ConfirmModalComponent';
import { useConfirmModalComponent } from '@/components/custom/hooks/useConfirmModalComponent';

import "./scss/MainComponent.scss";
import axios from 'axios';



export default function MainComponent() {

    const [isYes, setIsYes] = useState<boolean>(false);

    // 계산만 사용하는 일반변수 선언
    const list = 5;  // 한페이지 목록 줄수
    const [page, setPage] = useState<number>(1);
    
    // 고유 ID 관리
    const idx = useRef<number>(1);    
    // const editTextRef = useRef<HTMLInputElement | null>(null);

    // 할일 입력상자 입력 상태
    const [state, setState] = useState<{할일:string}>({
        할일: ''
    });    

    // 삭제 모드 복구 모드
    const [showDeleted, setShowDeleted] = useState<boolean>(false);

    // 검색
    const [할일목록, set할일목록] = useState<할일목록Type[]>([]);                 
    const [update, setUpdate] = useState<할일목록Type | 할일목록Type[] | null>(null);
   






    /** ------------------------------
    * API 연결
    * ------------------------------ */
    // [R] 불러오기
    useEffect(() => {
        axios({
            url: '/api/todos',
            method: 'GET'
        })
        .then((res) => {
            set할일목록(res.data)
        });
    }, []);


    /** ------------------------------
    * 컨펌 모달 컴포넌트 (커스텀 훅 사용)
    * ------------------------------ **/
    const {
        isOk,
        isOpen,
        message,
        openModal,
        closeModal,
        onClickYes
    } = useConfirmModalComponent({isYes, setIsYes});


   /** ------------------------------
   * 입력 컴포넌트 (커스텀 훅 사용)
   * ------------------------------ **/
    const {
        할일,
        expires,
        setExpires,
        todoInputRef,
        onChangeTodoInput,
        onKeyDownTodoInput,
        onClickSaveBtn,
    } = useInputComponent(async (할일, expires) => {
        const obj = {
        할일,
        날짜: new Date(),
        만료일: new Date(expires),
        완료: false,
        삭제: false        
        };       
        try {
            await axios.post("/api/todos", obj);
            const res = await axios.get("/api/todos");
            set할일목록(res.data); // MainComponent에서 관리하는 목록 갱신
            } catch (err: any) {
            console.error("등록 실패:", err.response?.data || err.message);
        }
    }, { openModal });





   /** ------------------------------
   * 필터 & 검색 컴포넌트 (커스텀 훅 사용)
   * ------------------------------ **/    
    const {
        period,
        setPeriod,
        condition,
        setCondition,
        todoSearchRef,
        keyword,
        setKeyword,
        검색결과,
        set검색결과,
        sort,
        setSort,
        onSearch,
        resetSearch
    } = useFilterSortComponent( 
        {setPage}, 
        ({period, condition, keyword}) => {
            let result = [...할일목록];
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // 조건 필터
            if (condition === "할일") {
                result = result.filter((item) =>
                item.할일.toLowerCase().includes(keyword.toLowerCase())
            );
            } else if (condition === "완료된 항목") {
                result = result.filter((item) => item.완료);
            } else if (condition === "삭제된 항목") {
                result = result.filter((item) => item.삭제);
            } else if (condition === "만료된 항목") {
                result = result.filter(
                    (item) => item.만료일 && new Date(item.만료일) < today
                );
            }

            // 📅 기간 필터 (간단 예시만 적용, 필요시 Main에서 확장)
            if (period === "오늘") {
                result = result.filter(
                    (item) =>
                    item.만료일 &&
                    new Date(item.만료일).toDateString() === today.toDateString()
                );
            }

            return result;
        }
    );




    



    /** ----------------------------------
    * 페이지네이션 컴포넌트 (커스텀 훅 사용)
    * --------------------------------- **/

    // 페이지네이션 시작 /////////////////////////////////////////////////////////////////////////////
    // 페이지 카운트
    /** 
     * ------------------------------
     *  파생 데이터 계산 (useMemo) 시작
     * ------------------------------ 
    **/

    const 삭제안된목록 = useMemo<할일목록Type[]>(() => {
        return 할일목록.filter(item => item.삭제 === false)
    }, [할일목록]);  // 할일목록이 바뀔 때만 필터 다시 수행
    
    const 삭제된목록 = useMemo<할일목록Type[]>(() => {
        return 할일목록.filter(item => item.삭제 === true)
    }, [할일목록]);  // 할일목록이 바뀔 때만 필터 다시 수행
    
    // 페이지단위 슬라이스 계산
    // 삭제 여부에 따라 기준 목록 선택
    const 할일출력목록 = useMemo<할일목록Type[]>(() => {
        return showDeleted ? 삭제된목록 : 삭제안된목록;
    }, [showDeleted, 삭제된목록, 삭제안된목록]);

    // 검색 or 삭제 필터 반영
    const 필터된목록 = useMemo<할일목록Type[]>(() => {
        return 검색결과.length > 0 ? 검색결과 : 할일출력목록;
    }, [검색결과, 할일출력목록]);

     // 정렬 적용
    const 정렬된목록 = useMemo<할일목록Type[]>(() => {
        let result = [...필터된목록];

        if (sort === "dateAsc") {
            result.sort((a, b) => {
            if (!a.만료일) return 1;
            if (!b.만료일) return -1;
            return new Date(a.만료일).getTime() - new Date(b.만료일).getTime();
            });
        } else if (sort === "dateDesc") {
            result.sort((a, b) => {
            if (!a.만료일) return 1;
            if (!b.만료일) return -1;
            return new Date(b.만료일).getTime() - new Date(a.만료일).getTime();
            });
        } else if (sort === "newest") {
            result.sort((a, b) => new Date(b.등록일).getTime() - new Date(a.등록일).getTime());
        } else if (sort === "oldest") {
            result.sort((a, b) => new Date(a.등록일).getTime() - new Date(b.등록일).getTime());
        }

        return result;
    }, [필터된목록, sort]);


 
    const {
        총페이지수,
        현재그룹번호,
        총그룹수,
        그룹시작,
        그룹끝,
        페이지번호,
        onClickPage,
        } = usePaginationComponent({
        page,
        setPage,            
        totalItems: 정렬된목록.length, // ✅ 전체 데이터 개수
        listPerPage: 5,               // ✅ 한 페이지당 출력 개수
        groupSize: 5,                 // ✅ 그룹 크기 (ex. 1~5, 6~10)
    });

    // 페이지 슬라이스
    const 슬라이스 = useMemo(() => {
    const 시작 = (page - 1) * 5;
    const 끝 = 시작 + 5;
    return 정렬된목록.slice(시작, 끝);
    }, [정렬된목록, page]);


   // ✅ 현재 페이지에서 체크된 개수
    const 현재페이지완료된개수 = useMemo(() => {
    return 슬라이스.filter(item => item.완료 === true).length;
    }, [슬라이스]);

   // 페이지네이션 끝 /////////////////////////////////////////////////////////////////////////////





   /** ------------------------------
   * 집계 카운트 컴포넌트 (커스텀 훅 사용)
   * ------------------------------ **/
   const {
        onClickRestore
   } = useCountComponent({setShowDeleted, setPage}); 


    // 삭제 실행
    const handleConfirmDelete = () => {
        // if (!targetId) return;
        axios({
            url: '/api/todos',
            method: 'PUT',
            data: update
        })
        .then((res) => {
            setUpdate(null);
            openModal("삭제되었습니다.", null, true);
            return axios.get('/api/todos');
        })
        .then((res) => {
            set할일목록(res.data);
        })
        .catch((err) => {
            console.error("❌ 등록 실패:", err.response?.data || err.message);
        });  

    };

    // 삭제된할일목록 없으면 할일목록 처음으로 자동 전환    
    useEffect(()=>{
        const 삭제된할일목록 = 할일목록.filter((item)=>item.삭제===true).length;
        if( 삭제된할일목록 === 0 ){
            setShowDeleted(false);
            setPage(1);
            return;
        }
    }, [할일목록]);


    /** ------------------------------------------
    * TODO LIST 리스트(목록) 컴포넌트 (커스텀 훅 사용)
    * ----------------------------------------- **/
    const {
        editId,
        editText,
        editTextRef,
        expires2,
        setExpires2,
        getDay,
        onClickEdit,
        onChangeEditText,
        onKeyDownEditText,
        onChangeCheckEvent,
        onChangeSetExpires,
        onKeyDownSetExpires,
        onClickDeleteBtn,
        onClickRestoreBtn,
        onClickDeleteBtn2
    } = useTodoListComponent({isYes, 할일, 할일목록, set할일목록, openModal, setUpdate, todoInputRef});


    const { 
        완료된개수, 
        onClickCheckDeleteBtn, 
        onClickCheckDeleteBtn2 
    } = useSelectDeleteComponent({
        슬라이스,
        할일목록,
        set할일목록,
        openModal,
        showDeleted,
    });







    return (
        <main id='main'>
            <div className="container">
                {/* 타이틀 TitleComponent.tsx */}
                <TitleComponent />
                <div className="content">
                    {/* 할일 입력 & 만료일 입력 상자 useInputComponent.js InputComponent.jsx */}
                    <InputComponent
                        onKeyDownTodoInput={onKeyDownTodoInput}
                        onChangeTodoInput={onChangeTodoInput}
                        할일={할일}
                        todoInputRef={todoInputRef}
                        expires={expires}
                        setExpires={setExpires}
                        onClickSaveBtn={onClickSaveBtn}
                    />

                    {/* 출력 목록 */}
                    <div className='todo-list-box'>

                        {/* 필터 검색 및 정렬 그룹 useFilterSortComponent.ts FilterSortComponent.tsx */}     
                        <FilterSortComponent 
                            period={period}
                            setPeriod={setPeriod}
                            condition={condition}
                            setCondition={setCondition}
                            todoSearchRef={todoSearchRef}
                            keyword={keyword}
                            setKeyword={setKeyword}
                            검색결과={검색결과}
                            onSearch={onSearch}
                            set검색결과={set검색결과}
                            sort={sort}
                            setSort={setSort}
                        />


                        {/* 항목별 카운트 그룹 useCountComponent.ts CountComponent.tsx */}     
                        <CountComponent 
                            삭제안된목록={삭제안된목록}
                            할일목록={할일목록}
                            onClickRestore={onClickRestore}
                            showDeleted={showDeleted}
                        />


                        {/* 리스트 출력 그룹 useTodoListComponent.ts TodoListComponent.tsx */}     
                        <TodoListComponent
                            할일목록={할일목록}
                            정렬된목록={정렬된목록}
                            page={page}
                            list={list}
                            슬라이스={슬라이스}
                            onChangeCheckEvent={onChangeCheckEvent}
                            editId={editId}
                            onKeyDownEditText={onKeyDownEditText}
                            onChangeEditText={onChangeEditText}
                            onChangeSetExpires={onChangeSetExpires}
                            onKeyDownSetExpires={onKeyDownSetExpires}
                            editText={editText}
                            editTextRef={editTextRef}
                            expires2={expires2}
                            setExpires2={setExpires2}
                            getDay={getDay}
                            onClickEdit={onClickEdit}
                            showDeleted={showDeleted}
                            onClickRestoreBtn={onClickRestoreBtn}
                            onClickDeleteBtn={onClickDeleteBtn}  
                            onClickDeleteBtn2={onClickDeleteBtn2}                      
                        />

                        {/* 선택 삭제 그룹 useSelectDeleteComponent.ts SelectDeleteComponent.tsx */} 
                        <SelectDeleteComponent
                            완료된개수={현재페이지완료된개수}
                            showDeleted={showDeleted}
                            onClickCheckDeleteBtn ={onClickCheckDeleteBtn}
                            onClickCheckDeleteBtn2={onClickCheckDeleteBtn2}
                        />

                    </div>

                    {/* 페이지네이션 usePaginationComponent.ts PaginationComponent.tsx */}   
                    <PaginationComponent
                        현재그룹번호={현재그룹번호}
                        총그룹수={총그룹수}
                        그룹시작 ={그룹시작}
                        그룹끝={그룹끝}
                        총페이지수={총페이지수}
                        페이지번호={페이지번호}
                        page={page}
                        onClickPage={onClickPage}                        
                    />   


                    {/* 컨펌모달 useConfirmModalComponent.ts ConfirmModalComponent.tsx */}   
                    <ConfirmModalComponent 
                        isOk={isOk}
                        isOpen={isOpen}
                        message={message}
                        onConfirm={handleConfirmDelete}
                        onCancel={closeModal}
                        onClickYes={onClickYes}
                    /> 
            
                </div>
            </div>
        </main>
    );
}