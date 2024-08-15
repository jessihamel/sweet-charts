import { useEffect, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';

import { COLOR_SCALE_OPTIONS, SCALE_TYPE_LINEAR } from '../../consts';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { MapState, setColors } from '../../store/mapSlice';
import { Button, Label } from './Shared';

const DEFAULT_COLOR = '#000000';

const DEFAULT_EDITING_COLOR = {
  color: null,
  i: null,
};

const useColorsProps = () => {
  const dispatch = useAppDispatch();
  const dispatchSetColors = (colors: MapState['colors']) => {
    dispatch(setColors(colors));
  };

  const colors = useAppSelector(state => state.map.colors);
  const colorScale = useAppSelector(state => state.map.colorScale);

  return {
    colors,
    colorScale,
    setColors: dispatchSetColors,
  };
};

const Colors = () => {
  const { colors, colorScale, setColors } = useColorsProps();

  const [pickerColor, setPickerColor] = useState(DEFAULT_COLOR);

  const [editingColor, setEditingColor] = useState<{ color: null | string; i: null | number }>(
    DEFAULT_EDITING_COLOR
  );

  const pickerRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setEditingColor(DEFAULT_EDITING_COLOR);
        setPickerColor(DEFAULT_COLOR);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pickerRef]);

  return (
    <div>
      <Label>Select Colors</Label>
      <div className="flex flex-col gap-3 px-2 py-1 mt-2 ml-4">
        {colors.map((color, i) => {
          const isFirst = i === 0;
          const isLast = i === colors.length - 1;
          const isDisabled =
            COLOR_SCALE_OPTIONS[colorScale].type === SCALE_TYPE_LINEAR && !isFirst && !isLast;
          return (
            <div
              className={`flex justify-between items-center ${
                isDisabled && 'opacity-20 pointer-events-none cursor-not-allowed'
              }`}
              key={`${i}`}
            >
              <div className="flex gap-3 items-center">
                <div>
                  <span style={{ fontFamily: "'Ubuntu Mono', monospace" }}>{color}</span>
                  {i === editingColor.i && (
                    <div
                      className="absolute px-2 pt-2 pb-1 bg-white shadow-sm border border-slate-200 rounded"
                      ref={pickerRef}
                    >
                      <SketchPicker
                        color={pickerColor}
                        disableAlpha={true}
                        onChange={color => {
                          setPickerColor(color.hex);
                        }}
                        onChangeComplete={color => {
                          const newColors = [...colors];
                          newColors[i] = color.hex;
                          setColors(newColors);
                          setPickerColor(color.hex);
                        }}
                        presetColors={[]}
                      />
                      <div className="flex justify-between border-t mt-1 pt-1 border-slate-200">
                        <button
                          className="m-2 px-2 border border-gray-300 rounded-sm hover:bg-slate-100"
                          onClick={() => {
                            setEditingColor(DEFAULT_EDITING_COLOR);
                            setPickerColor(DEFAULT_COLOR);
                          }}
                        >
                          Set
                        </button>
                        <button
                          className="m-2 px-2 border border-gray-300 rounded-sm hover:bg-slate-100"
                          onClick={() => {
                            if (!editingColor.color) {
                              return;
                            }
                            const newColors = [...colors];
                            newColors[i] = editingColor.color;
                            setColors(newColors);
                            setEditingColor(DEFAULT_EDITING_COLOR);
                            setPickerColor(DEFAULT_COLOR);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className="flex items-center gap-3 [&>div:first-child]:hover:border [&>div:first-child]:hover:border-slate-400 [&>div:first-child]:hover:scale-[105%] [&>div:last-child]:hover:scale-[112%]"
                  onClick={() => {
                    if (editingColor.i === i) {
                      setEditingColor(DEFAULT_EDITING_COLOR);
                      setPickerColor(DEFAULT_COLOR);
                    }
                    setEditingColor({ color, i });
                    setPickerColor(color);
                  }}
                >
                  <div
                    className="w-16 h-4 rounded cursor-pointer"
                    style={{ background: color }}
                  ></div>
                  <div className="flex items-center text-sm text-slate-600 gap-1 cursor-pointer border-b border-dashed border-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mb-0.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>

                    <div>Edit</div>
                  </div>
                </div>
              </div>
              {colors.length !== 1 && (
                <div
                  className="cursor-pointer hover:scale-[112%]"
                  onClick={() => setColors(colors.filter((_, idx) => idx !== i))}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2">
        <Button onClick={() => setColors([...colors, '#000000'])}>Add color</Button>
      </div>
    </div>
  );
};

export default Colors;
