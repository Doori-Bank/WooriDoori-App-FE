
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routerList } from "./RouterList";
import { Suspense } from "react";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { AdminHeaderProvider } from "@/context/AdminHeaderContext";

// 관리자 라우트를 Provider로 감싸는 컴포넌트
const AdminRoutesWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminAuthProvider>
      <AdminHeaderProvider>
        {children}
      </AdminHeaderProvider>
    </AdminAuthProvider>
  );
};

const Router = () => {
    return (
        <BrowserRouter>
        <Suspense fallback={<div className="w-full h-[100vh] flex items-center justify-center">Loading..</div>}>
            <Routes>
                {
                    routerList.map((route, index) => {
                        // 관리자 라우트인 경우 Provider로 감싸기
                        const isAdminRoute = route.path.startsWith('/admin');
                        const routeElement = route?.element ?? <div>route 실패..</div>;
                        
                        return (
                          <Route 
                            key={index} 
                            path={route?.path ?? '/'} 
                            element={
                              isAdminRoute ? (
                                <AdminRoutesWrapper>
                                  {routeElement}
                                </AdminRoutesWrapper>
                              ) : (
                                routeElement
                              )
                            } 
                          />
                        );
                    })
                }
            </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default Router;