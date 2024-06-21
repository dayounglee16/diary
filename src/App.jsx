import "./App.css";
import { useReducer, useRef, createContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Notfound from "./pages/Notfound";

function reducer(state, action) {
  let nextState;

  // 액션객체 전달받음
  switch (
    action.type //액션객체 타입
  ) {
    case "INIT":
      return action.data;
    case "CREATE": {
      //액션객체 타입 추가
      nextState = [action.data, ...state]; //액션객체데이터 + 임시데이터
      break;
    }
    case "UPDATE": {
      nextState = state.map(
        (item) =>
          String(item.id) === String(action.data.id) ? action.data : item //숫자, 문자열 다를 수 있기 때문
      );
      break;
    }
    case "DELETE": {
      nextState = state.filter((item) => String(item.id) !== String(action.id));
      break;
    }
    default:
      return state;
  }
  localStorage.setItem("diary", JSON.stringify(nextState));
  return nextState;
}

export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();

function App() {
  const [isLoding, setIsLoding] = useState(true);
  const [data, dispatch] = useReducer(reducer, []);
  const idRef = useRef(0); //생성될 item id의 값을 저장

  useEffect(() => {
    const storedData = localStorage.getItem("diary");
    if (!storedData) {
      setIsLoding(false);
      return;
    }
    const parsedData = JSON.parse(storedData);
    if (!Array.isArray(parsedData)) {
      return;
    }
    let maxId = 0;
    parsedData.forEach((item) => {
      if (Number(item.id) > maxId) {
        maxId = Number(item.id);
      }
    });

    idRef.current = maxId + 1;

    dispatch({
      type: "INIT",
      data: parsedData,
    });
    setIsLoding(false);
  }, []);

  //새로운 일기 추가(oncreate)
  const onCreate = (createdDate, emotionId, content) => {
    dispatch({
      //useReducer state(data) 새로운 값을 추가하려면 dispatch 사용
      type: "CREATE",
      data: {
        id: idRef.current++, //3번부터 시작이고, 1씩증가됨
        createdDate,
        emotionId,
        content,
      },
    });
  };

  //기존 일기 수정(onUpdate)
  const onUpdate = (id, createdDate, emotionId, content) => {
    dispatch({
      type: "UPDATE",
      data: {
        id,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  //기존일기 삭제(onDelete)
  const onDelete = (id) => {
    dispatch({
      type: "DELETE",
      id,
    });
  };

  if (isLoding) {
    return <div>데이터 로딩중입니다 ...</div>;
  }

  return (
    <>
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider value={{ onCreate, onUpdate, onDelete }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/diary/:id" element={<Diary />} />
            <Route path="/new" element={<New />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </>
  );
}

export default App;
