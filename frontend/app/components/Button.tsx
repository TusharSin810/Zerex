"use client";

export const PrimaryButton = ({children, onClick, disabled}: {
    children: React.ReactNode,
    onClick: () => void,
    disabled?: boolean,
}) => {
    return(
        <button onClick={onClick} disabled={disabled} type="button" className="disabled:opacity-50 disabled:cursor-not-allowed text-gray-200 bg-cyan-600 box-border border border-transparent hover:bg-cyan-700 focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2 focus:outline-none rounded-xl cursor-pointer">
            {children}
        </button>
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

export const InvertedPrimaryButton = ({children, onClick}: {
    children: React.ReactNode,
    onClick: () => void
}) => {
    return(
        <button onClick={onClick} type="button" className="text-cyan-600 bg-gray-200 box-border border border-transparent hover:bg-gray-300 focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2 focus:outline-none rounded-xl cursor-pointer">{children}</button>
    )
} 
