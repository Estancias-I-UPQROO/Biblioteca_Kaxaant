import type { PropsWithChildren } from "react"

export const PageHeader = ({children}: PropsWithChildren) => {
    return (
        <header className="bg-gray-100">
            <h1 className="w-9/12 mx-auto py-14 uppercase font-semibold text-3xl text-gray-700 text-center md:text-start">{children}</h1>
        </header>
    )
}
