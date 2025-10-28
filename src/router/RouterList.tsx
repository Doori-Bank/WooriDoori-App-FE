
/**
 * list 안에 내용은 아래와 같이 정의해주세요!
 * {path : '/test', element :<Test />}
 * 
 */

// import Test from "@/components/Test";
import CalendarView from "@/pages/CalendarView";
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
];


// 캘린더 route list
const calendarList : Array<any> = [{path : '/calendar', element :<CalendarView />}];


// 카드 route list
const cardList : Array<any> = [];


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
    ...reportList,
];