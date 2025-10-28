// import bgImg from 'src/assets/background.jpg';
const DefaultDiv = ({ children, isHome = false }: { children: React.ReactNode, isHome? : boolean}) =>{ // #f7f7f750 #f2f4f650
    return (
        <div className={`border overflow-auto relative min-h-[100vh] h-[100vh] m-auto bg-white font-sans dark:bg-gray-700 p-10 pb-[10rem] w-full ${isHome ? 'default-img' : ''}`} style={{maxWidth:'400px'}}>
            {children}
        </div>
    )
}

export default DefaultDiv;