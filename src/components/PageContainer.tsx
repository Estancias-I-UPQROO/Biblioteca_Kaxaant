import type { PropsWithChildren } from "react"

export const PageContainer = ({children}: PropsWithChildren) => {
    return (
        <main className="mx-auto w-9/12 py-20 space-y-12 text-gray-700 text-lg sm:text-start text-center">
            {children}
        </main> 
    )
}
 