// 익스플로러 immer가 동작을 안하는데 동작하는 방법은 produce 함수를 새로 만들어준다.
// immer에서 enableES5가 들어있는데 enableES5 켜져있어야지 ie11에서도 동작이 된다.
// 원래는 entryPoint 프론트 소스코드 제일 위에 올려두면 되는데
// Next는 React dom에 rander가 없고 Next가 알아서 처리하기 때문에 소스코드 처음시작부분에 넣을 수 가없다.
// immer 만든사람이 권장하는 방법이 직접 만들어주는 것이다.
// 확장 개념 기존에다가 enableES5() 하나 더 실행
// reducer에 import 폴더 변경해주기

import produce, { enableES5 } from 'immer';

export default (...args) => {
  enableES5();
  return produce(...args);
};
