import React from "react";

type Props = {
  className?: string;
};

export default function DecorativeBackground({ className = "" }: Props) {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl"></div>
    </div>
  );
}
