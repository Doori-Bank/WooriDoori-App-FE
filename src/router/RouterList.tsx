
/**
 * 라우터 리스트 정의
 * {path : '/path', element : <Component />}
 */

import { ReactElement } from 'react';
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
import NotificationView from "@/pages/NotificationView";

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
  { path: '/', element: <LoginView /> }, // 기본 경로를 로그인으로 설정
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
  ...accountRoutes,
];