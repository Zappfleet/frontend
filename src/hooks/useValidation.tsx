import { useState, useRef } from "react"


export default function useValidation(config: any) {

    const [errors, setErrors] = useState({});
    const refData = useRef({});


    const Routine: any = {
        isRequired: (inputValue: any, configValue: any) => {
            return inputValue != null;
        },
        isMinLength: (inputValue: any, configValue: any) => {
            return inputValue?.length >= configValue;
        }
    }

    const validate = (input: any, ignoreFields: string[] = []) => {
        const errors: any = {};

        Object.entries(input).map((entry) => {
            const [key, value] = entry;
            const checkRoutines = config[key]

            if (ignoreFields.includes(key)) return;

            if (checkRoutines != null) {
                Object.keys(checkRoutines).map((checkRoutine: string) => {
                    const isOk = Routine[checkRoutine](value, config?.[key]?.[checkRoutine]?.value);
                    if (!isOk) {
                        errors[key] = config?.[key]?.[checkRoutine]?.message;
                    }
                })
            }
        })

        refData.current = errors;
        setErrors(errors);
        const isInvalid = Object.keys(errors).length > 0;
        return isInvalid;
    }

    function appendManuallError(manuallError: any) {
        setErrors({ ...refData.current, ...manuallError })
    }

    function clearErrors() {
        setErrors({});
        refData.current = {};
    }

    return {
        validate,
        errors,
        appendManuallError,
        clearErrors
    }
}