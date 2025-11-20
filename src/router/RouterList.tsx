
/**
 * 라우터 리스트 정의
 * {path : '/path', element : <Component />}
 */

import { ReactElement } from 'react';
import CalendarView from "@/pages/calendarViews/CalendarView";
import SearchIdView from "@/pages/accountViews/SearchIdView";
import YourIdView from "@/pages/accountViews/YourIdView";
import ResetPwView from "@/pages/accountViews/ResetPwView";
import NewPwView from "@/pages/accountViews/NewPwView";
import CardRecommendView from "@/pages/cardViews/CardOverView";
import CardManagementView from "@/pages/cardViews/CardManagementView";
import AddCardView from "@/pages/cardViews/AddCardView";
import CardAddCompleteView from "@/pages/cardViews/CardAddCompleteView";
import DiaryView from "@/pages/calendarViews/DiaryView";
import DiaryEmotionView from "@/pages/calendarViews/DiaryEmotionView";
import DiaryWriteView from "@/pages/calendarViews/DiaryWriteView";
import GoalSetupView from "@/pages/goalViews/GoalSetupView";
import GoalEditView from "@/pages/goalViews/GoalEditView";
import AchievementHistoryView from "@/pages/goalViews/AchievementHistoryView";
import AchievementDetailView from "@/pages/goalViews/AchievementDetailView";
import MyPageView from "@/pages/myPageViews/MyPageView";
import UserInfoView from "@/pages/myPageViews/UserInfoView";
import LoginView from "@/pages/accountViews/LoginView";
import LoadingView from "@/pages/accountViews/LoadingView";
import SignUpAgreementView from "@/pages/accountViews/signUp/SignUpAgreementView";
import SignUpView from "@/pages/accountViews/signUp/SignUpView";
import SignUpSuccessView from "@/pages/accountViews/signUp/SignUpSuccessView";
import SignUpFailView from "@/pages/accountViews/signUp/SignUpFailView";
import CardRecomView from "@/pages/CardRecomViews/CardRecomView";
import HomeView from "@/pages/homeViews/HomeView";
import ReportView from "@/pages/reportViews/reportView";
import NotificationView from "@/pages/noticationViews/NotificationView";
import CategoryTop5View from "@/pages/CategoryTop5View";
import MonthAchievementView from '@/pages/reportViews/MonthAchievementView';

// 라우트 타입 정의
interface RouteConfig {
  path: string;
  element: ReactElement;
}

// 홈 라우트
const homeRoutes: RouteConfig[] = [
  { path: '/home', element: <HomeView /> },
];

// 인증 관련 라우트
const authRoutes: RouteConfig[] = [
  { path: '/', element: <LoadingView /> }, // 기본 경로를 로딩 페이지로 설정
  { path: '/login', element: <LoginView /> },
  { path: '/mypage', element: <MyPageView /> },
  { path: '/userinfo', element: <UserInfoView /> },
  { path: '/notification', element: <NotificationView /> },
];

// 회원가입 관련 라우트
const signUpRoutes: RouteConfig[] = [
  { path: '/signUp/agreement', element: <SignUpAgreementView /> },
  { path: '/signUp/signUp', element: <SignUpView /> },
  { path: '/signUp/Success', element: <SignUpSuccessView /> },
  { path: '/signUp/Fail', element: <SignUpFailView /> },
];

// 계정 관리 라우트
const accountRoutes: RouteConfig[] = [
  { path: '/searchid', element: <SearchIdView /> },
  { path: '/yourid', element: <YourIdView /> },
  { path: '/resetpw', element: <ResetPwView /> },
  { path: '/newpw', element: <NewPwView /> },
];

// 캘린더 관련 라우트
const calendarRoutes: RouteConfig[] = [
  { path: '/calendar', element: <CalendarView /> },
  { path: '/calendar/diary', element: <DiaryView /> },
  { path: '/calendar/diary/emotion', element: <DiaryEmotionView /> },
  { path: '/calendar/diary/write', element: <DiaryWriteView /> },
];

// 카드 관련 라우트
const cardRoutes: RouteConfig[] = [
  { path: '/card', element: <CardManagementView /> },
  { path: '/card/cards', element: <AddCardView /> },
  { path: '/card/cards/complete', element: <CardAddCompleteView /> },
  { path: '/card-recommend', element: <CardRecommendView /> },
];

// 목표 관련 라우트
const goalRoutes: RouteConfig[] = [
  { path: '/goal/setGoal', element: <GoalSetupView /> },
  { path: '/goal/editGoal', element: <GoalEditView /> },
  { path: '/goal/achievementHistory', element: <AchievementHistoryView /> },
  { path: '/achievement/detail', element: <AchievementDetailView /> },
];

// 리포트 관련 라우트
const reportRoutes: RouteConfig[] = [
  { path: '/report', element: <ReportView /> },
  { path: '/report-card', element: <CardRecomView /> },
  { path: '/month-achive', element: <MonthAchievementView /> },
];

// 카테고리 관련 라우트
const categoryRoutes: RouteConfig[] = [
  { path: '/category-top5/:id', element: <CategoryTop5View /> },
];

// 모든 라우트 통합
export const routerList: RouteConfig[] = [
  ...homeRoutes,
  ...authRoutes,
  ...signUpRoutes,
  ...calendarRoutes,
  ...cardRoutes,
  ...goalRoutes,
  ...reportRoutes,
  ...categoryRoutes,
  ...accountRoutes,
];