// import React from 'react';
// import { useSelector } from 'react-redux';
// import Head from 'next/head';
// import { END } from 'redux-saga';

// import { Avatar, Card } from 'antd';
// import AppLayout from '../components/AppLayout';
// import wrapper from '../store/configuerStore';
// import { LOAD_USER_REQUEST } from '../reducers/user';

// const Profile = () => {
//   const { userInfo } = useSelector((state) => state.user);

//   return (
//     <AppLayout>
//       <Head>
//         <title>Abuot | NodeBird</title>
//       </Head>
//       {userInfo ? (
//         <Card
//           actions={[
//             <div key="twit">
//               짹짹
//               <br />
//               {userInfo.Posts}
//             </div>,
//             <div key="following">
//               팔로잉
//               <br />
//               {userInfo.Followings}
//             </div>,
//             <div key="follower">
//               팔로워
//               <br />
//               {userInfo.Followers}
//             </div>,
//           ]}
//         >
//           <Card.Meta
//             avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
//             title={userInfo.nickname}
//             description="노드버드 매니아"
//           />
//         </Card>
//       ) : null}
//     </AppLayout>
//   );
// };

// export const getStaticProps = wrapper.getStaticProps(async (context) => {
//   // 언제 접속해도 데이터가 바뀔일이 없으면 getStaticProps 사용하고
//   // 접속할 때마다 접속한 상황에따라서 화면이 바뀔 환경이면 getServerSideProps 사용
//   // getStaticProps 쓰기 까다롭고 웬만하면 getServerSideProps 사용할 것이다.
//   // getStaticProps는 블로그 게시글처럼 웬만하면 데이터가 안바뀌는 것들
//   // 한 번 게시글로 만들어놓으면 그 게시글 중간에 수정은 할 수 있겠지만 그렇다고 빈번하게 수정하지는 않는다.
//   // getStaticProps로 하면 나중에 Next에서 빌드했을 때 정적인 HTML 파일로 뽑아준다.

//   // getServerSideProps 하면 방문한 그 때 서버사이드 렌더링을 한다.
//   // 데이터가 달라지면 백엔드 서버가서 데이터 받아와서 화면 렌더링 해준다.

//   // getStaticProps 쓰기가 애매한게 블로그 게시글이나, 뉴스 이런거 말고는 미리 HTML파일로 만들어 놓기 힘들다.
//   // 네이버 메인페이지 보면 실시간 뉴스, 실시간 검색어 등 올라오기 때문에 content들도 바뀌어서 방문할 때 서버사이드 렌더링을 해줘야한다.

//   console.log('getStaticProps');
//   context.store.dispatch({
//     type: LOAD_USER_REQUEST,
//     data: 1,
//   });
//   context.store.dispatch(END);
//   await context.store.sagaTask.toPromise();
// });

// export default Profile;
