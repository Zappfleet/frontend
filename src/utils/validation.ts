import { useEffect, useState } from "react";

export function useValidateForm(validationRules: any, formData: any) {

//console.log(102, validationRules, formData);

    const [errors, setErrors] = useState<any>({});

    function getNestedValue(obj: any, path: string) {
        return path.split('.').reduce((value, key) => value && value[key], obj);
    }

    function refreshData() {
        const newErrors: any = {};

        for (const field in validationRules) {
            const fieldErrors: string[] = [];
            const rules = validationRules[field];
            const fieldValue = getNestedValue(formData, field);

            for (const validate in rules) {
                switch (validate) {
                    case 'required':
                        if (fieldValue === '' || fieldValue === undefined || fieldValue === null || (typeof fieldValue === 'string' && fieldValue.trim() === '')) {
                            fieldErrors.push(`فیلد ${rules?.showName || field} الزامی می‌باشد`);
                        }
                        break;
                    case 'min':
                        if (parseInt(fieldValue) < rules?.min) {
                            fieldErrors.push(`مقدار ${rules?.showName || field} نباید کمتر از ${rules?.min} باشد`);
                        }
                        break;
                    case 'pattern':
                        if (rules.pattern && !rules.pattern.test(fieldValue)) {
                            fieldErrors.push(`فرمت ${rules?.showName || field} صحیح نمی‌باشد`);
                        }
                        break;
                    case 'match':
                        if (fieldValue !== getNestedValue(formData, rules?.matchField)) {
                            fieldErrors.push(`فیلد ${rules?.showName || field} باید با ${rules?.matchField} مطابقت داشته باشد`);
                        }
                        break;
                    // Add other validation cases here
                }
            }

            if (fieldErrors.length > 0) {
                newErrors[field] = fieldErrors;
            }
        }

        setErrors(newErrors);
    }

    useEffect(() => {
        refreshData();
    }, [formData]);

    return {
        errors,
        refreshData
    }
};

// {validateErrors?.attachFile?.length > 0 &&
//     <>
//         <div className='validate'>
//             <i className='fa fa-exclamation-triangle'></i>
//             <div className='error-msg'> {validateErrors?.attachFile?.map((error: any) => { return <p>{error}</p> })} </div>
//         </div>
//     </>
// }