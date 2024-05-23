import { useState } from "react";

export default function useItemSetToggle({ defaultIds, onlyOne }: any = {}) {

    const [items, setItems] = useState<any>(defaultIds || []);
    const toggleItem = (itemId: string) => {
        if (items.includes(itemId)) {
            setItems(items.filter((id: string) => { return itemId != id }))
        } else {
            setItems(onlyOne ? [itemId] : [...items, itemId])
        }
    }
    return {
        items,
        toggleItem
    }
}