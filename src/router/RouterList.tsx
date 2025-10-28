
/**
 * list 안에 내용은 아래와 같이 정의해주세요!
 * {path : '/test', element :<Test />}
 * 
 */

// import Test from "@/components/Test";
import CalendarView from "@/pages/CalendarView";
import SearchIdView from "@/pages/SearchIdView";
import YourIdView from "@/pages/YourIdView";
import ResetPwView from "@/pages/ResetPwView";
import NewPwView from "@/pages/NewPwView";
import CardRecommendView from "@/pages/CardRecommendView";
import CardManagementView from "@/pages/CardManagementView";
import AddCardView from "@/pages/AddCardView";
import CardAddCompleteView from "@/pages/CardAddCompleteView";
import DiaryView from "@/pages/DiaryView";
import DiaryEmotionView from "@/pages/DiaryEmotionView";
import DiaryWriteView from "@/pages/DiaryWriteView";
import GoalSetupView from "@/pages/goal/GoalSetupView";
import GoalEditView from "@/pages/goal/GoalEditView";
import AchievementHistoryView from "@/pages/goal/AchievementHistoryView";
import AchievementDetailView from "@/pages/goal/AchievementDetailView";
import MyPageView from "@/pages/MyPageView";
import UserInfoView from "@/pages/UserInfoView";
import LoginView from "@/pages/LoginView";
import SignUpAgreementView from "@/pages/SignUpAgreementView";
import SignUpView from "@/pages/SignUpView";
import SignUpSuccessView from "@/pages/SignUpSuccessView";
import SignUpFailView from "@/pages/SignUpFailView";
import CardRecomView from "@/pages/CardRecomViews/CardRecomView";
import HomeView from "@/pages/HomeView";
import ReportView from "@/pages/reportViews/reportView";

// 메인 route list
const mainList : Array<any> = [ 
    // {path : '/', element :<Test />},
    {path : '/', element :<HomeView />},
];



const accountList = [
  { path: "/searchid", element: <SearchIdView /> },
  { path: "/yourid", element: <YourIdView /> },
  { path: "/resetpw", element: <ResetPwView /> },
  { path: "/newpw", element: <NewPwView /> },
];

// 유저 정보 route list
const authList : Array<any> = [ 
    {path : '/mypage', element :<MyPageView />},
    {path : '/userinfo', element :<UserInfoView />},
    { path: '/login', element: <LoginView /> },
    { path: '/signUp/signUp', element: <SignUpView /> },
    { path: '/signUp/agreement', element: <SignUpAgreementView />},
    { path: '/signUp/Success', element: <SignUpSuccessView />},
    { path: '/signUp/Fail', element: <SignUpFailView />},
];


// 캘린더 route list
const calendarList : Array<any> = [
    {path : '/calendar', element :<CalendarView />},
    {path : '/calendar/diary', element :<DiaryView />},
    {path : '/calendar/diary/emotion', element :<DiaryEmotionView />},
    {path : '/calendar/diary/write', element :<DiaryWriteView />}
];


// 카드 route list
const cardList : Array<any> = [
    {path : '/card-recommend', element :<CardRecommendView />},
    {path : '/card', element :<CardManagementView />},
    {path : '/card/cards', element :<AddCardView />},
    {path : '/card/cards/complete', element :<CardAddCompleteView />}
];


// 달성도 route list
const goalList : Array<any> = [
    {path : '/goal/setGoal', element :<GoalSetupView />},
    {path : '/goal/editGoal', element :<GoalEditView />},
    {path : '/goal/achievementHistory', element :<AchievementHistoryView />},
    {path: "/achievement/detail", element: <AchievementDetailView /> },
];

// 레포트 route list
const reportList : Array<any> = [
    {path: '/report' , element : <ReportView /> },
    {path : 'report-card', element : <CardRecomView /> },
];




export const routerList = [
    ...mainList,
    ...accountList,
    ...authList,
    ...calendarList,
    ...cardList,
    ...goalList,
    ...reportList,
];