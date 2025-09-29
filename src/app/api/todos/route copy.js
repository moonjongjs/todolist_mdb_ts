import { connectDB } from "@/lib/mongodb";
import Todo from "@/models/Todo";

// [R] 전체 목록 조회
export async function GET() {
  await connectDB();
  const oneTodo = await Todo.findOne();

  const todos = await Todo.find().sort({ 만료일: -1 });
  const resData = todos.map((item) => ({
    idx: item.idx,
    아이디: item._id.toString(),
    할일: item.할일,
    만료일: item.만료일,
    완료: item.완료,
    삭제: item.삭제,
    등록일: item.createdAt,
    수정일: item.updatedAt
  }));
  return Response.json(resData);
}

// [C] 새 할일 추가
export async function POST(req) {
  try{
    await connectDB();

    const dataJson = await req.json();

    // 필수값 체크
    if (!dataJson.할일) {
      return Response.json({ error: "할일은 필수입니다." }, { status: 400 });
    }
    const res = await Todo.create({
        할일: dataJson.할일,
        만료일: dataJson.만료일
    });
    // 저장된 문서 반환
    return Response.json(dataJson, { status: 201 });
  }
  catch(err) {
    console.error("❌ POST /api/todos 에러:", err);
    return Response.json({ error: "서버 에러", details: err.message }, { status: 500 });
  }
}


// [U] 수정(삭제) (할일/만료일/완료/삭제 상태 변경)
export async function PUT(req) {
  await connectDB();
  const body = await req.json();

  // [1] 배열일 경우 (선택수정(삭제))
  if(Array.isArray(body)){
    
    const ids = body.map((item)=>item.아이디);  // 배열에서 아이디 만 필터

    const result = await Todo.updateMany(
      { _id: { $in: ids } },  
      { $set: { 삭제: true } }
    );

    return Response.json({
      message: "여러 항목 수정(삭제) 완료",
      modifiedCount: result.modifiedCount,
    });

  }


  // [2] 단일 객체일 경우 (개별수정(삭제))
  const updated = await Todo.findByIdAndUpdate(
    body.아이디,                       // MongoDB에서 특정 문서(_id = 아이디)를 찾아 업데이트.
    {$set: { ...body }},  // 업데이트할 값들.
    { new: true }                 // 수정된 최신 문서를 반환하게 설정 (안 쓰면 수정 전 데이터를 반환).
  );

  return Response.json(updated);
}



// [D] 삭제 (DB에서 완전히 제거) =>  개별삭제 & 선택삭제(배열)
export async function DELETE(req) {
  await connectDB();
  
  const { 아이디 } = await req.json();

  if (!아이디) {
    return Response.json({ message: "삭제할 id가 없습니다." }, { status: 400 });
  }

  if(Array.isArray(아이디)){
    const result = await Todo.deleteMany({ _id: { $in: 아이디 } });
    return Response.json({
      message: "선택 삭제 완료",
      deletedCount: result.deletedCount,
    });
  }
  else {
    await Todo.findByIdAndDelete(아이디);   // 개별삭제
    return Response.json({ message: "삭제 완료" });
  }

}
