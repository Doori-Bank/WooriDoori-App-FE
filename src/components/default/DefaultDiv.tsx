const DefaultDiv = ({ children }: { children: React.ReactNode}) =>{
    return (
        <div className="border overflow-auto relative min-h-[100vh] h-[100vh] m-auto bg-white font-sans dark:bg-gray-700 p-10" style={{width:'400px'}}>
            {children}
        </div>
    )
}

export default DefaultDiv;