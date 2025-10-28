
/**
 * list 안에 내용은 아래와 같이 정의해주세요!
 * {path : '/test', element :<Test />}
 * 
 */

// import Test from "@/components/Test";
import CalendarView from "@/pages/CalendarView";
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
const calendarList : Array<any> = [{path : '/calendar', element :<CalendarView />}];


// 카드 route list
const cardList : Array<any> = [];


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
    ...authList,
    ...calendarList,
    ...cardList,
    ...goalList,
    ...reportList,
];