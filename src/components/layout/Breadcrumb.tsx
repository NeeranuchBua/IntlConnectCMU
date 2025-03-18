'use client';
import React, { ReactNode } from 'react'
import { useAppContext } from "@/lib/context/AppContext";

const Breadcrumb = ({children}:{children:ReactNode}) => {
    const {showSidebar} = useAppContext()
    return (
        <div className={`fixed z-[999] max-h-[56px] min-h-[56px] h-[56px] top-[0px] ${showSidebar ? 'ml-0':'ml-8'} flex justify-start items-center`}>
            {children}
        </div>
    )
}

export default Breadcrumb