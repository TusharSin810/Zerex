"use client";

export const PrimaryButton = ({children, onClick}: {
    children: React.ReactNode,
    onClick: () => void
}) => {
    return(
        <button onClick={onClick} type="button" className="text-white bg-cyan-600 box-border border border-transparent hover:bg-cyan-700 focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2 focus:outline-none rounded-xl cursor-pointer">{children}</button>
    )
} 

export const SecondaryButton = ({children, onClick, prefix}: {
    children: React.ReactNode,
    onClick: () => void,
    prefix?: React.ReactNode,
}) => {
    return(
        <button onClick={onClick} type="button" className="text-white bg-amber-300 box-border border border-transparent hover:bg-amber-400 focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2 focus:outline-none rounded-xl cursor-pointer flex">
            <div>
                {prefix}
            </div>
            <div>
                {children}
            </div>
        </button>
    )
}