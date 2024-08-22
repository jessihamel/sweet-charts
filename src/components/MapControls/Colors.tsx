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
    DEFAULT_EDITING_COLOR,
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
      <div className="ml-4 mt-2 flex flex-col gap-3 px-2 py-1">
        {colors.map((color, i) => {
          const isFirst = i === 0;
          const isLast = i === colors.length - 1;
          const isDisabled =
            COLOR_SCALE_OPTIONS[colorScale].type === SCALE_TYPE_LINEAR && !isFirst && !isLast;
          return (
            <div
              className={`flex items-center justify-between ${
                isDisabled && 'pointer-events-none cursor-not-allowed opacity-20'
              }`}
              key={`${i}`}
            >
              <div className="flex items-center gap-3">
                <div>
                  <span style={{ fontFamily: "'Ubuntu Mono', monospace" }}>{color}</span>
                  {i === editingColor.i && (
                    <div
                      className="absolute rounded border border-slate-200 bg-white px-2 pb-1 pt-2 shadow-sm"
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
                      <div className="mt-1 flex justify-between border-t border-slate-200 pt-1">
                        <button
                          className="m-2 rounded-sm border border-gray-300 px-2 text-brand hover:bg-slate-100"
                          onClick={() => {
                            setEditingColor(DEFAULT_EDITING_COLOR);
                            setPickerColor(DEFAULT_COLOR);
                          }}
                        >
                          Set
                        </button>
                        <button
                          className="m-2 rounded-sm border border-gray-300 px-2 text-brand hover:bg-slate-100"
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
                <button
                  className="flex items-center gap-3 [&>div:first-child]:hover:scale-[105%] [&>div:first-child]:hover:border [&>div:first-child]:hover:border-slate-400 [&>div:last-child]:hover:scale-[112%]"
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
                    className="h-4 w-16 cursor-pointer rounded"
                    style={{ background: color }}
                  ></div>
                  <div className="flex cursor-pointer items-center gap-1 text-sm text-brand underline decoration-brand decoration-dashed underline-offset-[3px]">
                    Edit
                  </div>
                </button>
              </div>
              {colors.length !== 1 && (
                <div
                  className="cursor-pointer text-brand hover:scale-[112%]"
                  onClick={() => setColors(colors.filter((_, idx) => idx !== i))}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
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
