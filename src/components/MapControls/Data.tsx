import debounce from 'lodash.debounce';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { AppContext } from '../../AppContext';
import { BASE_MAP_OPTIONS } from '../../consts';
import { Label, SELECT_CLASS } from './Shared';

function Data() {
  const { baseMap, dataInput, dataKey, dataMode, mapData, setDataInput, setDataKey, setDataMode } =
    useContext(AppContext);

  const [textAreaInput, setTextAreaInput] = useState(dataInput);

  const dataKeyOptions = BASE_MAP_OPTIONS[baseMap].dataKeys;

  const debouncedSetDataInput = useMemo(
    () =>
      debounce(value => setDataInput(value), 300, {
        leading: true,
        trailing: true,
      }),
    [setDataInput]
  );

  const resetCsvData = useCallback(() => {
    if (!mapData?.features || !dataKey) {
      return;
    }
    const values = new Set(mapData.features.map(f => f.properties![dataKey]));
    const uniq = Array.from(values).sort((a, b) => {
      if (typeof a === 'string') {
        return a.localeCompare(b);
      }
      return a - b;
    });
    const csv = uniq.map(v => [v, 0].join(',')).join('\n');
    setDataInput(csv);
    setTextAreaInput(csv);
  }, [dataKey, mapData, setDataInput]);

  useEffect(() => {
    resetCsvData();
  }, [resetCsvData]);

  useEffect(() => debouncedSetDataInput(textAreaInput), [debouncedSetDataInput, textAreaInput]);

  const handleReset = () => {
    resetCsvData();
  };

  return (
    <>
      <div>
        <Label>Select Data Mode</Label>
        <div className="ml-4">
          <select
            id="dataMode"
            className={SELECT_CLASS}
            onChange={event => setDataMode(event.target.value as 'RANDOM' | 'CUSTOM')}
            value={dataMode}
          >
            {[
              ['RANDOM', 'Random'],
              ['CUSTOM', 'Custom CSV'],
            ].map(([key, label]) => (
              <option className="" key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {dataMode === 'CUSTOM' && (
        <>
          <div>
            <Label>Select Data Key</Label>
            <div className="ml-4">
              <select
                id="dataKey"
                className={SELECT_CLASS}
                onChange={event => setDataKey(event.target.value)}
                value={dataKey || ''}
              >
                {dataKeyOptions.map(k => (
                  <option className="" key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label>Edit CSV Data</Label>
            <div className="ml-4">
              <textarea
                className="px-2 py-1 mt-4 mb-2 rounded-sm border border-slate-500 w-full max-w-96 min-h-48"
                onChange={e => setTextAreaInput(e.target.value)}
                value={textAreaInput}
              />
              <button
                className="flex items-center text-sm gap-1 px-2 py-1 border border-gray-300 rounded-md hover:bg-slate-100"
                onClick={handleReset}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                <div>Reset CSV Data</div>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Data;
