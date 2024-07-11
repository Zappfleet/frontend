import React, { useRef, useState } from 'react';
import { useEffect } from 'react';

import PlaqueImg from '../../assets/imgs/plaque.png';
import { plaqueLevels, textIsNumeric } from '../../lib/string';
import classNames from 'classnames';

export default function PlaqueInput({ small, disabled, onChange, defaultValue, inputRef, value }: any) {
    const threeDigitRef = useRef<any>();
    const characterRef = useRef<any>();
    const twoDigitRef = useRef<any>();
    const serialRef = useRef<any>();

    
    

    const [state, setState] = useState(defaultValue || {});
   // console.log(74,value,state);
    const handleOnChange = (e: any, ref: any) => {
        const inputName = e.target.name;
        const maxLength = e.target.maxLength;
        const val = e.target.value;
        if (!textIsNumeric(val) && inputName !== 'character') return;

        const newValue = { ...state, [inputName]: val };
        setState(newValue);
        if (onChange) {
            onChange(newValue);
        }
        if (val.length == maxLength) {
            ref.current.focus();
        }
    };


    if (inputRef != null) {
        inputRef.current = {
            resetToDefaults: () => setState(defaultValue || {}),
            setValues: (value: any) => setState(value)
        }
    }

    return (
        <div className={classNames("plaque-container flex items-center", { "scale-75 !m-0": small })}>
            <input
                disabled={disabled}
                className="plaque-input bordered-input"
                name="serial"
                placeholder="..."
                maxLength={2}
                onChange={(e) => handleOnChange(e, characterRef)}
                autoComplete="off"
                ref={serialRef}
                value={value?.serial || state.serial || ''}
            />
            <input
                disabled={disabled}
                className="plaque-input"
                name="threeDigit"
                placeholder="..."
                maxLength={3}
                onChange={(e) => handleOnChange(e, serialRef)}
                autoComplete="off"
                ref={threeDigitRef}
                value={value?.threeDigit || state.threeDigit || ''}
            />
            {disabled ?
                <span className='px-2'>{value?.character || state.character}</span> :
                <select
                    disabled={disabled}
                    className="plaque-input min-w-min"
                    name="character"
                    onChange={(e) => handleOnChange(e, threeDigitRef)}
                    autoComplete="off"
                    ref={characterRef}
                    value={value?.character || state.character}
                >
                    {plaqueLevels.map((p, index) => {
                        return (
                            <option key={index} value={p.value}>
                                {p.value}
                            </option>
                        );
                    })}
                </select>
            }


            <input
                disabled={disabled}
                className="plaque-input"
                name="twoDigit"
                placeholder="..."
                maxLength={2}
                onChange={(e) => handleOnChange(e, characterRef)}
                autoComplete="off"
                ref={twoDigitRef}
                value={value?.twoDigit || state.twoDigit || ''}
            />
            <img src={PlaqueImg} alt="plq" className="plaque-img" />
        </div>
    );
}
