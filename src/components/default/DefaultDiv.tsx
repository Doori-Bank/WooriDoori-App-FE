const DefaultDiv = ({ children , isPadding = true , isHome = false }: { children: React.ReactNode, isPadding?: boolean, isHome? : boolean}) =>{
    return (
        <div className={`border overflow-auto relative min-h-[100vh] h-[100vh] m-auto bg-white font-sans p-10 pb-[10rem] w-full ${isPadding ? 'p-10' : ''}` } ${isHome ? 'default-img' : ''}`} style={{maxWidth:'400px'}}>
            {children}
        </div>
    )
}

export default DefaultDiv;