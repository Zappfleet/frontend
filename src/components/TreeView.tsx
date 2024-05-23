import classNames from 'classnames';
import { useState } from 'react';
import { FaChevronCircleDown, FaChevronCircleLeft } from 'react-icons/fa';

const TreeView = (props: any) => {
    console.log(200,props.data);

    const [expanded, setExpanded] = useState<any>({});

    const toggleCollapse = (node: any) => {
        if (expanded[node.id] != true) {
            setExpanded({ ...expanded, [node.id]: true })
        } else {
            const cloned = { ...expanded };
            delete cloned[node.id];
            setExpanded(cloned);
        }
    }


    function renderTree(node: any, is_root: boolean, is_expanded: boolean) {
        // console.log(100,node,node.children);

        return <ul className={
            classNames("overflow-hidden", {
                'pr-6': !is_root,
                'max-h-0': !is_expanded,
                'max-h-screen': is_expanded,
            })}>
            {node.children?.map((item: any) => {
                const hasChildren = item.children?.length >= 1;
                const is_expanded = expanded[item.id] == true;
                const isrootwithexpanded = hasChildren === true ? true : false
                //  is_root === true && hasChildren === true ? true : false

                //  console.log(55,isrootwithexpanded,item.id,hasChildren,is_root,item.children);


                const CollapseIcon = is_expanded ?
                    <FaChevronCircleDown onClick={() => toggleCollapse(item)} size={30} className={"px-2 cursor-pointer"} /> :
                    <FaChevronCircleLeft onClick={() => toggleCollapse(item)} size={30} className={"px-2 cursor-pointer"} />
                return <li key={item.id}>
                    <div className={
                        classNames('flex items-center', {
                            "mr-7.5": !hasChildren
                        })
                    }>
                        {hasChildren && CollapseIcon}

                        <input id={props.checkboxId(item.id)} onChange={(e) => props.handle_checkChange(e, item)} type='checkbox' aria-isrootwithexpanded={isrootwithexpanded} className='ml-2' />
                        <label className='inline-block p-1'>{item.title}</label>
                    </div>
                    {item.children && renderTree(item, false, is_expanded)}
                </li>
            })}
        </ul>
    }

    return props.data && renderTree(props.data, true, true);
};



export default TreeView;