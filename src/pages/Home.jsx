import { useState, useContext } from "react";
import { DiaryStateContext } from "../App";
import Header from "../components/Header";
import Button from "../components/Button";
import DiaryList from "../components/DiaryList";
import usePageTitle from "../hooks/usePageTitle";

const getMonthlyData = (pivotDate, data) => {
  // 매개변수는 날짜와 일기데이터
  const beginTime = new Date(
    pivotDate.getFullYear(),
    pivotDate.getMonth(),
    1,
    0,
    0,
    0
  ).getTime(); //시작시간

  const endTime = new Date(
    pivotDate.getFullYear(),
    pivotDate.getMonth() + 1, //+1은 다음달로 설정
    0, //이전달에 마지막날을 의미함
    23, //23시
    59, //59분
    59 //59초
  ).getTime();

  return data.filter(
    (item) => beginTime <= item.createdDate && item.createdDate <= endTime
  );
};

const Home = () => {
  const data = useContext(DiaryStateContext);
  const [pivotDate, setPivoDate] = useState(new Date()); //Date 객체는 0부터 계산됨
  usePageTitle("감정 일기장");
  const monthlyData = getMonthlyData(pivotDate, data);

  const onIncreaseMonth = () => {
    setPivoDate(new Date(pivotDate.getFullYear(), pivotDate.getMonth() + 1)); // 0+1을 해줘야 함
  }; //다음버튼
  const onDecreaseMonth = () => {
    setPivoDate(new Date(pivotDate.getFullYear(), pivotDate.getMonth() - 1)); //0-1을 해줘야 함
  }; //이전버튼

  return (
    <div>
      <Header
        title={`${pivotDate.getFullYear()}년 ${pivotDate.getMonth() + 1}월`}
        leftChild={<Button onClick={onDecreaseMonth} text={"<"} />}
        rightChild={<Button onClick={onIncreaseMonth} text={">"} />}
      />
      <DiaryList data={monthlyData} />
    </div>
  );
};

export default Home;
