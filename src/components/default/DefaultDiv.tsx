const DefaultDiv = ({ children }: { children: React.ReactNode}) =>{
    return (
        <div className="overflow-auto relative min-h-[100vh] h-[100vh] m-auto bg-white font-sans dark:bg-gray-700" style={{width:'400px'}}>
            {children}
        </div>
    )
}

export default DefaultDiv;