function TransferList(props: any) {
  function handle_transfer(item: any, from: string, to: string) {
    if (props.onTransfer != null) props.onTransfer(item, from, to);
  }
  return (
    <div className="mt-4 flex h-32 h-full w-full items-center justify-center">
      <div
        style={{ height: '50vh' }}
        className="scroller m-4 flex-1 rounded bg-white p-2 shadow"
      >
        <div className="border-b border-gray-4 pb-2 text-primary">
          {props.options?.titleSource}
        </div>
        {props.source.map((item: any) => {
          return (
            <div
              onClick={() => handle_transfer(item, 'source', 'dest')}
              className="cursor-pointer p-2 hover:bg-gray-4"
            >
              {item.label}
            </div>
          );
        })}
      </div>
      <div
        style={{ height: '50vh' }}
        className="scroller m-4 h-94 flex-1 rounded bg-white p-2 shadow"
      >
        <div className="border-b border-gray-4 pb-2 text-primary">
          {props.options?.titleDest}
        </div>
        {props.dest.map((item: any) => {
          return (
            <div
              onClick={() => handle_transfer(item, 'dest', 'source')}
              className="cursor-pointer p-2 hover:bg-gray-4"
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TransferList;
