import { useState } from 'react';

const BasicSwitcher = ({ defaultValue, handleChange }: any) => {
  const [enabled, setEnabled] = useState(defaultValue);

  return (
    <div x-data="{ switcherToggle: false }">
      <label
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative ">
          <input
            type="checkbox"
            className="sr-only"
            onChange={() => {
              const oldValue = enabled;
              const newValue = !enabled;
              setEnabled(newValue);
              if (handleChange) {
                const onError = () => setEnabled(oldValue);
                handleChange(newValue, onError)
              }
            }}
          />
          <div className={`h-5 w-14 rounded-full bg-meta-9 shadow-inner dark:bg-[#5A616B] ${enabled && '!bg-meta-10'}`}></div>
          <div
            className={`dot absolute left-0 -top-1 h-7 w-7 rounded-full bg-white shadow-switch-1 transition ${enabled && '!right-0 !translate-x-full !bg-primary dark:!bg-white'
              }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default BasicSwitcher;
