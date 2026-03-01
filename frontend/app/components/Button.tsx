"use client";

export const PrimaryButton = ({children, onClick}: {
    children: React.ReactNode,
    onClick: () => void
}) => {
    return(
        <button type="button" className="text-white bg-slate-800 box-border border border-transparent hover:bg-slate-900 focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none rounded-xl cursor-pointer">{children}</button>
    )
} 