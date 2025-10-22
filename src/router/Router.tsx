
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routerList } from "./RouterList";
import { Suspense } from "react";

const Router = () => {
    return (
        <BrowserRouter>
        <Suspense fallback={<div className="w-full h-[100vh] flex items-center justify-center">Loading..</div>}>
            <Routes>
                {
                    routerList.map((route, index) => {
                        return <Route key={index} path={route?.path ?? '/'} element={route?.element?? <div>route 실패..</div>} />
                    })
                }
            </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default Router;