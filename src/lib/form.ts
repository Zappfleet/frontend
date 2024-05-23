export function clearFormInputs(formRef: any) {
    const nodes = formRef.current.querySelectorAll('input');
    for (let i = 0; i < nodes.length; i++) {
        const inputNode = nodes[i];
        if (inputNode.type == 'checkbox') {
            inputNode.checked = false
        } else {
            inputNode.value = "";
        }
    }

    const selectNodes = formRef.current.querySelectorAll('select');
    for (let i = 0; i < selectNodes.length; i++) {
        const selectNode = selectNodes[i];
        selectNode.value="";
    }

}

export function fillFormInputs(formRef: any, data: any) {
    const nodes = formRef.current.querySelectorAll('input');
    const formData: any = {};
    for (let i = 0; i < nodes.length; i++) {
        const inputNode = nodes[i];
        if (data[inputNode.name] != null) {
            inputNode.value = data[inputNode.name];
        }
    }
    const selectNodes = formRef.current.querySelectorAll('select');
    for (let i = 0; i < selectNodes.length; i++) {
        const selectNode = selectNodes[i];
        if (data[selectNode.name] != null) {
            selectNode.value = data[selectNode.name];
        }
    }
    return formData;
}

export function readFormInputs(formRef: any) {
    const inputNodes = formRef.current.querySelectorAll('input');
    const formData: any = {};
    for (let i = 0; i < inputNodes.length; i++) {
        const inputNode = inputNodes[i];
        if (inputNode.type == 'checkbox') {
            formData[inputNode.name] = inputNode.checked;
        } else {
            formData[inputNode.name] = inputNode.value;
        }
    }

    
    const selectNodes = formRef.current.querySelectorAll('select');
    for (let i = 0; i < selectNodes.length; i++) {
        const selectNode = selectNodes[i];
        formData[selectNode.name] = selectNode.value;
    }

    return formData;

}
