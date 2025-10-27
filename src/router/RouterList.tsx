
/**
 * list 안에 내용은 아래와 같이 정의해주세요!
 * {path : '/test', element :<Test />}
 * 
 */

import Test from "@/components/Test";
import CalendarView from "@/pages/CalendarView";
import MyPageView from "@/pages/MyPageView";
import UserInfoView from "@/pages/UserInfoView";

// 메인 route list
const mainList : Array<any> = [ 
    {path : '/', element :<Test />}
];

// 유저 정보 route list
const authList : Array<any> = [
    {path : '/mypage', element :<MyPageView />},
    {path : '/userinfo', element :<UserInfoView />}
];


// 캘린더 route list
const calendarList : Array<any> = [{path : '/calendar', element :<CalendarView />}];


// 카드 route list
const cardList : Array<any> = [];




export const routerList = [
    ...mainList,
    ...authList,
    ...calendarList,
    ...cardList,
];