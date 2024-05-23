import React, { ReactElement, useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import LoadingSpinner from '../widgets/LoadingSpinner';

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
  const [state, setState] = useState<SuggestionTextInputState>({
    suggestionList: [],
    isLoading: true,
  });
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
    } else if (props.readFromDataSource != null) {
      props
        .readFromDataSource(query)
        .then((data: any[]) => {
          setState({ suggestionList: data, isLoading: false });
        })
        .catch(console.log);
    } else {
      setState({ suggestionList: [], isLoading: false });
    }
  };

  const displayList = (state.suggestionList?.length || 0) > 0;

  const handle_suggestionClicked = (item: any) => {
    props.onSuggestionSelected(item);
    setState({ suggestionList: [], isLoading: false });
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
    <div
      className={classNames(
        'relative my-4 flex flex-col',
        props.wrapperClassName
      )}
    >
      <input
        {...inputProps}
        ref={inputRef}
        onChange={handle_onTextChange}
        className={classNames(
          'z-10 rounded-md border border-gray-4 px-4 py-2 outline outline-0 duration-200 focus-within:shadow active:shadow',
          props.className || ''
        )}
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

      <ul
        style={{ zIndex: 1000000 }}
        className={classNames(
          'absolute left-0 right-0 flex overflow-hidden rounded-xl bg-white shadow duration-200 ',
          {
            'opacity-1 pointer-events-auto top-14 flex-col':
              !props.showListOnTop && displayList,
          },
          {
            'pointer-events-none top-6  flex-col  opacity-0':
              !props.showListOnTop && !displayList,
          },
          {
            'opacity-1 pointer-events-auto bottom-14  flex-col-reverse':
              props.showListOnTop && displayList,
          },
          {
            'pointer-events-none bottom-6  flex-col-reverse opacity-0':
              props.showListOnTop && !displayList,
          }
        )}
      >
        {state.isLoading && <LoadingSpinner spinnerClassName="w-8 h-8" />}
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
    </div>
  );
}

export default SuggestionTextInput;
