
export default function ExpandableBox({ children, expanded }: any) {

    return <div
        style={{
            maxHeight: expanded ? 600 : 0,
            paddingTop: expanded ? 5 : 0,
            paddingBottom: expanded ? 5 : 0,
        }}
        className={"px-2 duration-300 overflow-hidden"}>
        <div className="border-b border-gray-4 ">
            {children}
        </div>

    </div>
}

