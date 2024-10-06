import React, { ReactElement, useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import LoadingSpinner from '../LoadingSpinner';
import './style.scss'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

interface SuggestionTextInputProps {
  dataSource?: {
    data: any[];
    onFilter: (item: any, query: string) => boolean;
  };
  readFromDataSource?: (query: string) => Promise<any[]>;
  onSuggestionSelected: (item: any) => void;
  onFreeConfirm?: (e: any) => void;
  suggestionRenderer: (item: any) => ReactElement;
  showListOnTop?: boolean;
  wrapperClassName?: string;
  componentRef?: any;
}

interface SuggestionTextInputState {
  suggestionList?: any[];
  isLoading: boolean;
}

function SuggestionTextInput(
  props: SuggestionTextInputProps &
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
) {

  console.log(758, props);

  const [state, setState] = useState<SuggestionTextInputState>({
    suggestionList: [],
    isLoading: true,
  });
  const [displayList, setDisplayList] = useState<any>(false)
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.componentRef != null) {
      props.componentRef.current = {};
      props.componentRef.current.triggerConfirm = triggerConfirm;
    }
  });

  const triggerConfirm = () => {
    if (inputRef.current == null || props.onFreeConfirm == null) return;

    props.onFreeConfirm(inputRef.current.value);
    inputRef.current.value = '';
  };

  const handle_onTextChange = (e: React.FormEvent<HTMLInputElement>) => {


    const element = e.target as HTMLInputElement;
    const query = element.value.trim();
    if (props.dataSource && query) {
      const suggestionList = props.dataSource.data.filter((item) => {
        if (!props.dataSource) return false;
        return props.dataSource.onFilter(item, query);
      });
      setState({ suggestionList, isLoading: false });
      setDisplayList(true)
    } else if (props.readFromDataSource != null) {
      props
        .readFromDataSource(query)
        .then((data: any[]) => {
          setState({ suggestionList: data, isLoading: false });
          setDisplayList(true)
        })
        .catch(console.log);
    } else {
      setState({ suggestionList: [], isLoading: false });
      setDisplayList(false)
    }
  };

  // useEffect(() => {
  //   console.log(20, displayList);

  // }, [displayList])

  const handle_suggestionClicked = (item: any) => {
    props.onSuggestionSelected(item);
    setState({ suggestionList: [], isLoading: false });
    setDisplayList(false)
    if (inputRef.current == null) return;
    inputRef.current.value = '';
    (inputRef.current as HTMLInputElement).focus();
  };

  const inputProps: any = { ...props };
  delete inputProps.dataSource;
  delete inputProps.dataSourceUrl;
  delete inputProps.onSuggestionSelected;
  delete inputProps.suggestionRenderer;

  return (
    <div className='SuggestionTextInput-component'>

      <input
        className='form-control search'
        {...inputProps}
        ref={inputRef}
        onChange={handle_onTextChange}
        type="text"
        onKeyDown={function (e) {
          const target = e.target as HTMLElement;
          if (
            e.key === 'Enter' &&
            inputRef.current != null &&
            props.onFreeConfirm != null
          ) {
            triggerConfirm();
            return;
          }

          const childCount = target.nextSibling?.childNodes.length || 0;
          if (
            e.code == (props.showListOnTop ? 'ArrowUp' : 'ArrowDown') &&
            childCount > 0
          ) {
            (target.nextSibling?.childNodes[0] as HTMLElement).focus();
          }
        }}
      />

      <div className='ul-user'
        style={{
          display: displayList ? 'block' : 'none',
          // top: props.showListOnTop ? '14px' : 'auto',
          // bottom: !props.showListOnTop ? 'auto' : '14px'
        }}
      >
        <i className='fa fa-close search-close' onClick={() => setDisplayList(false)}></i>
        <ul>
          {state.isLoading &&  <LoadingSpinner spinnerClassName="w-8 h-8" /> }
          {state.suggestionList?.map((item: any, index: number) => {
            if (index > 10) return '';
            return (
              <li
                tabIndex={0}
                key={item.id}
                className="cursor-pointer outline outline-0 duration-200 hover:bg-gray-2 focus:bg-gray-4"
                onKeyDown={function (e) {
                  const target = e.target as HTMLElement;
                  e.preventDefault();
                  if (e.code == 'Enter') handle_suggestionClicked(item);
                  if (props.showListOnTop) {
                    if (e.code == 'ArrowUp' && target.nextSibling)
                      (target.nextSibling as HTMLElement).focus();
                    if (e.code == 'ArrowDown' && target.previousSibling)
                      (target.previousSibling as HTMLElement).focus();
                  } else {
                    if (e.code == 'ArrowDown' && target.nextSibling)
                      (target.nextSibling as HTMLElement).focus();
                    if (e.code == 'ArrowUp' && target.previousSibling)
                      (target.previousSibling as HTMLElement).focus();
                  }
                }}
                onClick={() => handle_suggestionClicked(item)}
              >
                {props.suggestionRenderer(item)}
              </li>
            );
          })}
        </ul>
      </div >

    </div>
  );
}

export default SuggestionTextInput;
