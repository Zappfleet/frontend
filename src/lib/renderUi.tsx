export default function renderUi(element: React.ReactElement | string): { if: (a: boolean) => React.ReactElement | string } {
    return {
        if: (condition: boolean) => {
            if (condition) return element;
            return "";
        }
    }
}

export function renderWithPrefix(text: string) {
    return <>
        <span className="text-primary">{" : "}</span>
        <span>{`${text}`}</span>
    </>
}