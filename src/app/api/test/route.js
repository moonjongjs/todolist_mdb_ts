import { connectDB } from "@/lib/mongodb";
import Todo from "@/models/Todo";

export async function GET() {
  await connectDB();
  const oneTodo = await Todo.findOne();
  console.log(oneTodo); // 서버 콘솔에 찍힘

  // oneTodo가 mongoose Document라서 JSON 직렬화 필요
  return Response.json({
    message: "MongoDB 연결 성공!",
    todo: oneTodo,  
  });
}

export async function DELETE() {
  await connectDB();
  await Todo.deleteMany({});  // 전체 삭제
  return Response.json({ message: "모든 ToDo 삭제 완료" });
}


// http://localhost:3000/api/test)