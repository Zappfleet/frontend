import React, { useState } from 'react';
import {
  persianDateToGregorian,
  secondsToHMS,
  convertToJalaliDateTiem,
  convertPersianToEnglishDigits,
  translateAction,
  convertToJalali, convertGregorianToJalali
} from '../../../utils/utils.js';
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary.js';

// Define the props for TreeNode
interface TreeNodeProps {
  node: any; // Change type to 'any' or 'unknown' for simplicity
  path: string | null;
  checked: string[];
  onChange: (path: string, isChecked: boolean) => void;
  hideLabel?: boolean; // New prop to hide label
}

// TreeNode Component
const TreeNode: React.FC<TreeNodeProps> = ({ node, path, checked, onChange, hideLabel }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    const effectivePath = path === null ? '' : path;
    const strippedPath = effectivePath.replace(/^\./, ''); // Remove leading dot if present
    onChange(strippedPath, isChecked);
    handleChildChange(node, effectivePath, isChecked);
  };

  const handleChildChange = (node: any, basePath: string, isChecked: boolean) => {
    if (!node || typeof node !== 'object') return;
    Object.keys(node).forEach((key) => {
      const childPath = `${basePath}.${key}`.replace(/^\./, ''); // Remove leading dot if present
      onChange(childPath, isChecked);
      handleChildChange(node[key], childPath, isChecked);
    });
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const hasChildren = node && typeof node === 'object' && !Array.isArray(node);

  // Handle the case where path might have a leading dot
  const effectivePath = path === null ? '' : path;
  const keyLabel = translateAction(
    effectivePath
      .split('.')
      .filter((part) => part !== 'null' && part !== '')
      .pop() || ''
  );

  const getParentCheckboxState = (): 'checked' | 'indeterminate' | 'unchecked' => {
    if (!hasChildren) return checked.includes(effectivePath.replace(/^\./, '')) ? 'checked' : 'unchecked';

    const childrenKeys = Object.keys(node);
    const selectedChildren = childrenKeys.filter((key) => checked.includes(`${effectivePath}.${key}`.replace(/^\./, '')));
    const allChildrenSelected = selectedChildren.length === childrenKeys.length;
    const someChildrenSelected = selectedChildren.length > 0 && selectedChildren.length < childrenKeys.length;

    if (allChildrenSelected) {
      return 'checked';
    } else if (someChildrenSelected) {
      return 'indeterminate';
    } else {
      return 'unchecked';
    }
  };

  const checkboxState = getParentCheckboxState();

  return (
    <div className="tree-node">
      {!hideLabel && (
        <div className="tree-node-label">
          {hasChildren && (
            <button onClick={handleToggle} className="tree-node-toggle">
              {isExpanded ? '-' : '+'}
            </button>
          )}
          <label className="checkbox-container">
            <input
              type="checkbox"
              className={`tree-node-checkbox ${checkboxState}`}
              checked={checkboxState === 'checked'}
              onChange={handleChange}
              ref={(el) => {
                if (el) {
                  el.indeterminate = checkboxState === 'indeterminate';
                }
              }}
            />
            <span className="checkmark" />
          </label>
          <span>{keyLabel}</span>
        </div>
      )}
      {((isExpanded && hasChildren) || (hideLabel===true && hasChildren)) && (
        <div className="tree-node-children">
          {Object.keys(node).map((key) => (
             
                <TreeNode
              key={key}
              node={node[key]}
              path={`${effectivePath}.${key}`}
              checked={checked}
              onChange={onChange}
              hideLabel={false} // Pass false to ensure children labels are shown
            />
             
          
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
