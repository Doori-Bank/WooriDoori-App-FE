import HeaderBar from "./Header";
import BottomNav from "./NavBar";

const DefaultDiv = ({
    children,
    isPadding = true,
    isHome = false,
    className = '',
    isBottomNav = false,
    isHeader = false,
    // header props
    title = "",
    isShowBack = false,
    isShowClose = true,
    isShowSetting = false,
    onBack,
    onClose,
    onClickSetting,
    headerClassName = "",
    isMainTitle = false
}:
    {
        children: React.ReactNode,
        isPadding?: boolean,
        isHome?: boolean,
        className?: string,
        isBottomNav?: boolean,
        isHeader?: boolean,

        // header props
        title?: string;
        isShowBack?: boolean;
        isShowClose?: boolean;
        isShowSetting?: boolean;
        onBack?: () => void;
        onClose?: () => void;
        onClickSetting?: () => void;
        headerClassName?: string;
        isMainTitle?: boolean
    }
) => {
    return (
        <div className={`border flex flex-col overflow-auto relative min-h-[100vh] h-[100vh] m-auto bg-white font-sans w-full ${isPadding ? 'p-10 pb-[6rem]' : ''}  ${isHome ? 'default-img' : ''} ${className}`} style={{ maxWidth: '400px' }}>
            {
                isHeader &&
                <HeaderBar
                    title={title}
                    isShowBack={isShowBack}
                    isShowClose={isShowClose}
                    isShowSetting={isShowSetting}
                    onBack={onBack}
                    onClose={onClose}
                    onClickSetting={onClickSetting}
                    className={headerClassName}
                    isMainTitle={isMainTitle}
                />
            }
            <div className={`flex-1  ${isHeader ? 'pt-[5rem] pb-[5rem]' : ''}`}>
                {children}
            </div>
            {isBottomNav && <BottomNav />}
        </div>
    )
}

export default DefaultDiv;