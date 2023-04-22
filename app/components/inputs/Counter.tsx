'use client';

import { useCallback } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface CounterProps {
  title: string;
  subtitle: string;
  value: number;
  onChange: (value: number) => void;
}

/**
 * A React le encanta los contadores, pero este no usa useState, para variar
 */
const Counter: React.FC<CounterProps> = ({ title, subtitle, value, onChange }) => {
  
  const onAdd = useCallback(() => {
    onChange(value + 1);
  }, [onChange, value]);

  const onReduce = useCallback(() => {
    if (value === 1)  return; // Evita que la cuenta baje a 0 o menos.

    onChange(value - 1);
    
  }, [value, onChange])

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="font-medium">
        {title}
      </div>
      <div className="font-light text-gray-600">
        {subtitle}
      </div>
      <div className="flex flex-row items-center gap-4">
        <div onClick={onReduce} className="w-10 h-10 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 cursor-pointer hover:opacity-80 transition">
          <AiOutlineMinus size={24} />
        </div>
        <div className="font-light text-xl text-eutral-600">
          {value}
        </div>
        <div onClick={onAdd} className="w-10 h-10 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 cursor-pointer hover:opacity-80 transition">
          <AiOutlinePlus size={24} />
        </div>
      </div>
    </div>
  )
}

export default Counter